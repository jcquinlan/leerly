import React from 'react';
import useAppContext from '../hooks/useAppContext';

const defaultAppContext = {};
const AppContext = React.createContext(defaultAppContext);

export const AppContextProvider = ({children}) => {
    const value = useAppContext();

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContext;
