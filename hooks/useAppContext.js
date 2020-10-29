import {useState} from 'react';

const initialAppState = {
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

    return {
        ...appState,
        setUser,
        setNavOpen,
        setClaims
    }
}

export default useAppContext;