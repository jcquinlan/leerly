import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Subtitle} from '../components/styled';
import {updateCustomerSubscribedStatus} from '../services/userService';
import {addUserToProductionMailingList} from '../services/emailService';

function SuccessPage () {
    const router = useRouter()
    const {id, email} = router.query

    useEffect(() => {
        if (id && email) {
            addUserToProductionMailingList(email)
                .then(() => updateCustomerSubscribedStatus(id, true))
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
            <a href="/dashboard">Start reading articles</a>
        </Button>

        </Container>
        </>
    );
}

export default SuccessPage;
