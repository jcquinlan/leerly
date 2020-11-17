import React from 'react';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import TypeList from './TypeList';

const ArticlePreview = ({article}) => {
    const router = useRouter();

    const goToArticle = () => {
        router.push(`/articles/${article.id}`);
    };

    return (
        <ArticlePreviewWrapper onClick={goToArticle}>
            <Header>
                <span>{article.title || 'Placeholder Title'}</span>
                <ArticleTimestamp>{moment(article.added_at.seconds * 1000).format('MM/DD/YYYY')}</ArticleTimestamp>
            </Header>

            <TypeList types={article.types} />
            <MaskedText>{article.body}</MaskedText>
        </ArticlePreviewWrapper>
    )
};

export const MaskedText = ({children, maxHeight}) => {
    return (
        <BodyPreview maxHeight={maxHeight}>
            <BodyPreviewMask></BodyPreviewMask>
            <p>{children}</p>
        </BodyPreview>
    )
}

export default ArticlePreview;

export const ArticlesList = styled.div`
    padding: 30px;
    margin-top: 30px;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;

    span {
        font-size: 24px;
        font-weight: bold;
    } 
`;

export const ArticleTimestamp = styled.div`
    color: #aaa;
    font-size: 14px;
`;

export const ArticlePreviewWrapper = styled.div`
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 30px;
    cursor: pointer;
    box-shadow: 0px 10px 30px -30px rgba(0,0,0,0.3);
    ${props => props.selected ? 'border-color: blue;' : ''}
`;

const BodyPreview = styled.div`
    position: relative;
    max-height: ${props => props.maxHeight || '100px'};
    overflow: hidden;

    p {
        margin: 0;
    }
`;

const BodyPreviewMask = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.5) 20%, rgba(255,255,255,1));
`;