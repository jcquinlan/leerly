import React, {
    useContext,
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback
} from 'react';
import moment from 'moment';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    Title,
    Button,
    Colors,
    devices,
    ImageAttribution,
    ImageWrapper,
    AudioWrapper,
    FakeAudioWidget,
    HelpText,
    NarrowContainer
} from '../../components/styled';
import LoadingPage from '../../components/LoadingPage';
import SelectedTextPopover from '../../components/SelectedTextPopover';
import TypeList from '../../components/TypeList';
import PlaybackRateSelector from '../../components/PlaybackRateSelector';
import VocabCounter from '../../components/VocabCounter';
import TranscriptWordWithPopover from '../../components/TranscriptWordWithPopover';
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
import {
    fetchArticleTranscription,
    renderTranscriptForReading
} from '../../services/transcriptionService';
import {generateUnsplashUserLink} from '../../components/ArticleImageSelector';
import ArticleComments from '../../components/ArticleComments';
import ArticleQuestions from '../../components/ArticleQuestions';
import {
    useLocalStorage,
    STORYBOOK_ACTIVE_KEY,
    TRANSLATIONS_TODAY_KEY,
    initialTranslationsToday
} from '../../hooks/useLocalStorage';
import StatsContext from '../../contexts/statsContext';
import ArticlesContext from '../../contexts/articlesContext';

// Every 30 seconds, we update the user's time metric in Firebase.
const TIME_METRIC_BATCH_LENGTH = 30;

function ArticlePage () {
    const router = useRouter();
    const {article, loading, error} = useGuardArticle(router.query.articleId);

    const {isAdmin, user, userProfile, userHasProPlan} = useContext(AppContext);
    const {updateWordCounts} = useContext(StatsContext);
    const [playAudio, setPlayAudio] = useState(false);
    const [readStatus, setReadStatus] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedPlayTime, setElapsedPlayTime] = useState(0);
    const [collectedVocabWords, setCollectedVocabWords] = useState({});
    const [totalPlayTime, setTotalPlaytime] = useState(null);
    const articleBodyRef = useRef();
     // We can't use a conventional React ref due to the specific API
     // of react-audio-player. Instead, we can just use state to maintain an element
     // reference. It's weird, but it works.
    const [audioPlayerRef, setAudioPlayerRef] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [activeFrame, setActiveFrame] = useState(null);
    const [frames, setFrames] = useState([]);
    const [storybookActiveKey, setStorybookActiveKey] = useLocalStorage(STORYBOOK_ACTIVE_KEY, true);
    const [translationsToday, setTranslationsToday] = useLocalStorage(TRANSLATIONS_TODAY_KEY, initialTranslationsToday());
    const [playbackRate, setPlaybackRate] = useState(null);
    const [hasMarkedAsReadOnce, setHasMarkedAsReadOnce] = useState(false);

    const articleHasStorybook = useMemo(() => !!article?.frames?.length, [article]);
    const storybookActive = useMemo(() => !!storybookActiveKey && articleHasStorybook, [storybookActiveKey, articleHasStorybook]);

    // TODO - find a better place for this.
    // We want to make sure that by the time out SelectPopover
    // needs to check for how many translations have been done for
    // the day, we have already ensured the LS item is set to the current
    // day. Otherwise there is a race condition where we don't set
    // the translation count back to 0 when it's a new day.
    useEffect(() => {
        if (translationsToday) {
            const dateMoment = moment(translationsToday.date);

            if (!dateMoment.isSame(moment(), 'day')) {
                // If there is a translation tracking key,
                // and the date is not today, then reset the key so it is for today,
                // and has no counted translations.
                setTranslationsToday(initialTranslationsToday());
            }
        }
    }, [translationsToday]);

    useEffect(() => {
        if (article?.transcriptId && userProfile) {
            fetchArticleTranscription(article.transcriptId, userProfile.levels?.spanish)
                .then(json => {
                    // If the transcript isn't ready yet, or doesn't exist,
                    // we just get a null response, but with a 2XX code (202, specifically)
                    if (json) {
                        setTranscript(json.transcript);
                    }
                })
        }

        if (article?.frames?.length) {
            // Preload all frame images and cache them so they appear instantly
            article.frames.forEach(frame => {
                const img = new Image();
                img.src = frame.image.urls.small;
            })
        }
    }, [article?.transcriptId, article?.frames, userProfile]);

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

            if (article.frames?.length) {
                setFrames(article.frames.map(frame => {
                    return {
                        ...frame,
                        end_time: frame.end_time + 1
                    }
                // We reverse the array because we want later words to be selected from the
                // .find() call, if there is any overlap between frames.
                }).reverse());
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

    const collectVocabWord = (word) => {
        const cleanedWord = word.trim().toLowerCase();

        setCollectedVocabWords(currentCollectedVocabWords => {
            const currentValue = currentCollectedVocabWords[cleanedWord];

            if (currentValue) {
                return {
                    ...currentCollectedVocabWords,
                    [cleanedWord]: currentValue + 1
                }
            } else {
                return {
                    ...currentCollectedVocabWords,
                    [cleanedWord]: 1
                }
            }
        });

        updateWordCounts({[cleanedWord]: 1});
    }

    const updateListeningMetric = (timeDelta) => {
        if (!user) {
            return;
        }

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
        try {
            if (readStatus) {
                await deleteArticleReadStatus(readStatus.id);
                setReadStatus(null);
            } else {
                const readStatusRef = await createArticleReadStatus(user.uid, article.id);
                setReadStatus(readStatusRef);

                // Make sure that we only update the user's word counts once per article session,
                // even if they repeatedly mark and unmark an article as having been read.
                if (!hasMarkedAsReadOnce) {
                    setHasMarkedAsReadOnce(true);
                    const totalWordCounts = transcript.reduce((memo, glyph) => {
                        if (glyph.text && glyph.wordMapEntry) {
                            const glyphText = glyph.text.trim().toLowerCase();
                            const previousVocabCount = memo[glyphText];

                            if (previousVocabCount) {
                                memo[glyphText] = memo[glyphText] + 1;
                            } else {
                                memo[glyphText] = 1;
                            }
                        }

                        return memo;
                    }, {});

                    const finalWordCounts = Object.keys(totalWordCounts).reduce((memo, word) => {
                        if (!collectedVocabWords[word]) {
                            memo[word] = totalWordCounts[word];
                        } else {
                            const numberOfTimeSeenWord = collectedVocabWords[word];
                            // If the user hasn't seen the word the maxiumum number of times
                            // increment the word count for this word by the difference between the two
                            if (numberOfTimeSeenWord < totalWordCounts[word]) {
                                memo[word] = totalWordCounts[word] - numberOfTimeSeenWord;
                            }
                        }

                        return memo;
                    }, {});

                    updateWordCounts(finalWordCounts);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleWordClick = (startTime) => {
        if (audioPlayerRef) {
            audioPlayerRef.currentTime = startTime;
        }
    }

    const handleListen = (e) => {
        const activeFrame = frames.find(frame => frame.start_time <= e && frame.end_time >= e);
        setActiveFrame(activeFrame);

        const updatedTranscript = transcript.reduce((memo, glyph) => {
            if (glyph.type !== 'word') {
                memo.push(glyph);
                return memo;
            }

            const wordIsActive = glyph.start_time <= e && glyph.end_time >= e;
            const wordIsVocab = !!glyph.wordMapEntry;

            if (wordIsActive) {
                memo.push({
                    ...glyph,
                    highlight: true,
                    seen: true
                });

                const isBeingSeenForTheFirstTime = !glyph.seen;
                if (wordIsVocab && isBeingSeenForTheFirstTime) {
                    collectVocabWord(glyph.text);
                }
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

    const getArticleBody = useCallback(() => {
        if (!article) return ''
        return article.body;
    }, [article]);

    const renderArticleBody = useCallback(() => {
        if (!transcript) {
            return article.body;
        }

        return renderTranscriptForReading(transcript, {
            component: TranscriptWordWithPopover,
            onClickWord: (word) => handleWordClick(word.start_time),
            getArticleBody
        });
    }, [transcript, article, userProfile, getArticleBody]);

    const handleAudioPlayerInitialization = (ref) => {
        if (!audioPlayerRef && !!ref) {
            setAudioPlayerRef(ref.audioEl.current);

            if (playbackRate) {
                ref.audioEl.current.playbackRate = playbackRate;
            }
        }
    }

    const toggleStorybook = () => {
        setStorybookActiveKey(!storybookActiveKey);
    }

    const handlePlaybackRateChange = (option) => {
        if (audioPlayerRef) {
            audioPlayerRef.playbackRate = option.value;
        }

        setPlaybackRate(option.value);
    }

    const totalVocabWords = useMemo(() => {
        if (!transcript) {
            return [];
        }

        return transcript.filter(glyph => !!glyph.wordMapEntry).map(glyph => glyph.text?.trim().toLowerCase());
    }, [transcript]);

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    if (!article) return null;

    const imageUserURL = article.image ? `${article.image.user.profile}?utm_source=leerly&utm_medium=referral` : '';

    return (
        <>
        <Container>
            {!!user && <BackLink role="link" onClick={() => router.push('/dashboard')}>← Back to dashboard</BackLink>}
            <TitleWrapper>
                <Title>{article.title ? article.title : 'Placeholder Title'}</Title>
            </TitleWrapper>

            <ArticleSubheader>
                <div>
                    <TypeList types={article.types} />

                    <ArticleData>
                        <a href={article.url} target='_blank'>Read original article ⟶</a>
                    </ArticleData>
                </div>

                <StorybookToggleMobile>
                    Storybook is not <br></br> available on mobile (yet)
                </StorybookToggleMobile>

                <StorybookToggleDesktop>
                    <div>{storybookActive ? 'Storybook is active' : 'Storybook is inactive'}</div>
                    {articleHasStorybook ? (
                        <Button onClick={toggleStorybook}>{storybookActive ? 'Disable' : 'Enable'} Storybook</Button>
                    ) : (
                        <span>This article does not have Storybook</span>
                    )}
                </StorybookToggleDesktop>
            </ArticleSubheader>

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
        </Container>

        <WideContainer>

            {!!audioURL && (
                <PlaybackRateRow>
                    <PlaybackRateSelectorWrapper>
                        <HelpText>Speed</HelpText>
                        <PlaybackRateSelector disabled={!userHasProPlan} onChange={handlePlaybackRateChange} />
                    </PlaybackRateSelectorWrapper>
                </PlaybackRateRow>
            )}

            <AudioOffsetWrapper>
                {userProfile?.levels?.spanish && totalVocabWords.length && (
                    <div style={{position: 'relative'}}>
                        <WordCounterContainer>
                            <WordCounterNumber>
                                <VocabCounter count={Object.keys(collectedVocabWords).length} /> / {totalVocabWords.length}
                            </WordCounterNumber>
                            <br />
                            words
                        </WordCounterContainer>
                    </div>
                )}

                {!!audioURL && !playAudio && (
                    <CustomAudioWrapper>
                        <FakeAudioWidget onClick={() => setPlayAudio(true)}>
                            <span>Play audio</span> &#9658;
                        </FakeAudioWidget>
                    </CustomAudioWrapper>
                )}

                {!!audioURL && playAudio && (
                    <CustomAudioWrapper>
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
                    </CustomAudioWrapper>
                )}
            </AudioOffsetWrapper>

            <Psst><i>Pssst.</i> You can hover over or highlight text to automatically translate it to English.</Psst>

            <SelectedTextPopover isDemo={article.demo} elementRef={articleBodyRef} articleBody={article.body} />

            <ArticleWrapper>
                <ArticleBody ref={articleBodyRef}>
                    {renderArticleBody()}
                </ArticleBody>

                {storybookActive && (
                    <FrameContainer>
                        {activeFrame && (
                            <>
                                <FrameText>{activeFrame.text}</FrameText>
                                <img src={activeFrame.image.urls.small}></img>
                                {generateUnsplashUserLink(activeFrame.image)}
                            </>
                        )}

                        {!activeFrame && !isPlaying && (
                            <FrameFiller>
                                The Storybook pictures will display here.
                                <span>You can disable them above.</span>
                            </FrameFiller>
                        )}
                    </FrameContainer>
                )}
            </ArticleWrapper>

            {(!article.free || user) && (
                <ButtonRow>
                    <MarkAsReadButton read={!!readStatus} onClick={handleMarkAsRead}>
                        {!!readStatus ? 'Article read ✓' : 'Mark as read'}
                    </MarkAsReadButton>
                </ButtonRow>
            )}

            <QuestionsCounter>
                Article Questions: { article.questions ? article.questions.length : 0 }
            </QuestionsCounter>
     
            { readStatus && article.questions && (
                <ArticleQuestions 
                    articleId={article.id} 
                    questions={ article.questions }
                />
            )}

            {article.free && !user && (
                <UpgradeWrapper>
                    <p>Enjoyed reading this? Want to improve your Spanish?</p>
                    <Button onClick={() => router.push('/register')}>Join now with a free month</Button>
                </UpgradeWrapper>
            )}

            {renderAdminUI()}

            {/* <NarrowContainer>
                <div style={{marginTop: '90px'}}>
                    <ArticleComments article={article}/>
                </div>
            </NarrowContainer> */}
        </WideContainer>
        </>
    );
}

export default ArticlePage;

const CustomAudioWrapper = styled(AudioWrapper)`
    @media ${devices.tablet} {
        margin-left: -100px;
    }
`;
const PlaybackRateRow = styled.div`
    display: flex;
    justify-content: center;
`;
const PlaybackRateSelectorWrapper = styled.div`
    width: 90px;
    z-index: 9;

    ${HelpText} {
        margin: 0;
        text-align: center;
    }

    @media ${devices.tablet} {
        position: absolute;
        margin-right: -320px;
        margin-top: 17px;
    }
`;
const ArticleSubheader = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const StorybookToggleDesktop = styled.div`
    flex-direction: column;
    display: none;
    text-align: right;

    div {
        margin-bottom: 5px;
    }

    @media ${devices.tablet} {
        display: flex;
    }
`;

const StorybookToggleMobile = styled.div`
    text-align: center;

    @media ${devices.tablet} {
        display: none;
    }
`;

const WideContainer = styled(Container)`
    max-width: 1200px;
    padding-top: 0px;

    @media ${devices.laptop} {
        padding-top: 30px;
    }
`;
const ArticleWrapper = styled.div`
    display: flex;
    margin-top: 30px;

    @media ${devices.mobileL} {
        margin-top: 60px;
    }
`;
const FrameContainer = styled.div`
    width: 300px;
    height: 300px;
    position: sticky;
    top: 90px;
    display: none;

    img {
        width: 100%;
    }

    @media ${devices.tablet} {
        display: initial;
    }
`;
const FrameFiller = styled.div`
    display: flex;
    padding: 30px;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #eee;

    span {
        margin-top: 5px;
    }
`;
const FrameText = styled.span`
    font-size: 20px;
    text-align: center;
    width: 100%;
`;
const BackLink = styled.span`
    color: ${Colors.Primary};
    cursor: pointer;
`;
const AudioOffsetWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: sticky;
    top: 0px;
    z-index: 99;
    margin-left: 60px;

    @media ${devices.tablet} {
        flex-direction: row;
        margin-left: 0px;
        top: 30px;

        ${PlaybackRateSelectorWrapper} {
            margin-top: 30px;
            margin-left: 20px;
        }
    }

`;
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

const QuestionsCounter = styled.p`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    transform: scale(0.75);
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
    flex: 1;
    padding: 0 10px;
    font-size: 18px;
    line-height: 30px;
    white-space: pre-wrap;
    font-family: 'Source Sans Pro', sans-serif;

    @media ${devices.laptop} {
        padding: 0 30px;
    }
`;

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;

const WordCounterContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0px 2px 3px 2px rgb(0 0 0 / 10%);
    font-size: 8px;
    color: ${Colors.MediumGrey};
    top: 30px;
    left: -210px;

    @media ${devices.tablet} {
        top: -12px;
        left: -170px;
    }
`;

const WordCounterNumber = styled.span`
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: -10px;
`;
