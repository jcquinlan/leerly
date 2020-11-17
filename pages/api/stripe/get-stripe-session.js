const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
    if (req.method === 'POST') {
      try {
        const sessionId = req.body.sessionId;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.statusCode = 200;
        res.json(session);
      } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.error(e);
      }
    }
  }