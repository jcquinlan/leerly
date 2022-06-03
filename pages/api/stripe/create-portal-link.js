const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const baseUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
  ? 'http://localhost:3000'
  : 'https://leerly.io'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const customerId = req.body.customerId

      const portalsession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/settings`
      })

      res.statusCode = 200
      res.json({
        url: portalsession.url
      })
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.error(e)
    }
  }
}
