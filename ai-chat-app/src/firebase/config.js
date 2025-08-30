import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyCKPPFDvvwUzgWNrRtBuL_QXgVp3JWIacg",
  authDomain: "ai-chat-app-e42a2.firebaseapp.com",
  projectId: "ai-chat-app-e42a2",
  storageBucket: "ai-chat-app-e42a2.firebasestorage.app",
  messagingSenderId: "295152958258",
  appId: "1:295152958258:web:3bb1b240c6dc0068e0b52b",
  measurementId: "G-0GY3X6Q57N"
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
