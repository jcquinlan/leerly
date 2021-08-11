import {useState, useEffect} from 'react';
import {getArticles} from '../services/articleService';

const useGetArticles = (idToken, filters) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (idToken) {
            getArticles(idToken, filters)
                .then(articles => {
                    setArticles(articles);
                })
                .catch(error => {
                    console.log(error);
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [filters, idToken]);

    return {
        articles,
        loading,
        error
    }
}

export default useGetArticles;
