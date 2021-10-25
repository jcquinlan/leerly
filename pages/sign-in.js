import React, {useState, useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import styled from 'styled-components';
import AppStateContext from '../contexts/appContext';
import {Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    ButtonWithLoading,
    Input,
    HelpText,
    Card
} from '../components/styled';
import {signInUser} from '../services/authService';
import {useRouter} from 'next/router';

function RegisterPage () {
    const router = useRouter();
    const {setLoading: setLoadingUserData} = useContext(AppStateContext);
    const {addToast} = useToasts();
    const [formState, setFormState] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const redirect = router.query.redirect;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            await signInUser(formState.email, formState.password);
            setLoadingUserData(true);
            if (redirect) {
                router.push(redirect);
            } else {
                router.push('/dashboard');
            }
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            addToast(error.message, {appearance: 'error'});
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
            <HelpText>
                Forget your password? <RegisterLink href="/settings/reset-password">Reset it here.</RegisterLink>
            </HelpText>
            <form onSubmit={handleSubmit}>
                <Input type='email' name='email' placeholder='email' onChange={handleFormState}/>
                <Input type='password' name='password' placeholder='password' onChange={handleFormState}/>
                <ButtonWithLoading type='submit' disabled={!formState.email || !formState.password || submitting} loading={submitting}>
                    sign in
                </ButtonWithLoading>
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
