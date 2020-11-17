import Cors from 'cors';
import * as admin from 'firebase-admin';
import {getRecipientFromEmail, deleteContacts} from '../../../services/sendgridService';

let adminClient;
let adminFirestore;
let adminAuth;

adminClient = adminClient || admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.FIREBASE_ADMIN_TYPE,
        "project_id": process.env.FIREBASE_ADMIN_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_ADMIN_AUTH_URI,
        "token_uri": process.env.FIREBASE_ADMIN_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    }),
    databaseURL: 'https://leerly.firebaseio.com'
});

adminFirestore = adminFirestore || adminClient.firestore();
adminAuth = adminAuth || adminClient.auth();

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function initMiddleware(middleware) {
    return (req, res) =>
        new Promise((resolve, reject) => {
                middleware(req, res, (result) => {
                    if (result instanceof Error) {
                        return reject(result);
                    }

                    return resolve(result);
            });
        });
}

const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['POST']
    })
);

export default async (req, res) => {
    await cors(req, res);

    if (req.method === 'POST') {
        const event = req.body

        // Handle the event
        switch (event.type) {
            case 'customer.subscription.deleted':
                const customerId = event.data.object.customer;

                await adminFirestore
                    .collection('user_profiles')
                    .where('customerId', '==', customerId)
                    .get()
                    .then(profileSnapshot => {
                        profileSnapshot.forEach(async (profile) => {
                            // Step 1 - Delete user profile and user records
                            const userId = profile.id;
                            const user = await adminAuth.getUser(userId);
                            const email = user.email;

                            await profile.ref.delete()
                            await adminAuth.deleteUser(userId);

                            // Step 2 - Remove the user from the Production SendGrid mailing list
                            const recipients = await getRecipientFromEmail(email);
                            const contactIds = recipients.map(recip => recip.id);
                            await deleteContacts(contactIds);
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });

                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
      
        // Return a response to acknowledge receipt of the event
        res.statusCode = 200;
        res.json({received: true});
    }
}
