import {db} from './index';

export const createNewAnswers = async ({
    articleId,
    publish,
    allAnswers,
}) => {
    const payload = {
        isPublic: publish,
        answers: allAnswers
    };

    return fetch(`/api/articles/${articleId}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

export const getArticleAnswers = (articleId) => {
    return fetch(`/api/articles/${articleId}/answers`)
        .then(res => res.json());
}

export const deleteAnswer = (answerId) => {
    return db.collection("article_answers")
        .doc(answerId)
        .set({deleted_at: new Date()}, {merge: true})
        .catch(error => {
            throw error;
        });
}

export const reportAnswer = (answerId) => {
    return fetch(`/api/comments/${answerId}/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

