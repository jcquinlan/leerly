import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import AppContext from '../contexts/appContext';
import useGetArticle from './useGetArticle';

const useGuardArticle = (articleId) => {
    const {article, loading: articleLoading, error} = useGetArticle(articleId);
    const {user, userProfile, userHasBasicPlan, loading: userLoading} = useContext(AppContext);
    const router = useRouter();

    // Guard the route with a check to see if the user can access the article.
    useEffect(() => {
        if (userLoading || articleLoading) {
            return;
        }

        if (article && article.demo) {
            return;
        }

        if (!user) {
            router.replace(`/sign-in?redirect=${router.asPath}`);
            return;
        }

        if (!userProfile?.subscribed) {
            router.replace('/cancel');
            return;
        }

        if (!userHasBasicPlan && !article.free) {
            router.replace('/dashboard');
            return;
        }
    }, [user, userProfile, articleLoading, userLoading, article]);

    return {
        article,
        loading: userLoading || articleLoading,
        error
    }
}

export default useGuardArticle;