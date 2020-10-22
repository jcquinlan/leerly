import '../styles/globals.css'
import React, {useEffect} from 'react';
import {auth} from '../services/index';
import AppContext from '../contexts/appContext';
import useAppContext from '../hooks/useAppContext';

function MyApp({ Component, pageProps }) {
  const appContextApi = useAppContext();

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        appContextApi.setUser(user);
      } else {
        appContextApi.setUser(null);
      }
    });
  }, []);

  return (
    <AppContext.Provider value={appContextApi}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp
