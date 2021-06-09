import {db} from './index';

export const createNewComment = async ({
    userId,
    articleId,
    text,
    userData,
    articleData
}) => {
    const payload = {
        userId,
        text,
        userData,
        articleData 
    };

    return fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

export const getArticleComments = (articleId) => {
    return fetch(`/api/articles/${articleId}/comments`)
        .then(res => res.json());
}

export const deleteComment = (commentId) => {
    return db.collection("article_comments")
        .doc(commentId)
        .set({deleted_at: new Date()}, {merge: true})
        .catch(error => {
            throw error;
        });
}

export const reportComment = (commentId) => {
    return fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

