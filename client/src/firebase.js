// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8ee33.firebaseapp.com",
  projectId: "mern-estate-8ee33",
  storageBucket: "mern-estate-8ee33.appspot.com",
  messagingSenderId: "533474448686",
  appId: "1:533474448686:web:df908462ceef5fcf7896bf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
