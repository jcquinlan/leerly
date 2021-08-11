import {useState, useEffect, useContext} from 'react';
import appContext from '../contexts/appContext';
import {getArticle} from '../services/articleService';

const useGetArticle = (articleId) => {
    const {articles} = useContext(appContext);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (articleId) {
            const articleInMemory = articles.find(currentArticle => currentArticle.id === articleId);

            if (articleInMemory) {
                setArticle(articleInMemory);
                setLoading(false);
            } else {
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
        }
    }, [articleId]);

    return {
        article,
        loading,
        error
    }
}

export default useGetArticle;
