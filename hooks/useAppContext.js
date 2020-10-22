import {useState} from 'react';

const initialAppState = {
    user: null
};
const useAppContext = () => {
    const [appState, setAppState] = useState(initialAppState);

    const setUser = (user) => {
        setAppState(state => ({...state, user}));
    };

    return {
        ...appState,
        setUser
    }
}

export default useAppContext;