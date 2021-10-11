import React from 'react';
import useStatsContext from '../hooks/useStatsContext';

const defaultStatsContext = {
    wordCountRecords: []
};
const StatsContext = React.createContext(defaultStatsContext);

export const StatsContextProvider = ({children}) => {
    const value = useStatsContext();

    return (
        <StatsContext.Provider value={value}>
            {children}
        </StatsContext.Provider>
    )
};

export default StatsContext;