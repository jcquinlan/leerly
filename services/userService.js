import {db} from './index';

export const createUserProfileDocument = async ({email, user_uid}) => {
    return db.collection("user_profiles").doc(user_uid).set({
        email,
        active: true,
        subscribed: false
    })
    .catch(error => {
        throw error;
    });
}

export const updateCustomerSubscribedStatus = async (id, attributes) => {
    const doc = await db.collection("user_profiles").doc(id)
    const docData = await doc.get();

    if (!docData.data()) {
        throw new Error('Customer record not found.')
    }

    doc.set(attributes, {merge: true})
        .catch(error => {
            throw error;
        });
}

export const getUserProfile = async (uid) => {
    return db.collection('user_profiles').doc(uid).get();
}

export const getUserClaims = async (uid) => {
    return db.collection('user_claims').doc(uid).get();
}
