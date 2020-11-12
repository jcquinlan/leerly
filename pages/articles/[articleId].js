import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button
} from '../../components/styled';
import LoadingPage from '../../components/LoadingPage';
import TypeList from '../../components/TypeList';
import useGetArticle from '../../hooks/useGetArticle';
import useGuardRoute from '../../hooks/useGuardRoute';
import AppContext from '../../contexts/appContext';

function ArticlePage () {
    useGuardRoute();

    const router = useRouter();
    const {isAdmin} = useContext(AppContext);
    const {article, loading, error} = useGetArticle(router.query.articleId);

    const renderAdminUI = () => {
        if (isAdmin) {
            return (
                <AdminButtons>
                    <Button onClick={() => router.push(`/articles/${router.query.articleId}/edit`)}>Edit Article</Button>
                </AdminButtons>
            )
        }
    }

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

        {renderAdminUI()}

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

const AdminButtons = styled.div`
    margin-bottom: 30px;
`;

const ArticleBody = styled.div`
    padding: 30px;
    margin-top: 30px;
    line-height: 30px;
    white-space: pre-wrap;
`;

const ArticleData = styled.div`
    margin-bottom: 15px;

    span {
        font-size: 16px;
        font-weight: bold;
    }
`;
