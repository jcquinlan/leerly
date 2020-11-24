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

        if (!article.free) {
            if (!user) {
                router.replace('/');
            }

            if (!userProfile.subscribed) {
                router.replace('/cancel');
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