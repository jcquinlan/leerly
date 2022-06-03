import React, { useContext } from 'react'
import { Container, HeroWrapper, HeroContent, Divider, Title, Button, Subtitle } from '../components/styled'
import AppContext from '../contexts/appContext'
import { redirectToStripeCheckout } from '../services/stripeService'

function CancelPage () {
  const { user, userProfile } = useContext(AppContext)

  const addBillingInfo = () => {
    redirectToStripeCheckout(user.uid, userProfile.email)
  }

  return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>registration not completed</Title>
                <Subtitle>Looks like you didn't finish filling out your billing info.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <Button onClick={addBillingInfo}>Add billing info</Button>

        </Container>
        </>
  )
}

export default CancelPage
