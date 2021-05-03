import {useState, useEffect, useContext} from 'react';
import appContext from '../contexts/appContext';
import {getArticles, getFreeArticles, getPaidArticlePreviews} from '../services/articleService';

const useDashboardArticles = () => {
    const {userHasBasicPlan} = useContext(appContext);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userHasBasicPlan) {
            getArticles()
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
            Promise.all([getFreeArticles(), getPaidArticlePreviews()])
                .then(async ([freeArticles, paidArticlePreviews]) => {
                    const freeArticlesData = freeArticles.docs.map(doc => ({id: doc.id, ...doc.data()})); 
                    const paidArticlePreviewsData = await paidArticlePreviews.json();

                    const allArticles = [...freeArticlesData, ...paidArticlePreviewsData.articles].sort((a, b) => {
                        return b.added_at.seconds - a.added_at.seconds;
                    })

                    console.log(allArticles)
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

    }, []);

    return {
        articles,
        loading,
        error
    }
}

export default useDashboardArticles;
