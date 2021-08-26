import {useContext, useState} from 'react';
import appContext from '../contexts/appContext';
import {getArticles} from '../services/articleService';
import {updateWordCounts} from '../services/userService';

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

    const updateWordCountsWithIdToken = (wordCounts) => {
        return updateWordCounts(idToken, wordCounts);
    }

    return {
        articles,
        loadingArticles,
        articlesError,
        loadArticles,
        updateWordCounts: updateWordCountsWithIdToken
    }
}

export default useArticlesContext;