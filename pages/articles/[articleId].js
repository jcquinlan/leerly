import React, {useState, useMemo, useEffect} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
} from '../../components/styled';
import LoadingPage from '../../components/LoadingPage';
import TypeList from '../../components/TypeList';
import useGetArticle from '../../hooks/useGetArticle';
import useGuardRoute from '../../hooks/useGuardRoute';

function ArticlePage () {
    useGuardRoute();

    const router = useRouter();
    const {article, loading, error} = useGetArticle(router.query.articleId);

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>{loading ? 'Loading...' : article.title ? article.title : 'Placeholder Title'}</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <TypeList types={article.types} />

        <ArticleData>
            <span>Original article: </span>
            <a href={article.url} target='_blank'>{article.url}</a>
        </ArticleData>

        <ArticleBody>
            {article.body}
        </ArticleBody>

        </Container>
        </>
    );
}

export default ArticlePage;

const ArticleBody = styled.div`
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 30px;
    margin-top: 30px;
    line-height: 30px;
`;

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;
