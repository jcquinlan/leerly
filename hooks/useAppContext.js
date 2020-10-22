import {useState} from 'react';

const initialAppState = {
    user: null,
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

    return {
        ...appState,
        setUser,
        setNavOpen
    }
}

export default useAppContext;