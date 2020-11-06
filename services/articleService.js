import {db} from './index';

export const ArticleTypes = {
    'business': 'Business',
    'art': 'Art',
    'technology': 'Technology',
    'nature': 'Nature',
    'science': 'Science',
    'opinion': 'Opinion',
    'fiction': 'Fiction',
    'religion': 'Religion',
    'politics': 'Politics',
    'self-help': 'Self Help'
};
export const ArticleTypeList = Object.keys(ArticleTypes).map(key => {
    return {
        type: key,
        display: ArticleTypes[key]
    }
});

export const createNewArticle = async ({body, title, url, types, added_by}) => {
    return db.collection("articles").add({
        body,
        url,
        types,
        title,
        sent: false,
        added_by,
        added_at: new Date(),
    })
    .then(articleRef => articleRef.get())
    .catch(error => {
        throw error;
    });
}

export const getArticle = (articleId) => {
    return db.collection("articles")
        .doc(articleId)
        .get()
        .catch(error => {
            throw error;
        });
}

export const getArticles = () => {
    return db.collection("articles")
        .orderBy('added_at', 'desc')
        .limit(50)
        .get()
        .catch(error => {
            throw error;
        });
}