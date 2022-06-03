import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_CLIENT_KEY)

export const createStripeCustomer = async (email) => {
  const response = await fetch('/api/stripe/create-stripe-customer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })

  const customer = await response.json()
  return customer
}

// TODO - we only use this endpoint when creating a free account,
// so we always knows the price/product we want to use, so that is
// hardcoded into the backend. We should refactor this to eventually
// handle different potential prices/products.
export const createStripeSubscription = async (customerId) => {
  const response = await fetch('/api/stripe/create-stripe-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ customerId })
  })

  const subscription = await response.json()
  return subscription
}

export const redirectToStripeCheckout = async (id, email, referralCode) => {
  const stripe = await stripePromise
  const response = await fetch('/api/stripe/create-stripe-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, email, referralCode })
  })

  const session = await response.json()

  const result = await stripe.redirectToCheckout({
    sessionId: session.id
  })

  if (result.error) {
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `result.error.message`.
    console.error(result.error)
  }
}

export const getStripeSession = async (sessionId) => {
  const response = await fetch('/api/stripe/get-stripe-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sessionId })
  })

  const session = await response.json()

  return session
}

export const getBillingURL = async (customerId) => {
  const response = await fetch('/api/stripe/create-portal-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ customerId })
  })

  const session = await response.json()

  return session
}
