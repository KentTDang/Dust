// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore directly

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg48k9qpJXWTyIXMk8nnE_KmFrgK9BBUs",
  authDomain: "hophacks2024-80069.firebaseapp.com",
  projectId: "hophacks2024-80069",
  storageBucket: "hophacks2024-80069.appspot.com",
  messagingSenderId: "764593228603",
  appId: "1:764593228603:web:7d2d0c6249dbd768ba451e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Initialize Firestore correctly