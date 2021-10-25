import React, {useState, useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import styled from 'styled-components';
import AppStateContext from '../contexts/appContext';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Input, HelpText, Card, NoticeCard, NoticeCardMain} from '../components/styled';
import {signInUser} from '../services/authService';
import {useRouter} from 'next/router';

function RegisterPage () {
    const router = useRouter();
    const {setLoading} = useContext(AppStateContext);
    const {addToast} = useToasts();
    const [formState, setFormState] = useState({});

    const redirect = router.query.redirect;
    const registered = router.query.registered;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInUser(formState.email, formState.password);
            setLoading(true);
            if (redirect) {
                router.push(redirect);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            addToast(error.message, {appearance: 'error'});
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
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>sign in</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        {registered && (
            <NoticeCard>
                <span>You're account is ready!</span> <br />
                <NoticeCardMain>Sign in to get started</NoticeCardMain>
            </NoticeCard>
        )}

        <Card>
            <HelpText>
                No account yet? <RegisterLink href="/register">Register here.</RegisterLink>
            </HelpText>
            <HelpText>
                Forget your password? <RegisterLink href="/settings/reset-password">Reset it here.</RegisterLink>
            </HelpText>
            <form onSubmit={handleSubmit}>
                <Input type='email' name='email' placeholder='email' onChange={handleFormState}/>
                <Input type='password' name='password' placeholder='password' onChange={handleFormState}/>
                <Button type='submit' disabled={!formState.email || !formState.password}>sign in</Button>
            </form>
        </Card>

        </Container>
        </>
    );
}

export default RegisterPage;

const RegisterLink = styled.a`
    color: #1f4ab8;
    font-size: 14px;
    text-decoration: underline;
`;
