import {auth} from './index';

export const registerUser = async (email, password, profileInfo) => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, profileInfo})
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
};

export const signInUser = async (email, password) => {
    return auth.signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            throw error;
        });
};

export const signOutUser = async () => {
    return auth.signOut()
        .catch(function(error) {
            // An error happened.
            console.error(error);
        });
}
