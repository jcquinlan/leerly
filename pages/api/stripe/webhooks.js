import Cors from 'cors'
import { getRecipientFromEmail, deleteContacts } from '../../../services/sendgridService'
import { adminFirestore, adminAuth } from '../../../services/admin'

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function initMiddleware (middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }

        return resolve(result)
      })
    })
}

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['POST']
  })
)

export default async (req, res) => {
  await cors(req, res)

  if (req.method === 'POST') {
    const event = req.body

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.deleted':
        const customerId = event.data.object.customer

        await adminFirestore
          .collection('user_profiles')
          .where('customerId', '==', customerId)
          .get()
          .then(profileSnapshot => {
            profileSnapshot.forEach(async (profile) => {
              // Step 1 - Delete user profile and user records
              const userId = profile.id
              const user = await adminAuth.getUser(userId)
              const email = user.email

              await profile.ref.delete()
              await adminAuth.deleteUser(userId)

              // Step 2 - Remove the user from the Production SendGrid mailing list
              const recipients = await getRecipientFromEmail(email)
              const contactIds = recipients.map(recip => recip.id)

              if (!contactIds.length) {
                console.log('NO CONTACT IDS TO DELETE')
              } else {
                await deleteContacts(contactIds)
              }
            })
          })
          .catch(err => {
            console.log(err)
            throw err
          })

        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    res.statusCode = 200
    res.json({ received: true })
  }
}
