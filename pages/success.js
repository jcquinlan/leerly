import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Subtitle} from '../components/styled';
import {updateCustomerSubscribedStatus} from '../services/userService';
import {addUserToProductionMailingList} from '../services/emailService';
import {getStripeSession} from '../services/stripeService';

function SuccessPage () {
    const router = useRouter()
    const {id, email, session_id} = router.query

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
