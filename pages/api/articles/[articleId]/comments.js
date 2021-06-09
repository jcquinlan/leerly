import {adminFirestore} from '../../../../services/admin';

export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            const articleId = req.query.articleId;

            const commentsRef = await adminFirestore
                .collection('article_comments')
                .where('articleId', '==', articleId)
                .get();
            
            const comments = commentsRef.docs.map(doc => {
                const data =  doc.data();

                return {
                    ...data,
                    id: doc.id,
                    text: data.reported ?
                        'This comment has been reported' :
                        data.deleted_at ?
                            'This comment has been deleted' :
                            data.text
                }
            })
            .sort((a, b) => {
                return a.created_at._seconds - b.created_at._seconds;
            });

            res.statusCode = 200;
            res.json({comments});
        } catch (error) {
            res.statusCode = 500;
            res.json({ error });
        }
    }

    if (req.method === 'POST') {
        try {
            const articleId = req.query.articleId;
            const payload = req.body;

            // Create the new comment
            const commentRef = await adminFirestore
                .collection('article_comments')
                .add({
                    ...payload,
                    type: 'basic',
                    articleId,
                    created_at: new Date(),
                    deleted_at: null,
                    reported: false,
                    replyTo: null
                })
                .then(commentRef => commentRef.get());
            
            const articleRef = await adminFirestore
                .collection('articles')
                .doc(articleId)
                .get();

            const articleData = articleRef.data();
            const currentCommentCount = articleData.commentCount || 0;

            // Update the comment count for that article
            await adminFirestore
                .collection('articles')
                .doc(articleId)
                .set({commentCount: currentCommentCount + 1}, {merge: true});

            const comment = commentRef.data();
            
            res.statusCode = 201;
            res.json({comment});
        } catch (error) {
            res.statusCode = 500;
            res.json({ error });
        }
    }
}
