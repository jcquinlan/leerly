const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

export const getRecipientFromEmail = async (email) => {
        const request = {
            method: 'POST',
            url: `/v3/marketing/contacts/search`,
            body: {
                query: `email LIKE '${email}' AND CONTAINS(list_ids, 'f4c9c87b-0f59-4248-bf18-c3c553441e27')`
            }
        };

        const [response, body] = await client.request(request)

        if (response.statusCode !== 200) {
            throw new Error(`Failed to search for recipients in list f4c9c87b-0f59-4248-bf18-c3c553441e27`)
        }

        return body.result;
}

export const deleteContacts = async (contactIds) => {
    try {
        const request = {
            method: 'DELETE',
            url: `/v3/marketing/contacts?ids=${contactIds.join(',')}`,
        };

        const [response, body] = await client.request(request)
        console.log(response, body);
    } catch (e) {
        console.log(e);
    }
}