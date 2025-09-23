import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtbik2dy1QCYMJsd9laCtiq3n0zBOM_Ho",
  authDomain: "smartschool-99ba9.firebaseapp.com",
  projectId: "smartschool-99ba9",
  storageBucket: "smartschool-99ba9.firebasestorage.app",
  messagingSenderId: "481877206862",
  appId: "1:481877206862:web:71af2971ca6a5b8f0ae01f",
  measurementId: "G-S567PWZ898"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// It's safe to check for window since this is a client-side file.
if (typeof window !== 'undefined') {
  getAnalytics(app);
}


export { app, auth };
