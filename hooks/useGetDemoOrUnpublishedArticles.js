import {useState, useEffect} from 'react';
import {getDemoArticles, getUnpublishedArticles} from '../services/articleService';

const useGetDemoOrUnpublishedArticles = ({demo, unpublished} = {demo: false, unpublished: false}) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const articlesPromise = demo ?
            getDemoArticles() :
            getUnpublishedArticles();

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

export default useGetDemoOrUnpublishedArticles;
