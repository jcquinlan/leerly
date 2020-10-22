const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const baseUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ?
  'http://localhost:3000' :
  'https://leerly.io';

const price = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ?
  'price_1He9kjAeNWZT3wuvbwWbJuHC' :
  'prod_price';


export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const id = req.body.id;
      console.log(req.body);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/success?id=${id}`,
        cancel_url: `${baseUrl}/cancel`,
      });

      res.statusCode = 200;
      res.json({id: session.id});
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.error(e);
    }
  }
}
