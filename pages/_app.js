import '../styles/globals.css'
import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import { slide as Menu } from 'react-burger-menu'
import {ToastProvider} from 'react-toast-notifications'
import {auth} from '../services/index';
import AppContext from '../contexts/appContext';
import Link from '../components/Link';
import LoadingPage from '../components/LoadingPage';
import useAppContext from '../hooks/useAppContext';
import { signOutUser } from '../services/authService';
import { getUserProfile, getUserClaims } from '../services/userService';

function MyApp({ Component, pageProps }) {
  const appContextApi = useAppContext();
  const isAdmin = appContextApi.claims && appContextApi.claims.is_admin;

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
          })
          .finally(() => {
            appContextApi.setLoading(false);
          });
      } else {
        appContextApi.setUser(null);
        appContextApi.setClaims(null);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        appContextApi.setUser(null);
        appContextApi.setClaims(null);
      });
  }

  const isSignedIn = useMemo(() => {
    return !!appContextApi.user;
  }, [appContextApi.user]);

  const renderSignedOutLinks = () => {
    return [
        <Link id="/free" className="menu-item" href="/free">free articles</Link>,
        <Link id="/register" className="menu-item" href="/register">register</Link>,
        <Link id="/sign-in" className="menu-item" href="/sign-in">sign in</Link>
    ]
  };

  const renderSignedInLinks = () => {
    const links = [
        <Link id="/dashboard" className="menu-item" href="/dashboard">dashboard</Link>,
    ];

    if (isAdmin) {
      links.push([
        <Link id="/admin/submit" className="menu-item" href="/admin/submit">submit article</Link>,
      ])
    }

    links.push([
        <a id="/sign-out" className="menu-item" onClick={handleSignOut}>sign out</a>
    ]);

    return links;
  };

  return (
    <>
    <AppContext.Provider value={appContextApi}>
      <ToastProvider>
        {/* <MobileNav>
          <Menu isOpen={appContextApi.navOpen} onStateChange={state => appContextApi.setNavOpen(state.isOpen)} disableAutoFocus>
            {appContextApi.user && <span>{appContextApi.user.email}</span>}
            <Link id="/" className="menu-item" href="/">home</Link>
            {isSignedIn ? renderSignedInLinks() : null}
            {!isSignedIn ? renderSignedOutLinks() : null}
          </Menu>
        </MobileNav> */}

        {appContextApi.loading ? (
          <LoadingPage />
        ) : (
          <Component {...pageProps} />
        )}
      </ToastProvider>
    </AppContext.Provider>
    </>
  )
}

export default MyApp

const MobileNav = styled.div`
  a {
    color: inherit;
    cursor: pointer;
  }

  span {
    cursor: pointer;
  }
`;
