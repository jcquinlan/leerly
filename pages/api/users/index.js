import { adminFirestore, adminAuth } from '../../../services/admin'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const email = req.body.email
      const password = req.body.password
      const profileInfo = req.body.profileInfo

      if (!(email && password && profileInfo.name && profileInfo.spanish)) {
        res.statusCode = 400
        res.json({ error: 'Missing registration data' })
        return
      }

      const userRecord = await adminAuth
        .createUser({
          email,
          password
        })

      // Create the user's profile as soon as their account is created.
      await adminFirestore.collection('user_profiles').doc(userRecord.uid).set({
        email,
        name: profileInfo.name,
        levels: {
          spanish: profileInfo.spanish
        },
        active: true,
        subscribed: false
      })

      res.statusCode = 200
      res.json({ uid: userRecord.uid })
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.send(e)
    }
  }
}
