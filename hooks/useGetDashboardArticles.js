import {useState, useEffect, useContext} from 'react';
import appContext from '../contexts/appContext';
import {getArticles, getFreeArticles, getPaidArticlePreviews} from '../services/articleService';

const useDashboardArticles = (filters) => {
    const {userHasProPlan} = useContext(appContext);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userHasProPlan) {
            getArticles(filters)
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
        } else {
            // We separately load the non-free articles because we want to make sure
            // we don't send the article bodies to the client, so we strip them out
            // on the server in a custom endpoint
            Promise.all([getFreeArticles(filters), getPaidArticlePreviews(filters)])
                .then(async ([freeArticles, paidArticlePreviews]) => {
                    const freeArticlesData = freeArticles.docs.map(doc => ({id: doc.id, ...doc.data()})); 
                    const paidArticlePreviewsData = await paidArticlePreviews.json();

                    const allArticles = [...freeArticlesData, ...paidArticlePreviewsData.articles].sort((a, b) => {
                        return b.added_at.seconds - a.added_at.seconds;
                    })

                    setArticles(allArticles);
                })
                .catch(err => {
                    console.log(err)
                    setError(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

    }, [filters]);

    return {
        articles,
        loading,
        error
    }
}

export default useDashboardArticles;
