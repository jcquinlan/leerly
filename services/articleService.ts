import { db, storage } from './index';

export const ArticleTypes = {
  business: 'Business',
  art: 'Art',
  technology: 'Technology',
  nature: 'Nature',
  science: 'Science',
  opinion: 'Opinion',
  fiction: 'Fiction',
  religion: 'Religion',
  politics: 'Politics',
  'self-help': 'Self Help',
  culture: 'Culture',
  history: 'History',
  'latin-america': 'Latin America',
  spain: 'Spain'
};
export const ArticleTypeList = Object.keys(ArticleTypes).map(key => {
  return {
    type: key,
    display: ArticleTypes[key]
  };
});

export const createNewArticle = async (articleAttrs) => {
  return db.collection('articles').add({
    ...articleAttrs,
    sent: false,
    added_at: new Date()
  })
    .then(articleRef => articleRef.get())
    .catch(error => {
      throw error;
    });
};

export const getFreeArticles = (filters) => {
  let query = db.collection('articles')
    .where('published', '==', true)
    .where('free', '==', true);

  if (filters.length) {
    query = query.where('types', 'array-contains-any', filters);
  }

  return query
    .orderBy('added_at', 'desc')
    .get()
    .catch(error => {
      throw error;
    });
};

export const getDemoArticles = () => {
  return db.collection('articles')
    .orderBy('added_at', 'desc')
    .where('demo', '==', true)
    .limit(100)
    .get()
    .catch(error => {
      throw error;
    });
};

export const getUnpublishedArticles = () => {
  return db.collection('articles')
    .orderBy('added_at', 'desc')
    .where('published', '==', false)
    .get()
    .catch(error => {
      throw error;
    });
};

export const getArticles = (idToken, filters, query) => {
  const params = [];

  if (filters.length) {
    params.push(`filters=${filters.join(',')}`);
  }

  if (query) {
    params.push(`query=${query}`);
  }

  const paramsString = params.join('&');

  return fetch(`/api/articles?${paramsString}`, {
    headers: {
      'x-leerly-token': idToken
    }
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const getArticle = (idToken, articleId) => {
  return fetch(`/api/articles/${articleId}`, {
    headers: {
      'x-leerly-token': idToken
    }
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const getRecommendedArticles = (idToken, articleId) => {
  return fetch(`/api/articles/${articleId}/recommended`, {
    headers: {
      'x-leerly-token': idToken
    }
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const patchArticle = (idToken, articleId, content) => {
  return fetch(`/api/articles/${articleId}`, {
    headers: {
      'x-leerly-token': idToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content),
    method: 'PATCH'
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const saveArticle = (idToken, content) => {
  return fetch('/api/articles', {
    headers: {
      'x-leerly-token': idToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content),
    method: 'POST'
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const getUserMetrics = (userId) => {
  return db.collection('activity_metrics')
    .doc(userId)
    .get()
    .catch(error => {
      throw error;
    });
};

export const updateUserListeningTimeActivityMetric = async (userId, newTime) => {
  // Sanity check to make sure we never accidentally somehow delete someone's
  // listening time metric.
  if (!newTime) return;

  return db.collection('activity_metrics')
    .doc(userId)
    .set({
      time_listening: newTime
    }, { merge: true })
    .catch(error => {
      throw error;
    });
};

export const updateUserCardsStudiedActivityMetric = async (userId, newCount) => {
  // Sanity check to make sure we never accidentally somehow delete someone's
  // listening time metric.
  if (!newCount) return;

  return db.collection('activity_metrics')
    .doc(userId)
    .set({
      cards_studied: newCount
    }, { merge: true })
    .catch(error => {
      throw error;
    });
};

export const getArticleReadStatus = (userId, articleId) => {
  return db.collection('read_statuses')
    .where('userId', '==', userId)
    .where('articleId', '==', articleId)
    .limit(1)
    .get()
    .catch(error => {
      throw error;
    });
};

export const getArticleReadStatuses = (userId) => {
  return db.collection('read_statuses')
    .where('userId', '==', userId)
    .get()
    .catch(error => {
      throw error;
    });
};

export const createArticleReadStatus = (userId, articleId) => {
  return db.collection('read_statuses')
    .add({
      articleId,
      userId,
      readAt: new Date()
    })
    .catch(error => {
      throw error;
    });
};

export const deleteArticleReadStatus = (readStatusId) => {
  return db.collection('read_statuses')
    .doc(readStatusId)
    .delete()
    .catch(error => {
      throw error;
    });
};

export const getArticleAudioURL = (fileName) => {
  const storageRef = storage.ref();
  return storageRef.child(fileName).getDownloadURL();
};

export const uploadAudio = (file) => {
  const storageRef = storage.ref().child(`audios/${file.name}`);
  return storageRef.put(file);
};
