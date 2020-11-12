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
    Input,
    Card,
    HelpText,
    Subtitle
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
            {articles.map(article => (
                <ArticlePreview key={article.id} article={article}/>
            ))}
        </ArticlesList>

        </Container>
        </>
    );
}

export default ArticlePage;
