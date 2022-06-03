import { adminFirestore } from '../../../../services/admin'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const commentId = req.query.commentId

      await adminFirestore
        .collection('article_comments')
        .doc(commentId)
        .set({ reported: true }, { merge: true })

      res.statusCode = 201
      res.json({})
    } catch (error) {
      res.statusCode = 500
      res.json({ error: 'Comment could not be reported' })
    }
  }
}
