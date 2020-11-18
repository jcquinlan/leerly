import React, {useState, useMemo} from 'react';
import {useToasts} from 'react-toast-notifications';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button,
    Input,
    Card,
    HelpText
} from '../components/styled';
import {redirectToStripeCheckout} from '../services/stripeService';
import {registerUser} from '../services/authService';
import {createUserProfileDocument} from '../services/userService';

function RegisterPage () {
    const {addToast} = useToasts();
    const [formState, setFormState] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const formIsFilled = useMemo(() => {
        return !!(formState.name && formState.email && formState.password && formState.confirmPassword);
    }, [formState]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (!formIsFilled) {
                throw Error('Please fill out all information');
            }

            if (formState.password !== formState.confirmPassword) {
                throw Error('Passwords do not match.');
            }

            const userDocument = await registerUser(formState.email, formState.password);
            await createUserProfileDocument({
                email: userDocument.user.email,
                user_uid: userDocument.user.uid,
                name: formState.name
            });
            redirectToStripeCheckout(userDocument.user.uid, userDocument.user.email);
        } catch (error) {
            console.error(error);
            addToast(error.message, {appearance: 'error'})
        }

        setSubmitting(false);
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
                <Title>register</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <Card>
            <HelpText>
                After submitting your email and password, you'll be redirected to our payment page to provide
                billing information.
            </HelpText>

            <form onSubmit={handleSubmit}>
                <Input type='text' name='name' placeholder='your name' required onChange={handleFormState}/>
                <Input type='email' name='email' placeholder='email' required onChange={handleFormState}/>
                <Input type='password' name='password' placeholder='password' required onChange={handleFormState}/>
                <Input type='password' name='confirmPassword' placeholder='confirm password' required onChange={handleFormState}/>
                <Button type='submit' disabled={!formIsFilled || submitting}>Continue to Billing</Button>
            </form>
        </Card>

        </Container>
        </>
    );
}

export default RegisterPage;
