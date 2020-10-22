import '../styles/globals.css'
import React, {useEffect} from 'react';
import styled from 'styled-components';
import {auth} from '../services/index';
import AppContext from '../contexts/appContext';
import useAppContext from '../hooks/useAppContext';
import { slide as Menu } from 'react-burger-menu'

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
    <>
      <MobileNav>
        <Menu isOpen={appContextApi.navOpen}>
          <a id="/register" className="menu-item" href="/">Home</a>
          <a id="/sign-in" className="menu-item" href="/about">About</a>
          <a id="contact" className="menu-item" href="/contact">Contact</a>
        </Menu>
      </MobileNav>

    <AppContext.Provider value={appContextApi}>
      <Component {...pageProps} />
    </AppContext.Provider>
    </>
  )
}

export default MyApp

const MobileNav = styled.div`
  // @media (min-width: 900px) {
  //   display: none;
  // }
`;
