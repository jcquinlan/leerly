import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Container, HeroWrapper, HeroContent, Divider, Title, Button, Input } from '../../components/styled'
import { auth } from '../../services'

function ResetPasswordPage () {
  const { addToast } = useToasts()
  const [formState, setFormState] = useState({})

  const sendResetEmail = (e) => {
    e.preventDefault()

    auth.sendPasswordResetEmail(formState.email).then(function () {
      // Email sent.
      addToast('Email sent.', { appearance: 'success' })
      setFormState({})
    }).catch(function (error) {
      // An error happened.
      console.error(error)
      addToast(error.message, { appearance: 'error' })
    })
  }

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
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

        <form onSubmit={sendResetEmail}>
            <Input name='email' type='email' placeholder='account email' onChange={handleInputChange}/>
            <Button type='submit' disabled={!formState.email}>Send password reset email</Button>
        </form>

        </Container>
        </>
  )
}

export default ResetPasswordPage
