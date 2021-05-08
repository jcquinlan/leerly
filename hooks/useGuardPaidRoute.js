import {useContext, useEffect} from 'react';
import AppContext from '../contexts/appContext';
import {useRouter} from 'next/router';

const useGuardPaidRoute = () => {
    const {userHasProPlan} = useContext(AppContext);
    const router = useRouter();

    // Guard the route with a check to see if the user is an admin.
    useEffect(() => {
        if (!userHasProPlan) {
            router.replace('/dashboard');
        }
    }, [userHasProPlan]);
}

export default useGuardPaidRoute;