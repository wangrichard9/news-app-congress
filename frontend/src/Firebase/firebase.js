// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiJXdT8nWD-IaWPow8nkCo0iti1ZH2D3k",
  authDomain: "newapp-13563.firebaseapp.com",
  projectId: "newapp-13563",
  storageBucket: "newapp-13563.firebasestorage.app",
  messagingSenderId: "1044935710699",
  appId: "1:1044935710699:web:5f9cef2acd98b8bbc8abae",
  measurementId: "G-H32XQ0HV8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);