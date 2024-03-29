const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const baseUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
  ? 'http://localhost:3000'
  : 'https://leerly.io'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const id = req.body.id
      const email = req.body.email
      const referralCode = req.body.referralCode

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.MONTHLY_PRICE,
            quantity: 1
          }
        ],
        discounts: [{ coupon: process.env.STRIPE_FREE_MONTH_COUPON_ID }],
        mode: 'subscription',
        customer_email: email,
        success_url: `${baseUrl}/success?id=${id}${referralCode ? `&referralCode=${referralCode}` : ''}&email=${encodeURIComponent(email)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel?id=${id}&email=${encodeURIComponent(email)}`
      })

      res.statusCode = 200
      res.json({ id: session.id })
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.error(e)
    }
  }
}
