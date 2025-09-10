# 🤖 AI Chat App

A modern AI-powered chat application built with **React** and integrated with **Google Gemini API**.  
The app features a sleek dark UI, authentication system, and smooth interactions to provide a seamless AI chat experience.

---

## ✨ Features

- 🎨 **Modern UI**
  - Dark theme with gradient backgrounds
  - Glassmorphism effects with backdrop blur
  - Smooth animations & hover effects
  - Responsive design for all devices

- 🔐 **Authentication**
  - Email/password login & registration
  - Form validation
  - Demo credentials for quick access

- 💬 **AI Chat**
  - Powered by Google Gemini API
  - Real-time responses
  - Clean conversation layout

---

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS  
- **AI API**: Google Gemini API  
- **Authentication**: Firebase Auth (or custom backend if added)  
- **State Management**: React hooks / Context API  

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Aniketgautam959/ai-chat-app.git
   cd ai-chat-app
Install dependencies

```bash
Copy code
npm install
Set up environment variables
Create a .env file in the project root and add:
```
env
Copy code
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
Run the app
```

```bash
Copy code
npm run dev
```
📂 Project Structure
csharp
Copy code
ai-chat-app/
│── public/            # Static assets
│── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Tailwind/global styles
│   ├── App.jsx        # Main App
│   └── main.jsx       # Entry point
│── package.json
│── README.md
