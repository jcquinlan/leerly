import React, {useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/router'
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Subtitle} from '../components/styled';
import {updateCustomerSubscribedStatus} from '../services/userService';
import {addUserToProductionMailingList} from '../services/emailService';
import {getStripeSession} from '../services/stripeService';
import {useLocalStorage, REFERRAL_CODE_KEY} from '../hooks/useLocalStorage';
import {getReferralCode, createReferralRecord} from '../services/referralService';
import mixpanelContext from '../contexts/mixpanelContext';

function SuccessPage () {
    const router = useRouter();
    const mixpanel = useContext(mixpanelContext);
    const [_, setReferralCode] = useLocalStorage(REFERRAL_CODE_KEY, null);
    const [referralCodeCreated, setReferralCodeCreated] = useState(false);
    const {id, email, session_id, referralCode} = router.query

    useEffect(() => {
        if (mixpanel) {
            const ref = router.query.ref;
            mixpanel.trackEvent('stripe-checkout-complete', {ref});
        }
    }, []);

    useEffect(() => {
        if (id && email && session_id) {
            addUserToProductionMailingList(email)
                .then(() => getStripeSession(session_id))
                .then((session) => {
                    const customerId = session.customer;
                    updateCustomerSubscribedStatus(id, {subscribed: true, customerId})
                })
                .catch(err => console.error(err));
        }

        if (referralCode && !referralCodeCreated) { 
            getReferralCode(referralCode)
                .then(referralCodeRef => {
                    if (referralCodeRef.docs.length) {
                        const referralCodeObject = referralCodeRef.docs[0].data();
                        return referralCodeObject;
                    }
                })
                .then((referralCodeObject) => {
                    if (referralCodeObject) {
                        return createReferralRecord(referralCodeObject, email);
                    }
                })
                .then(() => {
                    setReferralCode(null);
                    setReferralCodeCreated(true);
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>¡Felicitaciones!</Title>
                <Subtitle>
                    You're all signed up. You'll get the next newsletter in your inbox, but for now you can search through all our older
                    articles in the Dashboard.
                </Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <Button>
            {/* TODO -- Replace with the next router link */}
            <a href="/dashboard">Start reading articles</a>
        </Button>

        </Container>
        </>
    );
}

export default SuccessPage;
