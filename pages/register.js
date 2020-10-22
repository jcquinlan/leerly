import React, {useState} from 'react';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button} from '../components/styled';
import {redirectToStripeCheckout} from '../services/stripeService';
import {registerUser} from '../services/authService';
import {createCustomerDocument} from '../services/userService';

function RegisterPage () {
    const [formState, setFormState] = useState({});
    const handleClick = async () => {
        try {
            const userDocument = await registerUser(formState.email, formState.password);
            const customerDocumentRef = await createCustomerDocument({email: userDocument.user.email, user_uid: userDocument.user.uid});
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

        <input type='email' name='email' placeholder='email' onChange={handleFormState}/>
        <input type='password' name='password' placeholder='password' onChange={handleFormState}/>
        <Button onClick={handleClick}>Register</Button>

        </Container>
        </>
    );
}

export default RegisterPage;
