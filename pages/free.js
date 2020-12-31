import React from 'react';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGetArticles from '../hooks/useGetArticles';

function ArticlePage () {
    const {articles, loading, error} = useGetArticles({free: true});

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>free articles</Title>
                <Subtitle>We release a free article every week. You can find all of them here.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <ArticlesList>
            {articles.map(article => (
                <ArticlePreview key={article.id} article={article} read={false}/>
            ))}
        </ArticlesList>

        </Container>
        </>
    );
}

export default ArticlePage;
