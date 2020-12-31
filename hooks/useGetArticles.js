import {useState, useEffect} from 'react';
import {getArticles, getFreeArticles} from '../services/articleService';

const useGetArticles = ({free} = {free: false}) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const articlesPromise = free ? getFreeArticles() : getArticles();

        articlesPromise
            .then(articlesRef => {
                const articleData = articlesRef.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setArticles(articleData);
            })
            .catch(err => {
                console.log(err)
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
