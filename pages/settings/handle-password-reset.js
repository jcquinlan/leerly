import React, {useState} from 'react';
import {useToasts} from 'react-toast-notifications';
import {useRouter} from 'next/router';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button, Input} from '../../components/styled';
import {auth} from '../../services';

function HandlePasswordResetPage () {
    const router = useRouter();
    const {addToast} = useToasts();
    const [formState, setFormState] = useState({});
    const actionCode = router.query.oobCode;
    const actionMode = router.query.mode;
    const passwordsMatch = formState.password === formState.confirmPassword;

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (actionMode === 'resetPassword') {
            auth.verifyPasswordResetCode(actionCode)
                .then(() => {
                   if (!passwordsMatch) {
                       throw Error('Passwords do not match.');
                   } 

                   return auth.confirmPasswordReset(actionCode, formState.password)
                })
                .then(() => {
                    addToast('Password reset', {appearance: 'success'});
                    router.push('/sign-in');
                })
                .catch((error) => {
                    addToast(error.message, {appearance: 'error'});
                });
        }
    };

    const handleInputChange = (e) => {
        setFormState({...formState, [e.target.name]: e.target.value});
    };

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>reset password</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <form onSubmit={handlePasswordReset}>
            <Input name='password' type='password' placeholder='new password' onChange={handleInputChange}/>
            <Input name='confirmPassword' type='password' placeholder='confirm new password' onChange={handleInputChange}/>
            <Button type='submit' disabled={!(formState.password && formState.confirmPassword)}>Reset password</Button>
        </form>

        </Container>
        </>
    );
}

export default HandlePasswordResetPage;
