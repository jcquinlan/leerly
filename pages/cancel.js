import React, {useContext} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button,
    Subtitle,
    NarrowContainer,
    Colors
} from '../components/styled';
import AppContext from '../contexts/appContext';
import {redirectToStripeCheckout} from '../services/stripeService';

function CancelPage () {
    const {user, userProfile} = useContext(AppContext);

    const addBillingInfo = () => {
        redirectToStripeCheckout(user.uid, userProfile.email);
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>your trial is over</Title>
                <Subtitle>But you can access everything again by becoming a paid subscriber.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <NarrowContainer width="400px" textAlign="center">
            <p>It's <Primary>$5/month</Primary> for access to hundreds of articles, hours of slow audio, translations, vocab words, and more.</p>
            <Button onClick={addBillingInfo}>Upgrade account</Button>
        </NarrowContainer>

        </Container>
        </>
    );
}

export default CancelPage;

const Primary = styled.span`
    color: ${Colors.Primary};
`;
