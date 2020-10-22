import {auth} from './index';

export const registerUser = async (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            throw error;
        });
};

export const signInUser = async (email, password) => {
    return auth.signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            console.error(error);
        });
};