import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKPPFDvvwUzgWNrRtBuL_QXgVp3JWIacg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-chat-app-e42a2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-chat-app-e42a2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-chat-app-e42a2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "295152958258",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:295152958258:web:3bb1b240c6dc0068e0b52b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0GY3X6Q57N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
