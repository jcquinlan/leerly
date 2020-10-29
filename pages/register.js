import React, {useState, useMemo} from 'react';
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
    const [formState, setFormState] = useState({});
    const formIsFilled = useMemo(() => {
        return !!(formState.name && formState.email && formState.password);
    }, [formState]);

    const handleClick = async () => {
        if (!formIsFilled) {
            throw Error('Please fill out all information');
        }

        try {
            const userDocument = await registerUser(formState.email, formState.password);
            const customerDocumentRef = await createUserProfileDocument({
                email: userDocument.user.email,
                user_uid: userDocument.user.uid,
                name: formState.name
            });
            const customerDocument = await customerDocumentRef.get();
            redirectToStripeCheckout(customerDocument.id);
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
                <Title>register</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <Card>
            <HelpText>
                After submitting your email and password, you'll be redirected to our payment page to provide
                billing information.
            </HelpText>
            <Input type='text' name='name' placeholder='your name' required onChange={handleFormState}/>
            <Input type='email' name='email' placeholder='email' required onChange={handleFormState}/>
            <Input type='password' name='password' placeholder='password' required onChange={handleFormState}/>
            <Button onClick={handleClick} disabled={!formIsFilled}>Continue to Billing</Button>
        </Card>

        </Container>
        </>
    );
}

export default RegisterPage;
