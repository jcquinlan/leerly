import {adminFirestore, adminAuth} from '../../../services/admin';

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userRecord = await adminAuth
            .createUser({
                email,
                password
            });
        
        // Create the user's profile as soon as their account is created.
        await adminFirestore.collection("user_profiles").doc(userRecord.uid).set({
            email,
            active: true,
            subscribed: false
        });
        
        res.statusCode = 200;
        res.json({uid: userRecord.uid});
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.send(e);
    }
  }
}
