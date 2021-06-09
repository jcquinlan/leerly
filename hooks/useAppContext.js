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
    plans: [],
    modal: null
};
const useAppContext = () => {
    const [appState, setAppState] = useState(initialAppState);

    const setUser = (user) => {
        setAppState(state => ({...state, user}));
    };

    const setModal = (modal) => {
        setAppState(state => ({...state, modal}));
    }

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
    }, [appState.plans]);

    const userProfileIsComplete = useMemo(() => {
        return (
            !!appState.userProfile?.name,
            !!appState.userProfile?.levels?.spanish
        )
    }, [appState.userProfile]);

    const isAdmin = !!appState?.claims?.is_admin;

    return {
        ...appState,
        isAdmin,
        userHasProPlan,
        userProfileIsComplete,
        setUser,
        setNavOpen,
        setClaims,
        setUserProfile,
        setLoading,
        setPlans,
        updateUserProfileLocally,
        setModal
    }
}

export default useAppContext;