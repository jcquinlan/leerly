import React, {useState, useMemo, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {useToasts} from 'react-toast-notifications';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button,
    Input,
    Card,
    HelpText,
    Colors
} from '../components/styled';
import {useRouter} from 'next/router';
import { NextSeo } from 'next-seo';
import {redirectToStripeCheckout} from '../services/stripeService';
import {registerUser} from '../services/authService';
import {createUserProfileDocument} from '../services/userService';
import {useLocalStorage, REFERRAL_CODE_KEY} from '../hooks/useLocalStorage';
import mixpanelContext from '../contexts/mixpanelContext';

function RegisterPage () {
    const mixpanel = useContext(mixpanelContext);
    const router = useRouter();
    const [savedReferralCode, storeReferralCode] = useLocalStorage(REFERRAL_CODE_KEY, null);
    const referralCode = useMemo(() => router.query.referralCode || savedReferralCode, [router, savedReferralCode]);

    const {addToast} = useToasts();
    const [formState, setFormState] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const formIsFilled = useMemo(() => {
        return !!(formState.email && formState.password && formState.confirmPassword);
    }, [formState]);

    useEffect(() => {
        if (mixpanel) {
            const ref = router.query.ref;
            mixpanel.trackEvent('register-page-loaded', {ref});
        }
    }, []);

    useEffect(() => {
        if (router.query.referralCode) {
            storeReferralCode(router.query.referralCode);
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const ref = router.query.ref;

            if (!formIsFilled) {
                throw Error('Please fill out all information');
            }

            if (formState.password !== formState.confirmPassword) {
                throw Error('Passwords do not match.');
            }

            const userDocument = await registerUser(formState.email, formState.password);
            await createUserProfileDocument({
                email: userDocument.user.email,
                user_uid: userDocument.user.uid,
            });
            await mixpanel.trackEvent('account-created', {ref});
            redirectToStripeCheckout(userDocument.user.uid, userDocument.user.email, referralCode);
        } catch (error) {
            console.error(error);
            addToast(error.message, {appearance: 'error'})
        }

        setSubmitting(false);
    };

    const handleFormState = (event) => {
        const newState = {
            ...formState,
            [event.target.name]: event.target.value
        };
        setFormState(newState);
    }

    return (
        <>
        <NextSeo 
            title="leerly - register"
            description="start reading articles in B1/B2 Spanish"
        />
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>register</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        {/* <PricingInfo>
            <Primary>$5/month</Primary> for <b>hundreds of articles</b> in intermediate Spanish, <b>hours of slow audio</b> of native speakers reading,
             <b>translating</b> in-app, built-in <b>vocab studying</b>, weekly <b>live Spanish classes</b>
        </PricingInfo> */}

        <ExplanationText>
            First month <b>free</b>, and your money back guaranteed if you aren't happy. No questions asked.
        </ExplanationText>

        <Card>
            <HelpText>We will ask you for billing info after this, but we wont charge you until the trial is over. You can cancel any time, too.</HelpText>

            <form onSubmit={handleSubmit}>
                <Input type='email' name='email' placeholder='email' required onChange={handleFormState}/>
                <Input type='password' name='password' placeholder='password' required onChange={handleFormState}/>
                <Input type='password' name='confirmPassword' placeholder='confirm password' required onChange={handleFormState}/>
                <Button type='submit' disabled={!formIsFilled || submitting}>Continue to Billing</Button>
            </form>
        </Card>

        </Container>
        </>
    );
}

export default RegisterPage;

const ExplanationText = styled.div`
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
    font-weight: 200;
`;

const PricingInfo = styled.div`
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
    font-weight: 200;
    line-height: 36px;
`;

const Primary = styled.span`
    color: ${Colors.Primary};
    font-weight: bold;
    font-size: 24px;
`;
