import {useContext, useState} from 'react';
import appContext from '../contexts/appContext';
import {getArticles, getArticle, patchArticle} from '../services/articleService';

const useArticlesContext = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [articlesError, setArticlesError] = useState();
    const {idToken} = useContext(appContext);

    const loadArticles = async (filters) => {
        setLoading(true);

        try {
            if (!idToken) return;

            const incomingArticles = await getArticles(idToken, filters);
            setArticles(incomingArticles);
        } catch (e) {
            console.error(e);
            setArticlesError(e.message);
        } finally {
            setLoading(false);
        }
    }

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

    }

    const updateArticle = async (articleId, content) => {
        try {
            if (!idToken) return;

            return await patchArticle(idToken, articleId, content);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    return {
        articles,
        loading,
        articlesError,
        loadArticles,
        loadArticle,
        updateArticle
    }
}

export default useArticlesContext;