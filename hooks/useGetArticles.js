import {useState, useEffect} from 'react';
import {getArticles} from '../services/articleService';

const useGetArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getArticles()
            .then(articlesRef => {
                const articleData = articlesRef.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setArticles(articleData);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {
        articles,
        loading,
        error
    }
}

export default useGetArticles;
