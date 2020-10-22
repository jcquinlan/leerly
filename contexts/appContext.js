import React from 'react';

// This should match the API for useAppContext
const defaultAppContext = {
  user: null,
  setUser: () => {}
};
export default React.createContext(defaultAppContext);