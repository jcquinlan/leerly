import React from 'react';
import {useRouter} from 'next/router';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button} from '../../components/styled';
import {auth} from '../../services';

function ResetPasswordPage () {
    const router = useRouter();
    const sendResetEmail = () => {
        auth.sendPasswordResetEmail('jcquinlan.dev@gmail.com').then(function() {
            // Email sent.
            console.log('EMAIL SENT')
          }).catch(function(error) {
            // An error happened.
            console.error(error);
          });
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>reset password</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <Button onClick={sendResetEmail}>Send Reset Email</Button>

        </Container>
        </>
    );
}

export default ResetPasswordPage;
