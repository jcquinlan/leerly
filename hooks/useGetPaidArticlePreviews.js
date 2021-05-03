import {useState, useEffect} from 'react';
import {getPaidArticlePreviews} from '../services/articleService';

const useGetPaidArticlePreviews = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO - clean this up, it's dirty as hell. Switch case?
        const articlesPromise = getPaidArticlePreviews();

        articlesPromise
            .then(res => res.json())
            .then(articleData => {
                setArticles(articleData.articles);
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

export default useGetPaidArticlePreviews;
