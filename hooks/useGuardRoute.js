import {useContext, useEffect} from 'react';
import AppContext from '../contexts/appContext';
import {useRouter} from 'next/router';

const useGuardRoute = () => {
    const {user, userProfile} = useContext(AppContext);
    const router = useRouter();

    // Guard the route with a check to see if the user is an admin.
    useEffect(() => {
        if (!user) {
            router.replace('/');
        }

        if (!userProfile.subscribed) {
            router.replace('/cancel');
        }
    }, [user]);
}

export default useGuardRoute;