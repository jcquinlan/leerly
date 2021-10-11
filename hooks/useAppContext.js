import {useState, useMemo} from 'react';
import firebase from 'firebase';
import {getWordCounts} from '../services/userService';

const PLANS = {
    FREE_PLAN: 'leerly Starter',
    PRO_PLAN: 'leerly Pro'
};

const initialAppState = {
    loading: true,
    user: null,
    userProfile: null,
    claims: null,
    plans: [],
    idToken: null
};

const useAppContext = () => {
    const [appState, setAppState] = useState(initialAppState);

    const setUser = (user) => {
        setAppState(state => ({...state, user}));
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

    const loadIdToken = async () => {
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
            try {
                const idToken = await currentUser.getIdToken(true);
                setAppState(state => ({...state, idToken}));
            } catch (e) {
                console.error('Unable to get user id token');
            }
        }
    };

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
        setClaims,
        setUserProfile,
        setLoading,
        setPlans,
        updateUserProfileLocally,
        loadIdToken
    }
}

export default useAppContext;