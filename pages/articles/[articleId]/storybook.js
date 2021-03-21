import React, {useState, useMemo, useEffect} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button,
    Subtitle,
    TranscriptWord,
    Card
} from '../../../components/styled';
import useGuardAdminRoute from '../../../hooks/useGuardAdminRoute';
import LoadingPage from '../../../components/LoadingPage';
import {StorybookImageSelector} from '../../../components/ArticleImageSelector';
import useGetArticle from '../../../hooks/useGetArticle';
import {
    fetchArticleTranscription,
    prepareTranscript,
    renderTranscriptForStorybook,
} from '../../../services/transcriptionService';
import {updateArticle} from '../../../services/articleService';
import {unsplashImageToSimplifiedImage, triggerUnsplashDownload} from '../../../services/unsplashService';

function ArticlePage () {
    useGuardAdminRoute();

    const router = useRouter();
    const {article, loading, error} = useGetArticle(router.query.articleId);
    const [transcript, setTranscript] = useState(null);
    const [activeSlot, setActiveSlot] = useState(null);
    const [frames, setFrames] = useState([]);

    const activeGlyphs = useMemo(() => {
        if (!transcript || !activeSlot) return [];

        return transcript.filter(glyph => {
            return (glyph.start_time <= activeSlot.start_time && glyph.end_time > activeSlot.start_time) ||
                   (glyph.start_time <= activeSlot.start_time && glyph.end_time >= activeSlot.end_time) ||
                   (glyph.start_time >= activeSlot.start_time && glyph.end_time <= activeSlot.end_time)
        });
    }, [transcript, activeSlot]);

    useEffect(() => {
        if (article?.transcriptId) {
            fetchArticleTranscription(article.transcriptId)
                .then(json => {
                    if (json) {
                        const preparedTranscript = prepareTranscript(json.transcript);
                        setTranscript(preparedTranscript);
                    }
                })
        }

        if (article?.frames) {
            setFrames(article.frames);
        }
    }, [article]);

    const activateGlyph = (glyph) => {
        setActiveSlot({
            start_time: glyph.start_time,
            end_time: glyph.end_time
        });
    };

    const createFrame = (image) => {
        const glyphText = activeGlyphs.map(glyph => glyph.text).join();
        const newFrame = {
            image,
            text: glyphText,
            start_time: activeSlot.start_time,
            end_time: activeSlot.end_time
        }

        setFrames(frames => {
            return [
                ...frames,
                newFrame
            ]
        });
        setActiveSlot(null);
    }

    if (loading) {
      return <LoadingPage></LoadingPage>;
    }

    const renderArticleBody = () => {
        if (!transcript) {
            return null;
        }

        return renderTranscriptForStorybook(transcript, (glyph) => {
            const glyphIsInActiveSelection = activeGlyphs.some(activeGlyph => activeGlyph.id === glyph.id);

            return (
                <TranscriptWord
                    key={glyph.start_time}
                    highlight={glyphIsInActiveSelection}
                    onClick={() => activateGlyph(glyph)}
                >
                    {glyph.text}
                </TranscriptWord>
            )
        });
    }

    const saveArticle = async () => {
        await updateArticle(article.id, {
            frames
        });

        console.log('DONE');
    }

    return (
        <>
        <Container>
            <HeroWrapper>
                <HeroContent>
                    <Title>storybook</Title>
                    <Subtitle>Convert this article into a storybook</Subtitle>
                </HeroContent>
            </HeroWrapper>

            <Divider />
        </Container>


        <DesktopContainer>
            <div>
                {!!frames.length && (
                    <FrameList>
                        {frames.map(frame => (
                            <FramePreview>
                                {frame.start_time} to {frame.end_time}
                                <br></br>
                                {frame.text}
                            </FramePreview>
                        ))}
                    </FrameList>
                )}

                <AddImageCard>
                    {activeSlot && (
                        <>
                            <div>
                                {activeGlyphs.map(glyph => glyph.text).join()}
                                <br></br>
                                From {activeSlot.start_time} to {activeSlot.end_time}
                            </div>

                            <StorybookImageSelector onConfirmImage={(image) => createFrame(image)} />
                        </>
                    )}

                    {!activeSlot && (
                        <div>
                            To add a frame, select a word
                        </div>
                    )}
                </AddImageCard>
            </div>

            <div>
                {renderArticleBody()}
                <Button onClick={saveArticle}>Save article</Button>
            </div>
        </DesktopContainer>
        </>
    );
}

export default ArticlePage;

const AddImageCard = styled(Card)`
    margin-bottom: 60px;
`;

const FrameList = styled.div`
    margin-bottom: 30px;
`;

const FramePreview = styled.div`
    display: inline-block;
    max-width: 200px;
    border: 1px solid grey;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
`;

const DesktopContainer = styled(Container)`
    max-width: 1200px;
    display: flex;

    div {
        flex: 1;
        margin-right: 30px;

        &:last-child {
            margin-right: 0;
        }
    }
`
