import React from 'react'
import useArticlesContext from '../hooks/useArticlesContext'

const defaultAppContext = {}
const ArticlesContext = React.createContext(defaultAppContext)

export const ArticlesContextProvider = ({ children }) => {
  const value = useArticlesContext()

  return (
        <ArticlesContext.Provider value={value}>
            {children}
        </ArticlesContext.Provider>
  )
}

export default ArticlesContext
