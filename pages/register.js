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
    Colors,
    GhostButton
} from '../components/styled';
import {
    Plans,
    PlanContainer,
    PlanBody,
    PlanHeader
  } from '../components/Plans';
import {useRouter} from 'next/router';
import { NextSeo } from 'next-seo';
import {
    redirectToStripeCheckout,
    createStripeCustomer,
    createStripeSubscription
} from '../services/stripeService';
import {registerUser} from '../services/authService';
import {addUserToProductionMailingList} from '../services/emailService';
import {
    createUserProfileDocument,
    updateCustomerSubscribedStatus,
} from '../services/userService';
import {useLocalStorage, REFERRAL_CODE_KEY} from '../hooks/useLocalStorage';
import mixpanelContext from '../contexts/mixpanelContext';

const PLANS = {
    LEERLY_STARTER: 'leerly-starter',
    LEERLY_PRO: 'leerly-pro'
}
const UI_STATES = {
    BASIC_INFO: 'basic-info',
    PLAN_INFO: 'plan-info'
};

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

    const [uiState, setUIState] = useState(UI_STATES.BASIC_INFO);
    const [selectedPlan, setSelectedPlan] = useState(null);

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

    const submitRegistration = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const paidPlan = selectedPlan === PLANS.LEERLY_PRO;

        try {
            const ref = router.query.ref;

            if (!formIsFilled) {
                throw Error('Please fill out all information');
            }

            if (formState.password !== formState.confirmPassword) {
                throw Error('Passwords do not match.');
            }

            // Create the user's record, and their profile record on the server.
            const userData = await registerUser(formState.email, formState.password);

            await mixpanel.trackEvent('account-created', {ref});

            if (paidPlan) {
                redirectToStripeCheckout(userData.uid, formState.email, referralCode);
                return;
            } else {
                const customerData = await createStripeCustomer(formState.email);
                const customerId = customerData.id;

                // Create subscription for new user in Stripe.
                await createStripeSubscription(customerId);

                // Add the Stripe customerId to the user profile (and set subscribed to true)
                await updateCustomerSubscribedStatus(userData.uid, customerId);

                // Put the user onto the production mailing list
                await addUserToProductionMailingList(formState.email);

                router.push('/sign-in');
            }
        } catch (error) {
            console.error(error);
            addToast(error.message, {appearance: 'error'});
        } finally {
            setSubmitting(false);
        }
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
            <RegistrationStep selected={uiState === UI_STATES.BASIC_INFO}>1. Basic info</RegistrationStep> - 
            <RegistrationStep selected={uiState === UI_STATES.PLAN_INFO}>2. Select a plan</RegistrationStep> - 
            <RegistrationStep>3. Billing (paid plans only)</RegistrationStep>
        </ExplanationText>

        {uiState === UI_STATES.BASIC_INFO && (
            <Card>
                <form>
                    <Input type='email' name='email' placeholder='email' value={formState.email} required onChange={handleFormState}/>
                    <Input type='password' name='password' placeholder='password' value={formState.password} required onChange={handleFormState}/>
                    <Input type='password' name='confirmPassword' placeholder='confirm password' value={formState.confirmPassword} required onChange={handleFormState}/>
                    <Button onClick={() => setUIState(UI_STATES.PLAN_INFO)} disabled={!formIsFilled}>Next</Button>
                </form>
            </Card>
        )}

        {uiState === UI_STATES.PLAN_INFO && (
            <PlanSection>
                <GhostButton onClick={() => setUIState(UI_STATES.BASIC_INFO)}>Go back</GhostButton>

                <Plans selectable>
                    <PlanContainer
                        selected={selectedPlan === PLANS.LEERLY_STARTER}
                        onClick={() => setSelectedPlan(PLANS.LEERLY_STARTER)}
                    >
                        <PlanHeader>
                        Free
                        </PlanHeader>
                        <PlanBody>
                        <ul>
                            <li>Access to limited articles</li>
                            <li>High-quality audio</li>
                            <li>Limited in-app translations</li>
                            <li>Access to the weekly speaking sessions</li>
                        </ul>
                        </PlanBody>
                    </PlanContainer>

                    <PlanContainer
                        selected={selectedPlan === PLANS.LEERLY_PRO}
                        onClick={() => setSelectedPlan(PLANS.LEERLY_PRO)}
                    >
                        <PlanHeader special={true}>
                        $5/month
                        </PlanHeader>
                        <PlanBody>
                        <ul>
                            <li>Access to all articles</li>
                            <li>High-quality audio</li>
                            <li>Unlimited in-app translations</li>
                            <li>Built-in flashcards</li>
                            <li>Audio speed controls</li>
                            <li>Priority access to the weekly speaking sessions</li>
                        </ul>
                        </PlanBody>
                    </PlanContainer>
                </Plans>

                <Button onClick={submitRegistration} disabled={!selectedPlan || submitting}>Submit</Button>
            </PlanSection>
        )}

        </Container>
        </>
    );
}

export default RegisterPage;

const RegistrationStep = styled.span`
    color: ${Colors.MediumGrey};

    ${props => props.selected ? `
        color: ${Colors.Primary};
        font-weight: bold;
    `: ``}
`;
const ExplanationText = styled.div`
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
    font-weight: 200;
    color: ${Colors.MediumGrey};

    span {
        margin: 0 10px;
    }
`;

const PlanSection = styled.div`
    ${Plans} {
        margin: 30px 0;
    }
`;
