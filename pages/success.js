import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Subtitle} from '../components/styled';
import {updateCustomerSubscribedStatus} from '../services/userService';

function SuccessPage () {
    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        if (id) {
            updateCustomerSubscribedStatus(id, true)
                .catch(err => console.error(err));
        }
    }, [id]);

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>¡Felicitaciones!</Title>
                <Subtitle>You're all signed up. Check your email in a few minutes for your first articles.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <Button>
            <a href="/">Start reading articles</a>
        </Button>

        </Container>
        </>
    );
}

export default SuccessPage;
