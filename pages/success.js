import React, {useEffect, useState, useContext, useMemo} from 'react';
import {useRouter} from 'next/router'
import Link from 'next/link';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Subtitle} from '../components/styled';
import {updateCustomerSubscribedStatus} from '../services/userService';
import {addUserToProductionMailingList} from '../services/emailService';
import {getStripeSession} from '../services/stripeService';
import mixpanelContext from '../contexts/mixpanelContext';

function SuccessPage () {
    const router = useRouter();
    const mixpanel = useContext(mixpanelContext);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (mixpanel) {
            const ref = router.query.ref;
            mixpanel.trackEvent('stripe-checkout-complete', {ref});
        }
    }, []);

    useEffect(() => {
        const {id, email, session_id} = router.query;

        if (id && email && session_id) {
            addUserToProductionMailingList(email)
                .then(() => getStripeSession(session_id))
                .then((session) => {
                    const customerId = session.customer;
                    return updateCustomerSubscribedStatus(id, customerId);
                })
                .then((data) => {
                    setUserData(data);
                    setError(false);
                })
                .catch(err => {
                    setError(true);
                    console.error(err)
                })
                .finally(() => setLoading(false));
        }
    }, [router.query]);

    const titleText = useMemo(() => {
        if (loading) {
            return 'Just one minute...';
        }

        if (error) {
            return 'Uh oh!';
        }

        return `¡Felicitaciones, ${userData.name || userData.email || 'amigo'}!`;
    }, [loading, error, userData]);

    const subtitleText = useMemo(() => {
        if (loading) {
            return `We are finishing up a couple details, please don't close the browser.`;
        }

        if (error) {
            return `Something went wrong when trying to finish your account creation. Contact leerly support if you are unable to log in.`;
        }

        return `You're all good to go! Click below to sign in and start learning.`;
    }, [loading, error]);

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>{titleText}</Title>
                <Subtitle>{subtitleText}</Subtitle>
            </HeroContent>
        </HeroWrapper>

        {!error && !loading && (
            <div style={{display: 'flex', justifyContent: 'center', margin: '30px 0 60px 0'}}>
                <Button>
                    <Link href="/sign-in?registered=true">Start learning</Link>
                </Button>
            </div>
        )}

        </Container>
        </>
    );
}

export default SuccessPage;
