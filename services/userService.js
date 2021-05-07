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

export const updateCustomerSubscribedStatus = async (uid, customerId) => {
    try {
        const response = await fetch(`/api/users/${uid}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({customerId})
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        const userData = await response.json();
        return userData;
    } catch (e) {
        throw e;
    }
}

export const getUserProfile = async (uid) => {
    return db.collection('user_profiles').doc(uid).get();
}

export const getUserClaims = async (uid) => {
    return db.collection('user_claims').doc(uid).get();
}

export const getUserPlans = async (customerId) => {
    if (!customerId) {
        console.error('Missing customerId');
        return;
    }

    return fetch(`/api/stripe/get-user-subscriptions?customerId=${customerId}`)
        .then(res => res.json());
}
