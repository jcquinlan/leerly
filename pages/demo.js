import React from 'react'
import {
  Container,
  HeroWrapper,
  HeroContent,
  Title,
  Subtitle
} from '../components/styled'
import LoadingPage from '../components/LoadingPage'
import ArticlePreview, { ArticlesList } from '../components/ArticlePreview'
import useGetDemoOrUnpublishedArticles from '../hooks/useGetDemoOrUnpublishedArticles'

function DemoPage () {
  const { articles, loading, error } = useGetDemoOrUnpublishedArticles({ demo: true })

  if (loading) {
    return <LoadingPage></LoadingPage>
  }

  return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>demo articles</Title>
                <Subtitle>Try out comprehensible input, with slow audio and instant translation</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <ArticlesList>
            {articles.map(article => (
                <ArticlePreview key={article.id} article={article} read={false}/>
            ))}
        </ArticlesList>

        </Container>
        </>
  )
}

export default DemoPage
