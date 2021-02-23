import React, {useContext, useState, useEffect, useRef, useMemo} from 'react';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import {useRouter} from 'next/router';
import {StickyContainer, Sticky} from 'react-sticky';
import {useDebouncedCallback} from 'use-debounce';
import renderHTML from 'react-render-html';
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


const transcript = [
  {
    "speaker": "Martin",
    "start_time": 1.32,
    "end_time": 8.55,
    "words": [
      {
        "text": "Hello,",
        "start_time": 1,
        "end_time": 2
      },
      {
        "text": "is",
        "start_time": 2.50,
        "end_time": 4.50
      },
      {
        "text": "now",
        "start_time": 5,
        "end_time": 7
      },
      {
        "text": "still",
        "start_time": 7.50,
        "end_time": 9.50
      },
      {
        "text": "a",
        "start_time": 10,
        "end_time": 12
      },
      {
        "text": "good",
        "start_time": 12.50,
        "end_time": 14.50
      },
      {
        "text": "time to",
        "start_time": 15,
        "end_time": 17
      },
      {
        "text": "chat?",
        "start_time": 17.50,
        "end_time": 19.50
      }
    ]
  },
  {
    "speaker": "John",
    "start_time": 10.24,
    "end_time": 16.33,
    "words": [
      {
        "text": "Yes,",
        "start_time": 20,
        "end_time": 22
      },
      {
        "text": "lets",
        "start_time": 22.50,
        "end_time": 24.50
      },
      {
        "text": "chat!",
        "start_time": 25,
        "end_time": 27
      }
    ]
  }
];

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
    const windowHeight = !!window ? window.innerHeight - 50 : 800;
    const [transcriptWords, setTranscriptWords] = useState([]);
    const [previousHighlightWordIndex, setPreviousHighlightWordIndex] = useState(0);
    const [highlightedSection, setHighlightedSection] = useState(null);
    const htmlToRender = useMemo(() => {
        if (!highlightedSection) {
            return article ? article.body : '';
        }

        
        const highlightedText = article.body.substring(...highlightedSection);
        return article.body.substring(0, highlightedSection[0]) +
            `<span>${highlightedText}</span>` +
            article.body.substring(highlightedSection[1]);
    }, [highlightedSection, article]);

    useEffect(() => {
        fetch(`/api/transcriptions/${`OxoM37Nv`}`)
            .then(response => {
                return response.json();
            })
            .then(json => {
                setTranscriptWords(json.transcript.map(speaker => speaker.words).flat());
            })
    }, []);

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

    const handleListen = (e) => {
        const word = transcriptWords.find(word => {
            return word.start_time <= e && word.end_time >= e;
        });

        if (!word) {
            setHighlightedSection(null);
            return;
        }

        const substringIndex = article.body.indexOf(word.text, previousHighlightWordIndex);

        if (substringIndex !== -1) {
            if (substringIndex !== previousHighlightWordIndex) {
                setPreviousHighlightWordIndex(substringIndex);
            }

            const endIndex = substringIndex + word.text.length + 1;
            // Subtract 1 from the starting index to make sure we
            // highlight the space before the word as well.
            setHighlightedSection([substringIndex, endIndex]);
        }
    }

    const handleSeeked = useDebouncedCallback((event) => {
        setHighlightedSection(null);
        const newTime = event.target.currentTime;
        const newPreviousHighlightWordIndex = transcriptWords.reduce((memo, currentWord) => {
            if (currentWord.end_time < newTime) {
                // Add an extra 1 to represent the space we need after each transcription group.
                return memo ? memo + currentWord.text.length + 1 : currentWord.text.length + 1;
            }

            return memo; 
        }, null);

        setPreviousHighlightWordIndex(newPreviousHighlightWordIndex ? newPreviousHighlightWordIndex : 0);
    }, 300);

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


            {!!audioURL && !playAudio && (
                <Sticky topOffset={windowHeight}>
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
                <Sticky topOffset={windowHeight}>
                    {({style}) => (
                        <div style={style}>
                            <AudioWrapper>
                                <div>
                                    <ReactAudioPlayer
                                        src={audioURL}
                                        onPlay={handlePlay}
                                        onPause={handleStop}
                                        onEnded={handleStop}
                                        onListen={handleListen}
                                        onSeeked={handleSeeked.callback}
                                        listenInterval={50}
                                        controls
                                    />
                                </div>
                            </AudioWrapper>
                        </div>
                    )}
                </Sticky>
            )}

            <Psst><i>Pssst.</i> You can highlight text to automatically translate it to English.</Psst>

            <SelectedTextPopover elementRef={articleBodyRef} articleBody={article.body} />
            <ArticleBody ref={articleBodyRef}>
                {/* {article.body} */}
                {renderHTML(htmlToRender)}
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

    span {
        font-weight: bold;
        border-radius: 5px;
        background-color: ${Colors.Primary};
        color: white;
    }
`;

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;
