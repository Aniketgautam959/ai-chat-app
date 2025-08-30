# 🔥 Firebase Authentication Setup Guide

This guide will help you set up Firebase authentication for your AI Chat App.

## 📋 Prerequisites

1. **Google Account** - You'll need a Google account to access Firebase Console
2. **Firebase Project** - Create a new Firebase project or use an existing one

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter your project name (e.g., "ai-chat-app")
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:

#### Email/Password Authentication
1. Click on **"Email/Password"**
2. Toggle **"Enable"** to turn it on
3. Click **"Save"**

#### Google Authentication
1. Click on **"Google"**
2. Toggle **"Enable"** to turn it on
3. Add your **Project support email**
4. Click **"Save"**

### 3. Get Firebase Configuration

1. In your Firebase project, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** and choose **"Web"** (</>)
5. Register your app with a nickname (e.g., "ai-chat-app-web")
6. Copy the Firebase configuration object

### 4. Update Configuration

1. Open `src/firebase/config.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domain:
   - For development: `localhost`
   - For production: Your actual domain

### 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try to register a new account
3. Try to sign in with existing credentials
4. Test Google sign-in

## 🔧 Additional Configuration

### Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. Update `src/firebase/config.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 🛠️ Features Included

### Authentication Methods
- ✅ **Email/Password** - Traditional sign up and sign in
- ✅ **Google Sign-in** - One-click authentication with Google
- ✅ **Password Reset** - Email-based password recovery
- ✅ **User Profile** - Display name and email management

### Security Features
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Loading States** - Visual feedback during authentication
- ✅ **Auth State Management** - Automatic session handling
- ✅ **Form Validation** - Client-side validation

### User Experience
- ✅ **Persistent Sessions** - Users stay logged in across browser sessions
- ✅ **Automatic Redirects** - Seamless navigation between auth states
- ✅ **Profile Information** - Display user name and email
- ✅ **Logout Functionality** - Secure sign out with cleanup

## 🚨 Important Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for production
3. **Configure authorized domains** properly
4. **Test all authentication flows** before deployment
5. **Monitor Firebase usage** in the console

## 🔍 Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console

2. **"Firebase: Error (auth/popup-closed-by-user)"**
   - User closed the Google sign-in popup

3. **"Firebase: Error (auth/network-request-failed)"**
   - Check internet connection and Firebase project status

4. **"Firebase: Error (auth/invalid-api-key)"**
   - Verify your API key in the configuration

### Debug Mode

Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug', 'firebase:*');
```

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify your configuration matches the Firebase project
3. Ensure all authentication methods are enabled
4. Check browser console for detailed error messages

---

**Your Firebase authentication is now ready! 🎉**
