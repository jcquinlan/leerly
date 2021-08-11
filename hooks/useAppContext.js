import {useState, useMemo, useEffect} from 'react';
import firebase, { apps } from 'firebase';
import { getArticles } from '../services/articleService';

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
    modal: null,
    articles: [],
    idToken: null,
    loadingArticles: true,
    articlesError: null
};

const useAppContext = () => {
    const [appState, setAppState] = useState(initialAppState);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [articlesError, setArticlesError] = useState();

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

    const loadArticles = async (filters) => {
        setLoadingArticles(true);

        try {
            if (!appState.idToken) return;

            const incomingArticles = await getArticles(appState.idToken, filters);
            setAppState(state => ({
                ...state,
                articles: incomingArticles
            }))
        } catch (e) {
            setArticlesError(e.message);
        }

        setLoadingArticles(false);
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
        loadingArticles,
        articlesError,
        setUser,
        setNavOpen,
        setClaims,
        setUserProfile,
        setLoading,
        setPlans,
        updateUserProfileLocally,
        setModal,
        loadArticles,
        loadIdToken
    }
}

export default useAppContext;