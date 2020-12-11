import React, {useContext, useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    Divider,
    Title,
    Button,
    Colors,
    devices,
    ImageAttribution,
    ImageWrapper
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
    getArticleAudioURL
} from '../../services/articleService';

function ArticlePage () {
    const router = useRouter();
    const {article, loading, error} = useGuardArticle(router.query.articleId);

    const {isAdmin, user} = useContext(AppContext);
    const [playAudio, setPlayAudio] = useState(false);
    const [readStatus, setReadStatus] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const articleBodyRef = useRef();

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

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    if (!article) return null;

    const imageUserURL = article.image ? `${article.image.user.profile}?utm_source=leerly&utm_medium=referral` : '';

    return (
        <>
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
            <AudioWrapper>
                <FakeAudioWidget onClick={() => setPlayAudio(true)}>
                    <span>Play audio</span> &#9658;
                </FakeAudioWidget>
            </AudioWrapper>
        )}

        {!!audioURL && playAudio && (
            <AudioWrapper>
                <div>
                    <ReactAudioPlayer
                        src={audioURL}
                        controls
                    />
                </div>
            </AudioWrapper>
        )}


        <SelectedTextPopover elementRef={articleBodyRef} articleBody={article.body} />
        <ArticleBody ref={articleBodyRef}>
            {article.body}
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
        </>
    );
}

export default ArticlePage;

const TitleWrapper = styled(HeroWrapper)``;

const AudioWrapper = styled.div`
    margin: 60px 0;
    display: flex;
    justify-content: center;
`;

const FakeAudioWidget = styled.div`
    width: 300px;
    border-radius: 50px;
    padding: 14px;
    background: #F1F3F4;
    text-align: center;
    color: #444;
    cursor: pointer;
    box-shadow: 0px 4px 5px 0px #e0e0e0;

    span {
        margin-right: 10px;
        font-size: 18px;
    }
`;

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

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;
