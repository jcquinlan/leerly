import {db} from './index';

export const createNewVocab = async ({userId, spanish, english, sentence}) => {
    return db.collection("vocab_list").add({
        userId,
        spanish,
        english,
        sentence,
        added_at: new Date(),
    })
    .then(vocabRef => vocabRef.get())
    .catch(error => {
        throw error;
    });
}

export const getAllVocab = (userId) => {
    return db.collection("vocab_list")
        .where('userId', '==', userId)
        .orderBy('added_at', 'desc')
        .get()
        .catch(error => {
            throw error;
        });
}

// export const deleteArticleReadStatus = (readStatusId) => {
//     return db.collection("read_statuses")
//         .doc(readStatusId)
//         .delete()
//         .catch(error => {
//             throw error;
//         });
// }

