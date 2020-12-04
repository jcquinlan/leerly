import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    NoticeCard,
    NoticeCardMain
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGetArticles from '../hooks/useGetArticles';
import useGuardRoute from '../hooks/useGuardRoute';
import { getArticleReadStatuses } from '../services/articleService';
import AppContext from '../contexts/appContext';

function ArticlePage () {
    useGuardRoute();

    const {user} = useContext(AppContext);
    const {articles, loading, error} = useGetArticles();
    const [readStatuses, setReadStatuses] = useState({});

    useEffect(() => {
        if (articles.length) {
            getArticleReadStatuses(user.uid)
                .then(readStatusesRef => {
                    const readStatusesById = readStatusesRef.docs.reduce((memo, current) => {
                        const data = current.data();
                        memo[data.articleId] = current;
                        return memo;
                    }, {});
                    setReadStatuses(readStatusesById);
                })
        }
    }, [articles]);

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>dashboard</Title>
                <Subtitle>See all the recent articles, or search through the archives of older material.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <ArticlesList>
            <a href="https://forms.gle/Je6gXA1tLGT1bxRh6" target="_blank">
                <NoticeCard>
                    <span>How did you hear about leerly?</span> <br />
                    <NoticeCardMain>Let us know ⟶</NoticeCardMain>
                </NoticeCard>
            </a>

            {articles.map(article => (
                <ArticlePreview key={article.id} article={article} read={readStatuses[article.id]}/>
            ))}
        </ArticlesList>

        </Container>
        </>
    );
}

export default ArticlePage;

