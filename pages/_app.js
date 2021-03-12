import '../styles/globals.css'
import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import Router, {useRouter} from 'next/router';
import { slide as Menu } from 'react-burger-menu'
import {ToastProvider} from 'react-toast-notifications'
import {auth, analytics} from '../services/index';
import AppContext from '../contexts/appContext';
import Link from '../components/Link';
import LoadingPage from '../components/LoadingPage';
import useAppContext from '../hooks/useAppContext';
import { signOutUser } from '../services/authService';
import { getUserProfile, getUserClaims } from '../services/userService';
import {Container, devices} from '../components/styled';

function MyApp({ Component, pageProps }) {
  const appContextApi = useAppContext();
  const isAdmin = appContextApi.claims && appContextApi.claims.is_admin;
  const router = useRouter();
  // If we are just loading the landing page, lets not wait to fetch all the user's data, since
  // we dont need it to render the component.
  const isLandingPage = useMemo(() => {
    return router.pathname === '/';
  }, [router]);

  useEffect(() => {
    // Begin Google Analytics
    analytics();

    Router.events.on('routeChangeComplete', () => { !!window && window.scrollTo(0, 0); });

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        appContextApi.setUser(user);
        appContextApi.setUserProfile(profile.data());
        const claimRef = await getUserClaims(user.uid)
        const claimData = claimRef.data();

        if (claimData) {
          appContextApi.setClaims(claimData)
        }

        appContextApi.setLoading(false);
      } else {
        appContextApi.setUser(null);
        appContextApi.setClaims(null);
        // If the user is not logged in, we don't need to fetch their profile data
        // so we have nothing to load, and need to set loading to false to unblock
        // the rest of the UI from rendering.
        appContextApi.setLoading(false);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        appContextApi.setUser(null);
        appContextApi.setClaims(null);
        appContextApi.setNavOpen(false);
      });
  }

  const isSignedIn = useMemo(() => {
    return !!appContextApi.user;
  }, [appContextApi.user]);

  const renderSignedOutLinks = () => {
    return [
        <Link key="home" id="/" className="menu-item" href="/">home</Link>,
        <Link key="free" id="/free" className="menu-item" href="/free">free articles</Link>,
        <Link key="register" id="/register" className="menu-item" href="/register">register</Link>,
        <Link key="sign-in" id="/sign-in" className="menu-item" href="/sign-in">sign in</Link>
    ]
  };

  const renderSignedInLinks = () => {
    const links = [
        <Link key="dashboard" id="/dashboard" className="menu-item" href="/dashboard">dashboard</Link>,
        <Link key="vocab" id="/vocab" className="menu-item" href="/vocab">vocab / study</Link>,
    ];

    if (isAdmin) {
      links.push([
        <Link key="adminSubmit" id="/admin/submit" className="menu-item" href="/admin/submit">submit article</Link>,
        <Link key="referrals" id="/admin/referrals" className="menu-item" href="/admin/referrals">see open referrals</Link>,
        <Link key="unpublishedArticles" id="/admin/unpublished-articles" className="menu-item" href="/admin/unpublished-articles">unpublished articles</Link>,
      ])
    }

    links.push([
        <Link key="settings" id="/settings" className="menu-item" href="/settings">settings</Link>,
    ]);

    links.push([
        <a key="signOut" id="/sign-out" className="menu-item" onClick={handleSignOut}>sign out</a>
    ]);

    return links;
  };

  return (
    <>
    <AppContext.Provider value={appContextApi}>
      <ToastProvider>
        <MobileNav>
          <Menu isOpen={appContextApi.navOpen} onStateChange={state => appContextApi.setNavOpen(state.isOpen)} disableAutoFocus>
            {appContextApi.user && <span>{appContextApi.user.email}</span>}
            {isSignedIn ? renderSignedInLinks() : null}
            {!isSignedIn ? renderSignedOutLinks() : null}
          </Menu>
        </MobileNav>

        {appContextApi.loading && !isLandingPage ? (
          <LoadingPage />
        ) : (
          <Component {...pageProps} />
        )}

        <FooterContainer>
          <Footer>
            <span><strong><Link href="/dashboard">leerly.</Link></strong></span>
            <span><Link href="/privacy">privacy</Link></span>
            <span><Link href="/terms">terms of service</Link></span>
          </Footer>
        </FooterContainer>
      </ToastProvider>
    </AppContext.Provider>
    </>
  )
}

export default MyApp

const FooterContainer = styled(Container)`
  padding-bottom: 30px;

  @media ${devices.laptop} {
    padding-bottom: 60px;
  }
`;
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  span {
    cursor: pointer;
    font-size: 14px;
    margin-right: 15px;
  }

  @media ${devices.laptop} {
    justify-content: left;
  }
`;

const MobileNav = styled.div`
  a {
    color: inherit;
    cursor: pointer;
  }

  span {
    cursor: pointer;
  }
`;
