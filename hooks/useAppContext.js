import {useState} from 'react';

const initialAppState = {
    loading: true,
    user: null,
    claims: null,
    navOpen: false
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

    const setLoading = (boolean) => {
        setAppState(state => ({...state, loading: boolean}));
    }

    const isAdmin = appState.claims && appState.claims.is_admin;

    return {
        ...appState,
        setUser,
        setNavOpen,
        setClaims,
        setLoading,
        isAdmin
    }
}

export default useAppContext;