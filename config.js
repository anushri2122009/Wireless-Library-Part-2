import firebase from 'firebase';

require ('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyDPj5a63wfePIHzvBKUR25JV-nNVVTKfP0",
    authDomain: "project-37-cc95f.firebaseapp.com",
    databaseURL: "https://project-37-cc95f-default-rtdb.firebaseio.com",
    projectId: "project-37-cc95f",
    storageBucket: "project-37-cc95f.appspot.com",
    messagingSenderId: "300579169812",
    appId: "1:300579169812:web:f201c3f8670bf323dc6901"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();