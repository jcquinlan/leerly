import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDfMnJxVcaJpEeob3W0M0hUlFkJaeXTkkI",
    authDomain: "leerly.firebaseapp.com",
    databaseURL: "https://leerly.firebaseio.com",
    projectId: "leerly",
    storageBucket: "leerly.appspot.com",
    messagingSenderId: "873625576355",
    appId: "1:873625576355:web:29e2a925b982aeff0d3016"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
