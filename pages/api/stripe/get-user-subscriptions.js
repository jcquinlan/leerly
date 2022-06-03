const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const customerId = req.query.customerId

      const subscriptionsRequest = await stripe.subscriptions.list({
        customer: customerId
      })

      res.statusCode = 200
      res.json(subscriptionsRequest.data)
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.error(e)
    }
  }
}
