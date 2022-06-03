const client = require('@sendgrid/client')
client.setApiKey(process.env.SENDGRID_API_KEY)

export const getRecipientFromEmail = async (email) => {
  const request = {
    method: 'POST',
    url: '/v3/marketing/contacts/search',
    body: {
      query: `email LIKE '${email}' AND CONTAINS(list_ids, '${process.env.MAILING_LIST_ID}')`
    }
  }

  const [response, body] = await client.request(request)

  if (response.statusCode !== 200) {
    throw new Error(`Failed to search for recipients in list ${process.env.MAILING_LIST_ID}`)
  }

  return body.result
}

export const deleteContacts = async (contactIds) => {
  console.log('CONTACT IDS TO DELETE: ', contactIds)

  try {
    const request = {
      method: 'DELETE',
      url: `/v3/marketing/contacts?ids=${contactIds.join(',')}`
    }

    await client.request(request)
  } catch (e) {
    console.log(e)
  }
}
