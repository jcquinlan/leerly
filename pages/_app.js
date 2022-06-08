import '../styles/globals.css';
import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';
import { slide as Menu } from 'react-burger-menu';
import { ToastProvider } from 'react-toast-notifications';
import Modal from 'react-modal';
import { auth, analytics } from '../services/index';
import LoadingPage from '../components/LoadingPage';
import { signOutUser } from '../services/authService';
import { getUserProfile, getUserClaims, getUserPlans } from '../services/userService';
import { Container, devices, LinkSpan } from '../components/styled';
import UserCartoonAvatar from '../components/UserCartoonAvatar';

import { MixpanelContextProvider } from '../contexts/mixpanelContext';
import { ArticlesContextProvider } from '../contexts/articlesContext';
import AppContext, { AppContextProvider } from '../contexts/appContext';
import UIStateContext, { UIStateContextProvider } from '../contexts/uiStateContext';
import { StatsContextProvider } from '../contexts/statsContext';
import Link from 'next/link';

function MyApp ({ component: Component, pageProps }) {
  const appContextApi = useContext(AppContext);
  const uiStateContextApi = useContext(UIStateContext);
  const router = useRouter();
  const isAdmin = appContextApi.claims?.is_admin;

  // If we are just loading the landing page, lets not wait to fetch all the user's data, since
  // we dont need it to render the component.
  const isLandingPage = useMemo(() => {
    return router.pathname === '/';
  }, [router]);

  useEffect(() => {
    // Begin Google Analytics
    analytics();

    Router.events.on('routeChangeComplete', () => {
      !!window && window.scrollTo(0, 0);
      uiStateContextApi.setNavOpen(false);
    });

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        const profileData = profile.data();

        try {
          const subscriptions = await getUserPlans(profileData.customerId);
          const activePlans = subscriptions
            .map(({ plan }) => plan)
            .filter(plan => plan.active);

          appContextApi.setPlans(activePlans);
        } catch (e) {
          console.error(e);
        }

        appContextApi.setUser(user);
        await appContextApi.loadIdToken();
        appContextApi.setUserProfile(profileData);
        const claimRef = await getUserClaims(user.uid);
        const claimData = claimRef.data();

        if (claimData) {
          appContextApi.setClaims(claimData);
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
        uiStateContextApi.setNavOpen(false);
        router.push('/');
      });
  };

  const isSignedIn = useMemo(() => {
    return !!appContextApi.user;
  }, [appContextApi.user]);

  const renderMobileSignedOutLinks = () => {
    const ref = router.query.ref;

    const registerString = ref
      ? `/register?ref=${ref}`
      : '/register';

    return [
        <LinkSpan key="/"><Link key="home" id="/" className="menu-item" href="/">home</Link></LinkSpan>,
        <LinkSpan key="/about"><Link key="about" id="/about" className="menu-item" href="/about">about us</Link></LinkSpan>,
        <LinkSpan key="/demo"><Link key="free" id="/free" className="menu-item" href="/demo">demo articles</Link></LinkSpan>,
        <LinkSpan key="/register"><Link key="register" id="/register" className="menu-item" href={registerString}>register</Link></LinkSpan>,
        <LinkSpan key="/sign-in"><Link key="sign-in" id="/sign-in" className="menu-item" href="/sign-in">sign in</Link></LinkSpan>
    ];
  };

  const renderMobileSignedInLinks = () => {
    const links = [
        <LinkSpan key="/dashboard"><Link key="dashboard" id="/dashboard" className="menu-item" href="/dashboard">dashboard</Link></LinkSpan>,
        <LinkSpan key="/vocab"><Link key="vocab" id="/vocab" className="menu-item" href="/vocab">vocab / study</Link></LinkSpan>
    ];

    if (isAdmin) {
      links.push([
        <LinkSpan key="/admin-submit"><Link key="adminSubmit" id="/admin/submit" className="menu-item" href="/admin/submit">submit article</Link></LinkSpan>,
      ]);
    }

    links.push([
        <LinkSpan key="/settings"><Link key="settings" id="/settings" className="menu-item" href="/settings">account</Link></LinkSpan>
    ]);

    links.push([
        <a key="signOut" id="/sign-out" className="menu-item" onClick={handleSignOut}>sign out</a>
    ]);

    return links;
  };

  const renderDesktopSignedOutLinks = () => {
    const ref = router.query.ref;

    const registerString = ref
      ? `/register?ref=${ref}`
      : '/register';

    return [
        <Link key="home" role="link" id="/" className="menu-item" href="/">home</Link>,
        <Link key="about" role="link" id="/about" className="menu-item" href="/about">about us</Link>,
        <Link key="free" role="link" id="/free" className="menu-item" href="/demo">demo articles</Link>,
        <Link key="register" role="link" id="/register" className="menu-item" href={registerString}>register</Link>,
        <Link key="sign-in" role="link" id="/sign-in" className="menu-item" href="/sign-in">sign in</Link>
    ];
  };

  const renderDesktopSignedInLinks = () => {
    const links = [
        <Link key="dashboard" id="/dashboard" className="menu-item" href="/dashboard">dashboard</Link>,
        <Link key="vocab" id="/vocab" className="menu-item" href="/vocab">vocab / study</Link>
    ];

    if (isAdmin) {
      links.push([
        <Link key="adminSubmit" id="/admin/submit" className="menu-item" href="/admin/submit">submit article</Link>
      ]);
    }

    links.push([
        <Link key="settings" id="/settings" className="menu-item" href="/settings">account</Link>
    ]);

    links.push([
        <a key="signOut" id="/sign-out" className="menu-item" onClick={handleSignOut}>sign out</a>
    ]);

    return links;
  };

  const userDisplayName = appContextApi.userProfile?.name || appContextApi.user?.email;

  return (
    <>
      <ToastProvider
        autoDismiss={true}
      >
        <Modal
          isOpen={!!appContextApi.modal}
          onRequestClose={() => appContextApi.setModal(null)}
          style={customModalStyles}
          contentLabel="Example Modal"
        >
          {appContextApi.modal}
        </Modal>

        <MobileNav>
          <Menu isOpen={uiStateContextApi.navOpen} onStateChange={state => uiStateContextApi.setNavOpen(state.isOpen)} disableAutoFocus>

            {!appContextApi.loading && isSignedIn && (
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '10px' }}>
                  <UserCartoonAvatar userId={appContextApi.user?.uid} size={20} />
                </div>
                <span>{userDisplayName}</span>
              </div>
            )}

            {isSignedIn ? renderMobileSignedInLinks() : null}
            {!isSignedIn ? renderMobileSignedOutLinks() : null}
          </Menu>
        </MobileNav>

        <Header>
          <Container>
            {isSignedIn && (
              <ProfileInfoDisplay>
                <UserCartoonAvatar userId={appContextApi.user?.uid} size={20} />
                <span>{userDisplayName}</span>
              </ProfileInfoDisplay>
            )}

            <HeaderLinks>
              {isSignedIn ? renderDesktopSignedInLinks() : null}
              {!isSignedIn ? renderDesktopSignedOutLinks() : null}
            </HeaderLinks>
          </Container>
        </Header>

        {appContextApi.loading && !isLandingPage
          ? (
          <LoadingPage />
            )
          : (
          <Component {...pageProps} />
            )}

        <FooterContainer>
          <Footer>
            <span><strong><Link href="/dashboard">leerly.</Link></strong></span>
            <span><Link href="/privacy">privacy</Link></span>
            <span><Link href="/terms">terms of service</Link></span>
            <span>support: <a href="mailto:leerlylearning@gmail.com">leerlylearning@gmail.com</a></span>
          </Footer>
        </FooterContainer>
      </ToastProvider>
    </>
  );
}

function AppWrapper ({ Component, pageProps }) {
  return (
    <MixpanelContextProvider>
      <AppContextProvider>
        <UIStateContextProvider>
          <ArticlesContextProvider>
            <StatsContextProvider>
              <MyApp component={Component} pageProps={pageProps} />
            </StatsContextProvider>
          </ArticlesContextProvider>
        </UIStateContextProvider>
      </AppContextProvider>
    </MixpanelContextProvider>
  );
}

export default AppWrapper;

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const FooterContainer = styled(Container)`
  padding-bottom: 30px;

  @media ${devices.laptop} {
    padding-bottom: 60px;
  }
`;
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    cursor: pointer;
    font-size: 14px;
    margin-right: 15px;
  }

  @media ${devices.laptop} {
    justify-content: left;
  }

  @media ${devices.mobileL} {
    flex-direction: row;
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

  @media ${devices.mobileL} {
    display: none;
  }
`;

const Header = styled.div`
    ${Container} {
      padding-top: 60px;
      padding-bottom: 0;

      display: flex;
      justify-content: space-between;
    }
`;
const ProfileInfoDisplay = styled.div`
  display: flex;

  span {
    margin-left: 10px;
  }
`;

const HeaderLinks = styled.div`
  display: none;

  a {
    margin-right: 15px;
    font-size: 18px;
    color: black;
    cursor: pointer;
  }

  @media ${devices.mobileL} {
    display: flex;
  }
`;
