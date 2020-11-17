const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
        const email = req.body.email;

        const request = {
            method: 'PUT',
            url: '/v3/marketing/contacts',
            body: {
                list_ids: ['e678bbe3-ac53-4c62-8769-64e26d5c6ecf'],
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
