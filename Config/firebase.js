import * as firebase from "firebase";
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDyt8Aqqaa97VCXLTx9oYUzMl_JlaImFcA",
  authDomain: "where-is-it-v1.firebaseapp.com",
  databaseURL: "https://where-is-it-v1-default-rtdb.firebaseio.com",
  projectId: "where-is-it-v1",
  storageBucket: "where-is-it-v1.appspot.com",
  messagingSenderId: "879190187480",
  appId: "1:879190187480:web:33f6079ccc2bd9f9d6e6ad"
};


let app;

if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app()
}


const auth = firebase.auth();
const database = firebase.firestore();


export {
  auth,
  database
};
