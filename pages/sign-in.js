import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import AppStateContext from '../contexts/appContext';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Input, HelpText, Card} from '../components/styled';
import {signInUser} from '../services/authService';
import {useRouter} from 'next/router';

function RegisterPage () {
    const router = useRouter();
    const {setUser} = useContext(AppStateContext);
    const [formState, setFormState] = useState({});
    const handleClick = async () => {
        try {
            const response = await signInUser(formState.email, formState.password);
            setUser(response.user);
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
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

        <Card>
            <HelpText>
                No account yet? <RegisterLink href="/register">Register here.</RegisterLink>
            </HelpText>
            <Input type='email' name='email' placeholder='email' onChange={handleFormState}/>
            <Input type='password' name='password' placeholder='password' onChange={handleFormState}/>
            <Button onClick={handleClick}>sign in</Button>
        </Card>

        </Container>
        </>
    );
}

export default RegisterPage;

const RegisterLink = styled.a `
    color: #1f4ab8;
    font-size: 14px;
    text-decoration: underline;
`;
