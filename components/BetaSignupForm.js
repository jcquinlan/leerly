import React, {useState} from 'react';
import styled from 'styled-components';
import {Input, Button} from './styled';
import { addUserToMailingList } from '../services/emailService';

const BetaSignupForm = () => {
    const [email, setEmail] = useState('');
    const [submittedState, setSubmittedState] = useState({loading: false, attempted: false, submitted: false});
    const handleFormSubmit = () => {
        if (email) {
            setSubmittedState(state => ({...state, loading: true}));
            addUserToMailingList(email)
                .then(() => setSubmittedState(state => ({...state, submitted: true, loading: false})))
                .catch(() => setSubmittedState(state => ({...state, loading: false})));
        } else {
            setSubmittedState(state => ({...state, attempted: true}));
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const subtitle = submittedState.attempted ?
        <Warning>You need to provide a valid email.</Warning> :
        'We\'ll email you when we launch, sometime in November.';

    return (
        <SignupWrapper>
            {submittedState.submitted ? (
                <h4>Thank you, we'll reach out once we're ready for you!</h4>
            ) : (
                <>
                    <h3>Stay in the loop.</h3>
                    <p>{subtitle}</p>
                    <Input type='email' placeholder='email' value={email} onChange={handleEmailChange}></Input>
                    <Button disabled={submittedState.loading} onClick={handleFormSubmit}>Email me when you launch</Button>
                </>
            )}
        </SignupWrapper>
    )
}

const Warning = styled.span`
    color: red;
`;
const SignupWrapper = styled.div`
    margin: 80px 0 60px 0;
    min-width: 500px;

    h3 {
        margin: 0px;
    }

    p {
        margin-top: 0px;
    }
`;

export default BetaSignupForm;