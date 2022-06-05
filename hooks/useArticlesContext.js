import { useContext, useState } from 'react';
import appContext from '../contexts/appContext';
import { getArticles, getArticle, patchArticle, saveArticle, getRecommendedArticles } from '../services/articleService';

const useArticlesContext = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articlesError, setArticlesError] = useState();
  const { idToken } = useContext(appContext);

  const loadArticles = async (filters, queryString) => {
    setLoading(true);

    try {
      if (!idToken) return;

      const incomingArticles = await getArticles(idToken, filters, queryString);
      setArticles(incomingArticles);
    } catch (e) {
      console.error(e);
      setArticlesError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const searchArticlesWithToken = async (filters, query) => {
    try {
      if (!idToken) return;

      return await getArticles(idToken, filters, query);
    } catch (e) {
      console.error(e);
    }
  };

  const loadArticle = async (articleId) => {
    setLoading(true);

    try {
      if (!idToken) return;

      return await getArticle(idToken, articleId);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedArticlesWithToken = async (articleId) => {
    setLoading(true);

    try {
      if (!idToken) return;

      return await getRecommendedArticles(idToken, articleId);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateArticleWithToken = async (articleId, content) => {
    try {
      if (!idToken) return;

      return await patchArticle(idToken, articleId, content);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const saveArticleWithToken = async (content) => {
    try {
      if (!idToken) return;

      return await saveArticle(idToken, content);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return {
    articles,
    loading,
    articlesError,
    loadArticles,
    loadArticle,
    updateArticle: updateArticleWithToken,
    saveArticle: saveArticleWithToken,
    searchArticles: searchArticlesWithToken,
    getRecommendedArticles: getRecommendedArticlesWithToken
  };
};

export default useArticlesContext;
