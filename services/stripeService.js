import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_CLIENT_KEY);

export const redirectToStripeCheckout = async (id) => {
    const stripe = await stripePromise;
    const response = await fetch('/api/stripeSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
        sessionId: session.id,
    });

    if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        console.error(result.error);
    }
}