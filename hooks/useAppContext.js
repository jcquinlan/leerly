import {useState} from 'react';

const PLANS = {
    FREE_PLAN: 'leerly Starter Plan',
    BASIC_PLAN: 'leerly Basic'
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

    const setLoading = (boolean) => {
        setAppState(state => ({...state, loading: boolean}));
    }

    const setPlans = (plans) => {
        setAppState(state => ({...state, plans}));
    }

    const userHasBasicPlan = () => {
        return appState.plans.some(plan => plan.name === PLANS.BASIC_PLAN);
    }

    const isAdmin = !!appState?.claims?.is_admin;

    return {
        ...appState,
        isAdmin,
        setUser,
        setNavOpen,
        setClaims,
        setUserProfile,
        setLoading,
        setPlans,
        userHasBasicPlan
    }
}

export default useAppContext;