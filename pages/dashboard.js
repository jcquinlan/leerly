import React, {useState, useMemo, useEffect} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    Card
} from '../components/styled';
import LoadingPage from '../components/LoadingPage';
import ArticlePreview, {ArticlesList} from '../components/ArticlePreview';
import useGetArticles from '../hooks/useGetArticles';
import useGuardRoute from '../hooks/useGuardRoute';

function ArticlePage () {
    useGuardRoute();

    const {articles, loading, error} = useGetArticles();

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
                <FeedbackCard>
                    <span>How did you hear about leerly?</span> <br />
                    <LetUsKnow>Let us know ⟶</LetUsKnow>
                </FeedbackCard>
            </a>

            {articles.map(article => (
                <ArticlePreview key={article.id} article={article}/>
            ))}
        </ArticlesList>

        </Container>
        </>
    );
}

export default ArticlePage;

const FeedbackCard = styled(Card)`
    background-color: #1f4ab8;
    color: #fff;
    margin-bottom: 30px;
    border: none;
`;

const LetUsKnow = styled.span`
    color: #fff;
    margin-top: 15px;
    font-size: 24px;
`;
