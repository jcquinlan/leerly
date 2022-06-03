import { useState, useEffect, useContext } from 'react'
import articlesContext from '../contexts/articlesContext'

const useGetArticle = (articleId) => {
  const { articles, loadArticle } = useContext(articlesContext)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (articleId) {
      const articleInMemory = articles.find(currentArticle => currentArticle.id === articleId)

      if (articleInMemory) {
        setArticle(articleInMemory)
        setLoading(false)
      } else {
        loadArticle(articleId)
          .then(article => {
            setArticle(article)
          })
          .catch(err => {
            setError(err)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [articleId])

  return {
    article,
    loading,
    error
  }
}

export default useGetArticle
