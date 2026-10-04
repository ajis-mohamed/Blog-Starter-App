// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA0X_MLcPPaNk-sfWjvYKGMue4GkQbZfNo",
    authDomain: "blog-d3812.firebaseapp.com",
    projectId: "blog-d3812",
    storageBucket: "blog-d3812.firebasestorage.app",
    messagingSenderId: "621598105211",
    appId: "1:621598105211:web:99f3228c949c36d8198cde",
    measurementId: "G-JLT6Q17QEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;