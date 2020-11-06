import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import TypeList from './TypeList';

const ArticlePreview = ({article}) => {
    console.log(article);
    return (
        <ArticlePreviewWrapper>
            <Header>
                <span>{article.title || 'Placeholder Title'}</span>
                <ArticleTimestamp>{moment(article.added_at.seconds * 1000).format('MM/DD/YYYY')}</ArticleTimestamp>
            </Header>

            <TypeList types={article.types} />
            <BodyPreview>
                <BodyPreviewMask></BodyPreviewMask>
                <p>{article.body}</p>
            </BodyPreview>
        </ArticlePreviewWrapper>
    )
};

export default ArticlePreview;

const Header = styled.div`
    display: flex;
    justify-content: space-between;

    span {
        font-size: 24px;
        font-weight: bold;
    } 
`;

const ArticleTimestamp = styled.div`
    color: #aaa;
    font-size: 14px;
`;

const ArticlePreviewWrapper = styled.div`
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 30px;
    cursor: pointer;
    box-shadow: 0px 10px 30px -30px rgba(0,0,0,0.3);
`;

const BodyPreview = styled.div`
    position: relative;
    max-height: 100px;
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