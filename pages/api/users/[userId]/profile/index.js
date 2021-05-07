import {adminFirestore} from '../../../../../services/admin';

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
        const uid = req.query.userId;
        const customerId = req.body.customerId;

        const doc = await adminFirestore.collection("user_profiles").doc(uid);
        const docData = await doc.get();
    
        if (!docData.data()) {
            throw new Error('Customer record not found.')
        }
    
        doc.set({customerId, subscribed: true}, {merge: true})
            .catch(error => {
                throw error;
            });
        
        res.statusCode = 201;
        res.json({});
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.send(e);
    }
  }
}
