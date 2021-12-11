import {useContext, useState} from 'react';
import appContext from '../contexts/appContext';
import {getArticles} from '../services/articleService';
import { getArticleAnswersWithIdToken, createNewAnswersWithIdToken } from '../services/answersService';

const useArticlesContext = () => {
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [articlesError, setArticlesError] = useState();
    const {idToken} = useContext(appContext);

    const loadArticles = async (filters) => {
        setLoadingArticles(true);

        try {
            if (!idToken) return;

            const incomingArticles = await getArticles(idToken, filters);
            setArticles(incomingArticles);
        } catch (e) {
            console.error(e);
            setArticlesError(e.message);
        }

        setLoadingArticles(false);
    }

    const getArticleAnswers = async (answers) => {
        if (!idToken) return;

        return getArticleAnswersWithIdToken(idToken, answers);
    }

    const createNewAnswers = async (answers) => {
        return createNewAnswersWithIdToken(idToken, answers);
    }

    return {
        articles,
        loadingArticles,
        articlesError,
        loadArticles,
        getArticleAnswers,
        createNewAnswers
    }
}

export default useArticlesContext;