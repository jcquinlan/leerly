import React, {useContext, useState, useEffect} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    Divider,
    Title,
    Button,
    Colors,
    NoticeCard,
    NoticeCardMain
} from '../../components/styled';
import LoadingPage from '../../components/LoadingPage';
import TypeList from '../../components/TypeList';
import useGuardArticle from '../../hooks/useGuardArticle';
import AppContext from '../../contexts/appContext';
import { createArticleReadStatus, getArticleReadStatus, deleteArticleReadStatus } from '../../services/articleService';

function ArticlePage () {
    const router = useRouter();
    const {article, loading, error} = useGuardArticle(router.query.articleId);

    const {isAdmin, user} = useContext(AppContext);
    const [readStatus, setReadStatus] = useState(null);

    useEffect(() => {
        if (article && (!article.free || user)) {
            getArticleReadStatus(user.uid, article.id)
                .then(readStatusRef => {
                    if (readStatusRef.docs.length > 0) {
                        setReadStatus(readStatusRef.docs[0]);
                    }
                });
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

    return (
        <>
        <Container>
        <HeroWrapper>
            <Title>{loading ? 'Loading...' : article.title ? article.title : 'Placeholder Title'}</Title>
        </HeroWrapper>

        <Divider />

        {renderAdminUI()}

        <TypeList types={article.types} />

        <ArticleData>
            <span>Original article: </span>
            <a href={article.url} target='_blank'>{article.url}</a>
        </ArticleData>

        <ArticleBody>
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
    padding: 30px;
    margin-top: 30px;
    font-size: 18px;
    line-height: 30px;
    white-space: pre-wrap;
    font-family: 'Source Sans Pro', sans-serif;
`;

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;
