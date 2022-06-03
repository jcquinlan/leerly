import * as admin from 'firebase-admin'

const initApp = () => {
  return admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    }),
    databaseURL: 'https://leerly.firebaseio.com'
  }, 'admin')
}

const getAppInstance = () => {
  if (admin.apps.length) {
    return admin.apps[0]
  } else {
    return initApp()
  }
}

export const adminClient = getAppInstance()
export const adminFirestore = adminClient.firestore()
export const adminAuth = adminClient.auth()
