import {useContext, useEffect} from 'react';
import AppContext from '../contexts/appContext';
import {useRouter} from 'next/router';

const useGuardRoute = () => {
    const {user, userProfile, loading: loadingUserProfile} = useContext(AppContext);
    const router = useRouter();

    // Guard the route with a check to see if the user is an admin.
    useEffect(() => {
        if (loadingUserProfile) {
            return;
        }

        if (!user) {
            router.replace(`/sign-in?redirect=${router.asPath}`);
            return;
        }

        if (!userProfile.subscribed) {
            router.replace('/cancel');
            return;
        }
    }, [user, userProfile, loadingUserProfile]);
}

export default useGuardRoute;