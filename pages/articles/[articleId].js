import React, {useContext, useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import {useRouter} from 'next/router';
import {StickyContainer, Sticky} from 'react-sticky';
import {
    Container,
    HeroWrapper,
    Divider,
    Title,
    Button,
    Colors,
    devices,
    ImageAttribution,
    ImageWrapper,
    AudioWrapper,
    FakeAudioWidget
} from '../../components/styled';
import LoadingPage from '../../components/LoadingPage';
import SelectedTextPopover from '../../components/SelectedTextPopover';
import TypeList from '../../components/TypeList';
import useGuardArticle from '../../hooks/useGuardArticle';
import AppContext from '../../contexts/appContext';
import {
    createArticleReadStatus,
    getArticleReadStatus,
    deleteArticleReadStatus,
    getArticleAudioURL,
    getUserMetrics,
    updateUserListeningTimeActivityMetric
} from '../../services/articleService';
import {fetchArticleTranscription} from '../../services/transcriptionService';

// Every 30 seconds, we update the user's time metric in Firebase.
const TIME_METRIC_BATCH_LENGTH = 30;

function ArticlePage () {
    const router = useRouter();
    const {article, loading, error} = useGuardArticle(router.query.articleId);

    const {isAdmin, user} = useContext(AppContext);
    const [playAudio, setPlayAudio] = useState(false);
    const [readStatus, setReadStatus] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedPlayTime, setElapsedPlayTime] = useState(0);
    const [totalPlayTime, setTotalPlaytime] = useState(null);
    const articleBodyRef = useRef();
    const audioOffsetRef = useRef();
     // We can't use a conventional React ref due to the specific API
     // of react-audio-player. Instead, we can just use state to maintain an element
     // reference. It's weird, but it works.
    const [audioPlayerRef, setAudioPlayerRef] = useState(null);
    const windowHeight = !!window ? window.innerHeight - 50 : 800;
    const audioOffset = audioOffsetRef.current ?
        audioOffsetRef.current.getBoundingClientRect().top :
        windowHeight;
    const [transcript, setTranscript] = useState(null);

    const prepareTranscript = transcript => {
        return transcript.map(speaker => {
            const newParagraphObject = {
                type: 'newParagraph'
            };

            const words = speaker.words.map(word => {
                return {
                    ...word,
                    type: 'word'
                }
            });

            return [...words, newParagraphObject];
        }).flat();
    }

    useEffect(() => {
        if (article?.transcriptId) {
            fetchArticleTranscription(article.transcriptId)
                .then(json => {
                    // If the transcript isn't ready yet, or doesn't exist,
                    // we just get a null response, but with a 2XX code (202, specifically)
                    if (json) {
                        const preparedTranscript = prepareTranscript(json.transcript);
                        setTranscript(preparedTranscript);
                    }
                })
        }
    }, [article?.transcriptId]);

    useEffect(() => {
        if (user) {
            const getUserMetricsAsync = async () => {
                const userMetrics = await getUserMetrics(user.uid) 
                if (userMetrics.exists) {
                    const userMetricData = userMetrics.data();
                    setTotalPlaytime(userMetricData.time_listening || 0);
                }
            }
     
            getUserMetricsAsync();
        }
    }, [user]);

    useEffect(() => {
        if (article) {
            if (!article.free || user) {
                getArticleReadStatus(user.uid, article.id)
                    .then(readStatusRef => {
                        if (readStatusRef.docs.length > 0) {
                            setReadStatus(readStatusRef.docs[0]);
                        }
                    });
            }
            
            if (article.audio) {
                getArticleAudioURL(article.audio)
                    .then(url => setAudioURL(url))
                    .catch(error => console.log(error))
            }
        }
    }, [article]);

    useEffect(() => {
        // If the audio has been playing for 30 seconds since the last sync
        // go ahead and update the user's listening time.
        if (elapsedPlayTime >= TIME_METRIC_BATCH_LENGTH) {
            updateListeningMetric(elapsedPlayTime);
        }
    }, [elapsedPlayTime]);

    useEffect(() => {
        const playingInterval = setInterval(() => {
            if (isPlaying) {
                setElapsedPlayTime(currentPlayTime => currentPlayTime + 1);
            }
        }, 1000);

        return () => {
            clearInterval(playingInterval);
        }
    }, [isPlaying]);

    const updateListeningMetric = (timeDelta) => {
        updateUserListeningTimeActivityMetric(user.uid, totalPlayTime + timeDelta)
            .then(() => {
                setTotalPlaytime(totalPlayTime + timeDelta);
                setElapsedPlayTime(0);
            });
    }

    const handlePlay = () => {
        setIsPlaying(true);
    }

    const handleStop = () => {
        setIsPlaying(false);
    }

    const renderAdminUI = () => {
        if (isAdmin) {
            return (
                <AdminButtons>
                    <Button onClick={() => router.push(`/articles/${router.query.articleId}/edit`)}>Edit Article</Button>
                </AdminButtons>
            )
        }
    }

    const handleMarkAsRead = async () => {
        if (readStatus) {
            await deleteArticleReadStatus(readStatus.id);
            setReadStatus(null);
        } else {
            const readStatusRef = await createArticleReadStatus(user.uid, article.id);
            setReadStatus(readStatusRef);
        }
    }

    const handleWordClick = (startTime) => {
        if (audioPlayerRef) {
            audioPlayerRef.currentTime = startTime;
        }
    }

    const handleListen = (e) => {
        const updatedTranscript = transcript.reduce((memo, glyph) => {
            if (glyph.type !== 'word') {
                memo.push(glyph);
                return memo;
            }

            const wordIsActive = glyph.start_time <= e && glyph.end_time >= e;

            if (wordIsActive) {
                memo.push({
                    ...glyph,
                    highlight: true
                })
            } else {
                memo.push({
                    ...glyph,
                    highlight: false
                });
            }

            return memo;
        }, []);

        setTranscript(updatedTranscript);
    }

    const renderArticleBody = () => {
        if (!transcript) {
            return article.body;
        }

        const html = transcript.map((glyph, index) => {
            if (glyph.type === 'word') {
                return (
                    <Word
                        key={glyph.start_time}
                        highlight={glyph.highlight}
                        onClick={() => handleWordClick(glyph.start_time)}
                    >
                        {glyph.text}
                    </Word>
                );
            }

            if (glyph.type === 'newParagraph') {
                return [<br />, <br />];
            }
        });

        return html;
    }

    const handleAudioPlayerInitialization = (ref) => {
        if (!audioPlayerRef && !!ref) {
            setAudioPlayerRef(ref.audioEl.current);
        }
    }

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    if (!article) return null;

    const imageUserURL = article.image ? `${article.image.user.profile}?utm_source=leerly&utm_medium=referral` : '';

    return (
        <StickyContainer>
            <Container>
            <TitleWrapper>
                <Title>{article.title ? article.title : 'Placeholder Title'}</Title>
            </TitleWrapper>

            <Divider />

            {renderAdminUI()}

            <TypeList types={article.types} />

            <ArticleData>
                <a href={article.url} target='_blank'>Read original article ⟶</a>
            </ArticleData>

            {article.image && (
                <div>
                    <ImageWrapper>
                        <img src={article.image.urls.regular} />
                    </ImageWrapper>
                    <ImageAttribution>
                        Image from Unsplash, credit to <a href={imageUserURL} target='_blank'>{article.image.user.name}</a>
                    </ImageAttribution>
                </div>
            )}


            <AudioOffsetWrapper ref={audioOffsetRef}>
                {!!audioURL && !playAudio && (
                    <Sticky topOffset={audioOffset}>
                        {({style}) => (
                            <div style={style}>
                                <AudioWrapper>
                                    <FakeAudioWidget onClick={() => setPlayAudio(true)}>
                                        <span>Play audio</span> &#9658;
                                    </FakeAudioWidget>
                                </AudioWrapper>
                            </div>
                        )}
                    </Sticky>
                )}

                {!!audioURL && playAudio && (
                    <Sticky topOffset={audioOffset}>
                        {({style}) => (
                            <div style={style}>
                                <AudioWrapper>
                                    <div>
                                        <ReactAudioPlayer
                                            ref={handleAudioPlayerInitialization}
                                            src={audioURL}
                                            onPlay={handlePlay}
                                            onPause={handleStop}
                                            onEnded={handleStop}
                                            onListen={transcript ? handleListen : undefined}
                                            listenInterval={100}
                                            controls
                                        />
                                    </div>
                                </AudioWrapper>
                            </div>
                        )}
                    </Sticky>
                )}
            </AudioOffsetWrapper>

            <Psst><i>Pssst.</i> You can highlight text to automatically translate it to English.</Psst>

            <SelectedTextPopover elementRef={articleBodyRef} articleBody={article.body} />
            <ArticleBody ref={articleBodyRef}>
                {/* {article.body} */}
                {renderArticleBody()}
            </ArticleBody>

            {(!article.free || user) && (
                <ButtonRow>
                    <MarkAsReadButton read={!!readStatus} onClick={handleMarkAsRead}>
                        {!!readStatus ? 'Article read ✓' : 'Mark as read'}
                    </MarkAsReadButton>
                </ButtonRow>
            )}

            {article.free && !user && (
                <UpgradeWrapper>
                    <p>Enjoyed reading this? Want to improve your Spanish?</p>
                    <Button onClick={() => router.push('/register')}>Join leerly</Button>
                </UpgradeWrapper>
            )}

            </Container>
        </StickyContainer>
    );
}

export default ArticlePage;

const AudioOffsetWrapper = styled.div``;
const Psst = styled.p`
    text-align: center;
    color: #666;
    font-size: 16px;
`;
const TitleWrapper = styled(HeroWrapper)``;

const UpgradeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;

    span {
        max-width: 300px;
    }
`;
const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
`;
const MarkAsReadButton = styled(Button)`
    ${props => props.read ? `
        background-color: ${Colors.Green};
        border-color: ${Colors.Green};

        &:hover {
            background-color: ${Colors.DarkerGreen};
        }
    `: ''}

`;

const AdminButtons = styled.div`
    margin-bottom: 30px;
`;

const ArticleBody = styled.div`
    padding: 10px;
    margin-top: 30px;
    font-size: 18px;
    line-height: 30px;
    white-space: pre-wrap;
    font-family: 'Source Sans Pro', sans-serif;

    @media ${devices.laptop} {
        padding: 30px;
    }
`;

const Word = styled.span`
    ${props => props.highlight ? `
        font-weight: bold;
        border-radius: 5px;
        background-color: ${Colors.Primary};
        color: white;
    `: ``}
`;

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;
