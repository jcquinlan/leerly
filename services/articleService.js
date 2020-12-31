import {db, storage} from './index';

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
    'self-help': 'Self Help',
    'culture': 'Culture',
    'history': 'History',
    'latin-america': 'Latin America',
    'spain': 'Spain',
};
export const ArticleTypeList = Object.keys(ArticleTypes).map(key => {
    return {
        type: key,
        display: ArticleTypes[key]
    }
});

export const createNewArticle = async (articleAttrs) => {
    return db.collection("articles").add({
        ...articleAttrs,
        sent: false,
        added_at: new Date(),
    })
    .then(articleRef => articleRef.get())
    .catch(error => {
        throw error;
    });
}

export const updateArticle = async (id, content) => {
    return db.collection("articles").doc(id).set(content, {merge: true})
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

export const getFreeArticles = () => {
    return db.collection("articles")
        .orderBy('added_at', 'desc')
        .where('free', '==', true)
        .limit(50)
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

export const getUserListeningTime = (userId) => {
    return db.collection("listening_metrics")
        .doc(userId)
        .get()
        .catch(error => {
            throw error;
        });
}

export const updateUserListeningTime = async (userId, newTime) => {
    // Sanity check to make sure we never accidentally somehow delete someone's
    // listening time metric.
    if (!newTime) return;

    return db.collection("listening_metrics")
        .doc(userId)
        .set({
            value: newTime
        })
        .catch(error => {
            throw error;
        });
}

export const getArticleReadStatus = (userId, articleId) => {
    return db.collection("read_statuses")
        .where('userId', '==', userId)
        .where('articleId', '==', articleId)
        .limit(1)
        .get()
        .catch(error => {
            throw error;
        });
}

export const getArticleReadStatuses = (userId) => {
    return db.collection("read_statuses")
        .where('userId', '==', userId)
        .get()
        .catch(error => {
            throw error;
        });
}

export const createArticleReadStatus = (userId, articleId) => {
    return db.collection("read_statuses")
        .add({
            articleId,
            userId,
            readAt: new Date()
        })
        .catch(error => {
            throw error;
        });
}

export const deleteArticleReadStatus = (readStatusId) => {
    return db.collection("read_statuses")
        .doc(readStatusId)
        .delete()
        .catch(error => {
            throw error;
        });
}

export const getArticleAudioURL = (fileName) => {
    const storageRef = storage.ref();
    return storageRef.child(fileName).getDownloadURL();
}

export const uploadAudio = (file) => {
    const storageRef = storage.ref().child(`audios/${file.name}`);
    return storageRef.put(file);
}
