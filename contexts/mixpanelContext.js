import React from 'react'
import useMixPanel from '../hooks/useMixpanel'

const defaultAppContext = {}
const MixPanelContext = React.createContext(defaultAppContext)

export const MixpanelContextProvider = ({ children }) => {
  const value = useMixPanel()

  return (
        <MixPanelContext.Provider value={value}>
            {children}
        </MixPanelContext.Provider>
  )
}

export default MixPanelContext
