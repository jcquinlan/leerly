const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const customerId = req.body.customerId;

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {price: process.env.FREE_PRICE},
        ],
      });

      res.statusCode = 200;
      res.json(subscription);
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.error(e);
    }
  }
}
