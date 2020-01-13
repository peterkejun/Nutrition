import firebase from "firebase";

const config = {
    apiKey: "AIzaSyBgIHPqBmY7nYJqBkv_2jI1aTMxUWTo75g",
    authDomain: "nutrition-e0519.firebaseapp.com",
    databaseURL: "https://nutrition-e0519.firebaseio.com",
    projectId: "nutrition-e0519",
    storageBucket: "nutrition-e0519.appspot.com",
    messagingSenderId: "68103152267",
    appId: "1:68103152267:web:6783160d9527c0fdc22a8e",
    measurementId: "G-JJ0458Z4XR",
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database();
export const functions = firebase.functions();
export default firebase;