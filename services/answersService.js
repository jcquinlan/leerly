import {db} from './index';

export const createNewAnswersWithIdToken = async (idToken, {
    articleId,
    isPublic,
    answers,
}) => {
    const payload = {
        isPublic,
        answers
    };

    return fetch(`/api/articles/${articleId}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-leerly-token': idToken
        },
        body: JSON.stringify(payload)
    });
}

export const getArticleAnswersWithIdToken = (idToken, articleId) => {
    return fetch(`/api/articles/${articleId}/answers`, {
            headers: {
                'x-leerly-token': idToken
            }
        })
        .then(res => res.json());
}

export const reportAnswer = (answerId) => {
    return fetch(`/api/comments/${answerId}/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

