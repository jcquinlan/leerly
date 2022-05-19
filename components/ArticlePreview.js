import React, { useContext } from 'react';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import TypeList from './TypeList';
import {ReadCheck, devices} from './styled';
import colors from './styled/colors';
import appContext from '../contexts/appContext';
import {Margin} from './styled';
import DifficultyBadge from './DifficultyBadge';

const ArticlePreview = ({article, read}) => {
    const {userHasProPlan} = useContext(appContext);
    const router = useRouter();

    const goToArticle = () => {
        if (!article.free && !userHasProPlan) {
            return;
        }

        router.push(`/articles/${article.id}`);
    };

    const imageUserURL = article?.image ? `${article.image.user.profile}?utm_source=leerly&utm_medium=referral` : '';

    return (
        <ArticlePreviewWrapper clickable={article.free || userHasProPlan} onClick={goToArticle}>
            <ArticleInfo>
                <Header>
                    <div>
                        <ReadCheck checked={read}/>
                        <span>{article.title || 'Placeholder Title'}</span>
                    </div>
                </Header>

                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    <Margin marginRight='5px'>
                        <DifficultyBadge difficulty={article.level} />
                    </Margin>

                    <TypeList types={article.types} />
                </div>

                {!!article?.image && (
                    <ImageAttribution>
                        Image from Unsplash, credit to <a href={imageUserURL} target='_blank'>{article.image.user.name}</a>
                    </ImageAttribution>
                )}
                <MaskedText>{article.body}</MaskedText>
            </ArticleInfo>

            <MetaInfo>
                <ArticleTimestamp>{moment(article.added_at.seconds * 1000).format('MM/DD/YYYY')}</ArticleTimestamp>
                {!!article.image && (
                    <ImageBox backgroundImage={article.image.urls.small}></ImageBox>
                )}
            </MetaInfo>
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
    color: #aaa;
    font-size: 14px;
    text-align: right;
    margin-bottom: 5px;
`;

export const ArticlePreviewWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 30px;
    box-shadow: 0px 10px 30px -30px rgba(0,0,0,0.3);
    ${props => props.selected ? 'border-color: blue;' : ''}
    ${props => props.clickable ? `cursor: pointer` : ``};
    ${props => !props.clickable ? `opacity: 0.3` : ``};
`;

const ImageAttribution = styled.div`
    margin: 0;
    margin-bottom: 10px;
    color: ${colors.DarkGrey};
    font-weight: 100;
    font-family: 'Source Sans Pro', sans-serif;
    display: none;

    @media ${devices.tablet} {
        display: block;
    }
`;
const ImageBox = styled.div`
    width: 100px;
    height: 100px;
    background-color: blue;
    ${props => props.backgroundImage ? `
        background-image: url(${props.backgroundImage}); 
        background-repeat: no-repeat;
        background-size: cover;
    `: ``}
`;

const ArticleInfo = styled.div`
    width: 100%;

    @media ${devices.tablet} {
        margin-right: 30px;
    }
`;
const MetaInfo = styled.div`
    width: 100%;
    max-width: 100px;
    display: none;

    @media ${devices.tablet} {
        display: initial;
    }
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

const CommentCountWrapper = styled.span`
    font-size: 12px;
`;