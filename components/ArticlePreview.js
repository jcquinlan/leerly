import React from 'react';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import TypeList from './TypeList';
import {ReadCheck, devices} from './styled';

const ArticlePreview = ({article, read}) => {
    const router = useRouter();

    const goToArticle = () => {
        router.push(`/articles/${article.id}`);
    };

    return (
        <ArticlePreviewWrapper onClick={goToArticle}>
            <Header>
                <div>
                    <ReadCheck checked={read}/>
                    <span>{article.title || 'Placeholder Title'}</span>
                </div>
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
    padding: 15px;

    @media ${devices.laptop} {
        padding: 30px;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    span {
        font-size: 18px;
        font-weight: bold;

        @media ${devices.laptop} {
            font-size: 24px;
        }
    } 
`;

export const ArticleTimestamp = styled.div`
    display: none;
    color: #aaa;
    font-size: 14px;

    @media ${devices.laptop} {
        display: initial;
    }
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