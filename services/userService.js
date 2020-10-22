import {db} from './index';

export const createCustomerDocument = async ({email, user_uid}) => {
    return db.collection("customer_records").add({
        email,
        user_uid,
        active: true,
        subscribed: false
    })
    .catch(error => {
        throw error;
    });
}

export const updateCustomerSubscribedStatus = async (id, subscribed) => {
    const doc = await db.collection("customer_records").doc(id)
    const docData = await doc.get();

    if (!docData.data()) {
        throw new Error('Customer record not found.')
    }

    doc.set({subscribed: true}, {merge: true})
        .catch(error => {
            throw error;
        });
}