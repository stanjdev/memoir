// Firebase
import * as firebase from 'firebase/app';
import "@firebase/auth";
import "firebase/firestore";
// require("firebase/auth");
// require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBdArOtMj7Hy5zB11mdiz3wbEJdt-52moo",
  authDomain: "memoir-mobile.firebaseapp.com",
  databaseURL: "https://memoir-mobile.firebaseio.com",
  projectId: "memoir-mobile",
  storageBucket: "memoir-mobile.appspot.com",
  messagingSenderId: "376333982321",
  appId: "1:376333982321:web:ceae410bb29684919619d0",
  measurementId: "G-TK0153QCB0"
};

export const fireApp = firebase.initializeApp(firebaseConfig);

// export const db = firebase.firestore();