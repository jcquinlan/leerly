import React, {useState, useMemo, useEffect} from 'react';
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
import useEnforceSignedOut from '../hooks/useEnforceSignedOut';
import {useLocalStorage, REFERRAL_CODE_KEY} from '../hooks/useLocalStorage';

function RegisterPage () {
    useEnforceSignedOut();

    const router = useRouter();
    const [savedReferralCode, storeReferralCode] = useLocalStorage(REFERRAL_CODE_KEY, null);
    const referralCode = useMemo(() => router.query.referralCode || savedReferralCode, [router, savedReferralCode]);

    const {addToast} = useToasts();
    const [formState, setFormState] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const formIsFilled = useMemo(() => {
        return !!(formState.name && formState.email && formState.password && formState.confirmPassword);
    }, [formState]);

    useEffect(() => {
        if (router.query.referralCode) {
            storeReferralCode(router.query.referralCode);
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
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
                name: formState.name
            });
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

        <ExplanationText>
            <Primary>$5/month.</Primary> First month <b>free</b> with the code LISTO during checkout.
        </ExplanationText>

        <Card>
            <HelpText>
                After submitting your email and password, you'll be redirected to our payment page to provide
                billing information.
            </HelpText>

            <form onSubmit={handleSubmit}>
                <Input type='text' name='name' placeholder='your name' required onChange={handleFormState}/>
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

const Primary = styled.span`
    color: ${Colors.Primary};
    font-weight: bold;
    font-size: 24px;
    margin-right: 5px;
`;
