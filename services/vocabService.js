import { db } from './index'

export const createNewVocab = async ({ userId, spanish, english, sentence }) => {
  return db.collection('vocab_list').add({
    userId,
    spanish,
    english,
    sentence,
    added_at: new Date()
  })
    .then(vocabRef => vocabRef.get())
    .catch(error => {
      throw error
    })
}

export const getAllVocab = (userId) => {
  return db.collection('vocab_list')
    .where('userId', '==', userId)
    .orderBy('added_at', 'desc')
    .get()
    .catch(error => {
      throw error
    })
}

export const deleteVocab = (vocabId) => {
  return db.collection('vocab_list')
    .doc(vocabId)
    .delete()
    .catch(error => {
      throw error
    })
}
