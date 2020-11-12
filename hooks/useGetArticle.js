import {useState, useEffect} from 'react';
import {getArticle} from '../services/articleService';

const useGetArticle = (articleId) => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (articleId) {
            getArticle(articleId)
                .then(articleDoc => {
                    const articleData = articleDoc.data();
                    setArticle({id: articleDoc.id, ...articleData});
                })
                .catch(err => {
                    setError(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [articleId]);

    return {
        article,
        loading,
        error
    }
}

export default useGetArticle;
