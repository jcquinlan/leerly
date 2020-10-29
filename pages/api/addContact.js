const client = require('@sendgrid/client');
const baseUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ?
  'http://localhost:3000' :
  'https://leerly.io';

client.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
        const email = req.body.email;

        const request = {
            method: 'PUT',
            url: '/v3/marketing/contacts',
            body: {
                list_ids: ['f4c9c87b-0f59-4248-bf18-c3c553441e27'],
                contacts: [{email}]
            }
        };

        const [response, body] = await client.request(request)

        res.statusCode = 200;
        res.json({});
    } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.error(e);
    }
  }
}
