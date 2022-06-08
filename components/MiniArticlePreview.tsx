import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { Article } from 'types';
import DifficultyBadge from './DifficultyBadge';
import { Card, Margin, devices, Icon, Colors, Flex } from './styled';
import TypeList from './TypeList';

interface MiniArticlePreviewProps {
  article: Article;
  direction?: string;
}
const MiniArticlePreview = ({ article, direction = 'left' }: MiniArticlePreviewProps) => {
  const router = useRouter();

  const navigateToArticle = () => {
    router.push(`/articles/${article.id}`);
  };

  return (
    <MiniArticlePreviewWrapper onClick={navigateToArticle} role="button">
      <Flex>
      <ThumbnailWrapper backgroundImage={article.image.urls.small}></ThumbnailWrapper>

        <div>
          <Title>{article.title}</Title>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Margin marginRight='5px'>
                  <DifficultyBadge difficulty={article.level} />
              </Margin>
              <TypeList types={article.types} />
          </div>
          <LinkWrapper direction={direction} >
            <ArticleLink role="link">
              {direction === 'left' && <Icon style={{ fontSize: '12px', marginRight: '5px' }} icon="arrow_back" />}
              <span>Read article</span>
              {direction === 'right' && <Icon style={{ fontSize: '12px', marginLeft: '5px' }} icon="arrow_forward" />}
            </ArticleLink>
          </LinkWrapper>
        </div>
      </Flex>
    </MiniArticlePreviewWrapper>
  );
};

export const MiniArticlePreviewWrapper = styled(Card)`
  cursor: pointer;
  transition: 0.3s;
  width: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 20px 30px -30px rgba(0,0,0,0.4);
  }

  @media ${devices.tablet} {
    max-width: 500px;
  }
`;

const Title = styled.h5`
  font-size: 16px;
  margin: 0 0 10px 0;
`;

const ArticleLink = styled.div`
  display: flex;
  align-items: center;
  color: ${Colors.Primary};
`;

interface LinkWrapperProps {
  direction?: string;
}
const LinkWrapper = styled.div<LinkWrapperProps>`
  display: flex;
  justify-content: ${props => props.direction === 'right' ? 'end' : 'start'};
`;

interface ThumbnailWrapperProps {
  backgroundImage: string;
}
const ThumbnailWrapper = styled.div<ThumbnailWrapperProps>`
  width: 150px;
  margin-right: 15px;
  margin-left: -15px;
  margin-top: -15px;
  margin-bottom: -16px;

  ${props => props.backgroundImage
    ? `
        background-image: url(${props.backgroundImage}); 
        background-repeat: no-repeat;
        background-size: cover;
    `
: ''}

@media ${devices.laptop} {
  margin-left: -30px;
  margin-top: -30px;
  margin-bottom: -31px;
}
      
`;

export default MiniArticlePreview;
