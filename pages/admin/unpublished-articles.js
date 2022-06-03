import React from 'react'
import styled from 'styled-components'
import {
  Container,
  HeroWrapper,
  HeroContent,
  Divider,
  Title,
  Subtitle
} from '../../components/styled'
import useGuardAdminRoute from '../../hooks/useGuardAdminRoute'
import useGetDemoOrUnpublishedArticles from '../../hooks/useGetDemoOrUnpublishedArticles'
import ArticlePreview from '../../components/ArticlePreview'

function UnpublishedArticlesPage () {
  useGuardAdminRoute()
  const { articles } = useGetDemoOrUnpublishedArticles({ unpublished: true })

  return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>unpublished articles</Title>
                <Subtitle>These articles need to be published still, but only after editing their transcripts in Sonix</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <ListWrapper>
            {articles.map(article => (
               <ArticlePreview key={article.id} article={article} />
            ))}
        </ListWrapper>

        </Container>
        </>
  )
}

export default UnpublishedArticlesPage

const ListWrapper = styled.div``
