import '../styles/globals.css'
import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {auth} from '../services/index';
import AppContext from '../contexts/appContext';
import useAppContext from '../hooks/useAppContext';
import { slide as Menu } from 'react-burger-menu'
import { signOutUser } from '../services/authService';
import { getUserProfile, getUserClaims } from '../services/userService';

function MyApp({ Component, pageProps }) {
  const appContextApi = useAppContext();

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        getUserProfile(user.uid)
          .then(profile => {
            appContextApi.setUser(user);
          })
          .then(() => getUserClaims(user.uid))
          .then(res => {
            const claimData = res.data();
            if (claimData) {
              appContextApi.setClaims(claimData)
            }
          });
      } else {
        appContextApi.setUser(null);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        appContextApi.setUser(null);
      });
  }

  const isSignedIn = useMemo(() => {
    return !!appContextApi.user;
  }, [appContextApi.user]);

  const renderSignedOutLinks = () => {
    return [
        <a id="/free" className="menu-item" href="/free">free articles</a>,
        <a id="/register" className="menu-item" href="/register">register</a>,
        <a id="/sign-in" className="menu-item" href="/sign-in">sign in</a>
    ]
  };

  const renderSignedInLinks = () => {
    return [
        <a id="/dashboard" className="menu-item" href="/dashboard">dashboard</a>,
        <a id="/sign-out" className="menu-item" onClick={handleSignOut}>sign out</a>
    ]
  };

  return (
    <>
      {/* <MobileNav>
        <Menu isOpen={appContextApi.navOpen} disableAutoFocus>
          {appContextApi.user && <span>{appContextApi.user.email}</span>}
          <a id="/" className="menu-item" href="/">home</a>
          {isSignedIn ? renderSignedInLinks() : null}
          {!isSignedIn ? renderSignedOutLinks() : null}
        </Menu>
      </MobileNav> */}

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
