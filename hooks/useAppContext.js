import {useState, useMemo} from 'react';

const PLANS = {
    FREE_PLAN: 'leerly Starter',
    PRO_PLAN: 'leerly Pro'
};

const initialAppState = {
    loading: true,
    user: null,
    userProfile: null,
    claims: null,
    navOpen: false,
    plans: []
};
const useAppContext = () => {
    const [appState, setAppState] = useState(initialAppState);

    const setUser = (user) => {
        setAppState(state => ({...state, user}));
    };

    const setNavOpen = (boolean) => {
        setAppState(state => ({...state, navOpen: boolean}));
    };

    const setClaims = (claims) => {
        setAppState(state => ({...state, claims}));
    }

    const setUserProfile = (userProfile) => {
        setAppState(state => ({...state, userProfile}));
    }

    const updateUserProfileLocally = (attrs) => {
        setAppState(state => (
            {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    ...attrs
                }
            }
        ));
    }

    const setLoading = (boolean) => {
        setAppState(state => ({...state, loading: boolean}));
    }

    const setPlans = (plans) => {
        setAppState(state => ({...state, plans}));
    }

    const userHasProPlan = useMemo(() => {
        return appState.plans.some(plan => plan.name === PLANS.PRO_PLAN);
    }, [appState.plans])

    const isAdmin = !!appState?.claims?.is_admin;

    return {
        ...appState,
        isAdmin,
        userHasProPlan,
        setUser,
        setNavOpen,
        setClaims,
        setUserProfile,
        setLoading,
        setPlans,
        updateUserProfileLocally
    }
}

export default useAppContext;