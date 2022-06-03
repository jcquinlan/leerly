import React, { useState, useMemo, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications'
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
  devices,
  HelpText
} from '../components/styled'
import {
  Plans,
  PlanContainer,
  PlanBody,
  PlanHeader
} from '../components/Plans'
import LoadingPage from '../components/LoadingPage'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import {
  redirectToStripeCheckout,
  createStripeCustomer,
  createStripeSubscription
} from '../services/stripeService'
import { registerUser } from '../services/authService'
import { addUserToProductionMailingList } from '../services/emailService'
import {
  updateCustomerSubscribedStatus
} from '../services/userService'
import { UserLevels, mapUserLevelToWordDifficulty } from '../constants'
import { useLocalStorage, REFERRAL_CODE_KEY } from '../hooks/useLocalStorage'
import mixpanelContext from '../contexts/mixpanelContext'

const PLANS = {
  LEERLY_STARTER: 'leerly-starter',
  LEERLY_PRO: 'leerly-pro'
}
const UI_STATES = {
  BASIC_INFO: 'basic-info',
  DIFFICULTY: 'difficulty',
  DIFFICULTY_2: 'difficulty-2',
  PLAN_INFO: 'plan-info'
}
const DIFFICULTY_DESCRIPTIONS = {
  [UserLevels.A1]: 'You\'re just starting out, and maybe know how to say "Hello", or introduce yourself.',
  [UserLevels.A2]: 'You can understand very basic phrases said to you slowly, and know basic vocabulary for colors, numbers, etc.',
  [UserLevels.B1]: 'You can understand the main points of texts, and can perform basic transactions with native speakers, if they speak slowly and help you.',
  [UserLevels.B2]: 'You can manage to hold a conversation with a native speaker about most topics, with some help and patience.',
  [UserLevels.C1]: 'You can perform basically any transaction or conversation with a native speaker, and can understand basically all written text.',
  [UserLevels.C2]: 'You can understand basically everything you hear and read, and can express yourself effortlessly.'
}

const STARTING = 'starting'
const PICK_MY_LEVEL = 'pick-my-level'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function RegisterPage () {
  const mixpanel = useContext(mixpanelContext)
  const router = useRouter()
  const [savedReferralCode, storeReferralCode] = useLocalStorage(REFERRAL_CODE_KEY, null)
  const referralCode = useMemo(() => router.query.referralCode || savedReferralCode, [router, savedReferralCode])

  const { addToast } = useToasts()
  const [formState, setFormState] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const formIsFilled = useMemo(() => {
    return !!(
      formState.email &&
            formState.name &&
            formState.password &&
            formState.confirmPassword
    )
  }, [formState])

  const [uiState, setUIState] = useState(UI_STATES.BASIC_INFO)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedDifficultyType, setSelectedDifficultyType] = useState(STARTING)
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState(UserLevels.A1)

  useEffect(() => {
    if (mixpanel) {
      const ref = router.query.ref
      mixpanel.trackEvent('register-page-loaded', { ref })
    }
  }, [])

  useEffect(() => {
    if (router.query.referralCode) {
      storeReferralCode(router.query.referralCode)
    }
  }, [router])

  const submitRegistration = async (e) => {
    e.preventDefault()

    const paidPlan = selectedPlan === PLANS.LEERLY_PRO

    try {
      const ref = router.query.ref

      if (!formIsFilled) {
        throw Error('Please fill out all information')
      }

      if (formState.password !== formState.confirmPassword) {
        throw Error('Passwords do not match.')
      }

      setSubmitting(true)

      // Create the user's record, and their profile record on the server.
      const userData = await registerUser(
        formState.email,
        formState.password,
        {
          spanish: selectedDifficultyLevel,
          name: formState.name
        }
      )

      await mixpanel.trackEvent('account-created', { ref })

      if (paidPlan) {
        redirectToStripeCheckout(userData.uid, formState.email, referralCode)
        return
      } else {
        const customerData = await createStripeCustomer(formState.email)
        const customerId = customerData.id

        // Create subscription for new user in Stripe.
        await createStripeSubscription(customerId)

        // Add the Stripe customerId to the user profile (and set subscribed to true)
        await updateCustomerSubscribedStatus(userData.uid, customerId)

        // Put the user onto the production mailing list
        await addUserToProductionMailingList(formState.email)

        addToast('Account created', { appearance: 'success' })
        router.push('/sign-in?registered=true')
      }
    } catch (error) {
      console.error(error)
      addToast(error.message, { appearance: 'error' })
      setUIState(UI_STATES.BASIC_INFO)
      setSubmitting(false)
    }
  }

  const handleFormState = (event) => {
    const newState = {
      ...formState,
      [event.target.name]: event.target.value
    }
    setFormState(newState)
  }

  const handleBasicInfoFormSubmit = () => {
    if (!EMAIL_REGEX.test(formState.email)) {
      addToast('Email is invalid', { appearance: 'error' })
      return
    }

    if (formState.password !== formState.confirmPassword) {
      addToast('Passwords do not match', { appearance: 'error' })
      return
    }

    setUIState(UI_STATES.DIFFICULTY)
  }

  const handleDifficultyTypeSubmit = () => {
    if (selectedDifficultyType === STARTING) {
      setUIState(UI_STATES.PLAN_INFO)
    } else {
      setUIState(UI_STATES.DIFFICULTY_2)
    }
  }

  const handlePlanInfoBack = () => {
    if (selectedDifficultyType === STARTING) {
      setUIState(UI_STATES.DIFFICULTY)
    } else {
      setUIState(UI_STATES.DIFFICULTY_2)
    }
  }

  const selectNewToSpanish = () => {
    setSelectedDifficultyType(STARTING)
    setSelectedDifficultyLevel(UserLevels.A1)
  }

  if (submitting) {
    return <LoadingPage />
  }

  return (
        <>
        <NextSeo
            title="leerly - register"
            description="start reading articles in Spanish"
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
            <RegistrationStep
                selected={uiState === UI_STATES.DIFFICULTY || uiState === UI_STATES.DIFFICULTY_2}>
                    2. Your goals
            </RegistrationStep> -
            <RegistrationStep selected={uiState === UI_STATES.PLAN_INFO}>3. Select a plan</RegistrationStep> -
            <RegistrationStep>4. Billing (paid plans only)</RegistrationStep>
        </ExplanationText>

        {uiState === UI_STATES.BASIC_INFO && (
            <Card>
                <form>
                    <Input type='name' name='name' placeholder='your name' required value={formState.name} onChange={handleFormState}/>
                    <Input type='email' name='email' placeholder='email' value={formState.email} required onChange={handleFormState}/>
                    <Input type='password' name='password' placeholder='password' value={formState.password} required onChange={handleFormState}/>
                    <Input type='password' name='confirmPassword' placeholder='confirm password' value={formState.confirmPassword} required onChange={handleFormState}/>
                    <Button onClick={handleBasicInfoFormSubmit} disabled={!formIsFilled}>Next</Button>
                </form>
            </Card>
        )}

        {uiState === UI_STATES.DIFFICULTY && (
            <div>
                <GreetingWrapper>
                    <Greeting>¡Hola, {formState.name}!</Greeting>
                    <SubGreeting>What are your goals with Spanish?</SubGreeting>
                </GreetingWrapper>

                <DifficultySelectionCards>
                    <DifficultySelectionCard
                        onClick={selectNewToSpanish}
                        selected={selectedDifficultyType === STARTING}
                    >
                        <DifficultyImage style={{ marginBottom: 10 }} src="/images/difficulties/super-beginner.png" />
                        <DifficultySelectionTitle>I'm new to Spanish</DifficultySelectionTitle>
                        <div>I'm starting from the beginning.</div>
                    </DifficultySelectionCard>

                    <DifficultySelectionCard
                        onClick={() => setSelectedDifficultyType(PICK_MY_LEVEL)}
                        selected={selectedDifficultyType === PICK_MY_LEVEL}
                    >
                        <DifficultyImage style={{ marginBottom: 10 }} src="/images/difficulties/advanced.png" />
                        <DifficultySelectionTitle>I'm looking to build my skills</DifficultySelectionTitle>
                        <div>Let me pick my level.</div>
                    </DifficultySelectionCard>
                </DifficultySelectionCards>

                <ButtonRow>
                    <Button secondary onClick={() => setUIState(UI_STATES.BASIC_INFO)}>Back</Button>
                    <Button onClick={handleDifficultyTypeSubmit}>Next</Button>
                </ButtonRow>
            </div>
        )}

        {uiState === UI_STATES.DIFFICULTY_2 && (
            <div>
                <GreetingWrapper>
                    <Greeting>Select your level</Greeting>
                    <SubGreeting>Don't worry, you can change it later.</SubGreeting>
                </GreetingWrapper>

                <DifficultyLevelWrapper>
                    {Object.values(UserLevels).map(level => {
                      const difficultyImage = `/images/difficulties/${mapUserLevelToWordDifficulty(level)}.png`
                      return (
                            <DifficultyLevel
                                onClick={() => setSelectedDifficultyLevel(level)}
                                selected={selectedDifficultyLevel === level}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <DifficultyImage src={difficultyImage} />
                                </div>
                                <div style={{ paddingLeft: 20 }}>
                                    <DifficultyTitle>{mapUserLevelToWordDifficulty(level, true)}</DifficultyTitle>
                                    <DifficultyDescription>{DIFFICULTY_DESCRIPTIONS[level]}</DifficultyDescription>
                                </div>
                            </DifficultyLevel>
                      )
                    })}
                </DifficultyLevelWrapper>

                <ButtonRow>
                    <Button secondary onClick={() => setUIState(UI_STATES.DIFFICULTY)}>Back</Button>
                    <Button onClick={() => setUIState(UI_STATES.PLAN_INFO)}>Next</Button>
                </ButtonRow>
            </div>
        )}

        {uiState === UI_STATES.PLAN_INFO && (
            <PlanSection>
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
                        <HelpText style={{ padding: '0 30px' }}>We will redirect you to Stripe.com to securely handle your payment info.</HelpText>
                    </PlanContainer>
                </Plans>

                <ButtonRow>
                    <Button secondary onClick={handlePlanInfoBack}>Back</Button>
                    <Button onClick={submitRegistration} disabled={!selectedPlan || submitting}>
                        Start learning
                    </Button>
                </ButtonRow>
            </PlanSection>
        )}

        </Container>
        </>
  )
}

export default RegisterPage

const RegistrationStep = styled.span`
    color: ${Colors.MediumGrey};

    ${props => props.selected
? `
        color: ${Colors.Primary};
        font-weight: bold;
    `
: ''}
`
const ExplanationText = styled.div`
    display: none;
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
    font-weight: 200;
    color: ${Colors.MediumGrey};

    span {
        margin: 0 10px;
    }

    @media ${devices.tablet} {
        display: block;
        width: 100%;
    }
`

const PlanSection = styled.div`
    ${Plans} {
        margin: 30px 0;
    }
`

const DifficultySelectionCards = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media ${devices.tablet} {
        flex-direction: row;
    }
`

const DifficultySelectionCard = styled.div`
    padding: 20px 30px;
    border: 1px solid ${props => props.selected ? Colors.Primary : Colors.LightGrey};
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: 0.3s;
    margin-bottom: 30px;

    &:hover {
        transform: scale(1.05);
    }

    @media ${devices.tablet} {
        margin-bottom: 0;

        &:first-child {
            margin-right: 20px;
        }
    }
`

const DifficultySelectionTitle = styled.h4`
    font-weight: 700;
    margin:  0;
`

const GreetingWrapper = styled.div`
    text-align: center;
    margin: 40px 0;
`

const Greeting = styled.h3`
    margin: 0;
`

const SubGreeting = styled.p`
    margin: 0;
`

const ButtonRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 60px;
    margin-top: 30px;
`

const DifficultyLevelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const DifficultyLevel = styled.div`
    display: flex;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid ${props => props.selected ? Colors.Primary : Colors.LightGrey};
    max-width: 500px;
    margin-bottom: 30px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        transform: scale(1.05);
    }
`

const DifficultyImage = styled.img`
    width: 50px;
`

const DifficultyTitle = styled.h3`
    font-weight: 500;
    margin: 0;
`

const DifficultyDescription = styled.p`
    margin: 0;
`
