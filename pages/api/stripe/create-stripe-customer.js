const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const email = req.body.email

      const customer = await stripe.customers.create({
        email
      })

      res.statusCode = 200
      res.json(customer)
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.error(e)
    }
  }
}
