import React from 'react';
import useUIStateContext from '../hooks/useUIStateContext';

const defaultAppContext = {};
const UIStateContext = React.createContext(defaultAppContext);

export const UIStateContextProvider = ({children}) => {
    const value = useUIStateContext();

    return (
        <UIStateContext.Provider value={value}>
            {children}
        </UIStateContext.Provider>
    )
};

export default UIStateContext;