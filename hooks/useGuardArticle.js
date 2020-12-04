import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import AppContext from '../contexts/appContext';
import useGetArticle from './useGetArticle';

const useGuardArticle = (articleId) => {
    const {article, loading: articleLoading, error} = useGetArticle(articleId);
    const {user, userProfile, loading: userLoading} = useContext(AppContext);
    const router = useRouter();

    // Guard the route with a check to see if the user is an admin.
    useEffect(() => {
        if (userLoading || articleLoading) {
            return;
        }

        // If we aren't loading anything, and there isn't an article
        // it's because its not accessible to users who aren't logged in
        // thus it isn't free.
        if (!article || (article && !article.free)) {
            if (!user) {
                router.replace(`/sign-in?redirect=${router.asPath}`);
                return;
            }

            if (!userProfile.subscribed) {
                router.replace('/cancel');
                return;
            }
        }
    }, [user, userProfile, articleLoading, userLoading, article]);

    return {
        article,
        loading: userLoading || articleLoading,
        error
    }
}

export default useGuardArticle;