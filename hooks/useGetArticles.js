import {useState, useEffect} from 'react';
import {getArticles, getDemoArticles, getUnpublishedArticles} from '../services/articleService';

const useGetArticles = ({demo, unpublished} = {demo: false, unpublished: false}) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO - clean this up, it's dirty as hell. Switch case?
        const articlesPromise = demo ?
            getDemoArticles() :
            (unpublished ?
                getUnpublishedArticles() :
                getArticles()
            );

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
