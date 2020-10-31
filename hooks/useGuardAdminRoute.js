import {useContext, useEffect} from 'react';
import AppContext from '../contexts/appContext';
import {useRouter} from 'next/router';

const useGuardAdminRoute = () => {
    const {isAdmin} = useContext(AppContext);
    const router = useRouter();

    // Guard the route with a check to see if the user is an admin.
    useEffect(() => {
        if (!isAdmin) {
            router.replace('/');
        }
    }, [isAdmin]);
}

export default useGuardAdminRoute;