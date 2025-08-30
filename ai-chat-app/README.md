# 🤖 AI Chat App with Gemini API

A modern, beautiful AI chat application built with React, featuring Google's Gemini AI integration, authentication system, and a stunning dark theme design.

## ✨ Features

### 🎨 **Modern Design**
- **Dark theme** with gradient backgrounds
- **Glass morphism effects** with backdrop blur
- **Smooth animations** and hover effects
- **Responsive design** for all devices
- **Custom scrollbars** with gradient styling

### 🔐 **Authentication System**
- **Login page** with email/password authentication
- **Registration page** with form validation
- **Demo credentials** for easy testing
- **Session management** and logout functionality
- **Password visibility toggle**

### 🤖 **AI Chat Features**
- **Google Gemini AI integration** for intelligent responses
- **Real-time chat** with message history
- **Loading indicators** with animated dots
- **Error handling** with user-friendly messages
- **Auto-scroll** to latest messages
- **Character counter** for input validation

### 📱 **User Experience**
- **Recent searches** sidebar with clickable history
- **Clear chat functionality**
- **Keyboard shortcuts** (Enter to send, Shift+Enter for new line)
- **Message timestamps**
- **Responsive layout** with mobile optimization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   **⚠️ Important**: Never commit your `.env` file to version control. It's already added to `.gitignore`.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Configuration

### Gemini API Setup

1. **Get your API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

2. **API Key Security**
   - Never commit your API key to version control
   - Use environment variables for production
   - Keep your API key private and secure
   - Rotate your API key regularly
   - Monitor your API usage to avoid unexpected charges

## 🎯 Usage

### Authentication
- **Demo Login**: Use `demo@example.com` / `password`
- **Registration**: Create a new account with email and password
- **Logout**: Click the logout icon in the header

### Chat Interface
- **Send Messages**: Type your question and press Enter or click Send
- **Recent Searches**: Click on previous searches to reuse them
- **Clear Chat**: Use the "Clear Chat" button in the sidebar
- **Character Limit**: Input is limited to 4000 characters

### Features
- **Real AI Responses**: Powered by Google Gemini Pro model
- **Conversation Context**: Maintains chat history for better responses
- **Error Handling**: Graceful error messages for API issues
- **Loading States**: Visual feedback during AI processing

## 🛠️ Technical Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### AI Integration
- **Google Generative AI** - Official Gemini API client
- **Gemini Pro Model** - Advanced language model
- **Chat Sessions** - Maintained conversation context

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
ai-chat-app/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page component
│   │   └── Register.jsx       # Registration page component
│   ├── services/
│   │   └── geminiService.js  # Gemini API integration
│   ├── App.jsx               # Main application component
│   ├── App.css               # Custom styles and animations
│   └── main.jsx              # Application entry point
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple to Pink gradients (`#8b5cf6` to `#ec4899`)
- **Background**: Dark grays (`#111827` to `#000000`)
- **Text**: White and light grays
- **Accents**: Blue for info, Red for errors

### Typography
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable sans-serif
- **Code**: Monospace for technical content

### Animations
- **Hover Effects**: Smooth lift and scale transitions
- **Loading**: Pulsing dots and shimmer effects
- **Page Transitions**: Slide and fade animations

## 🔧 Configuration

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### API Settings
- **Model**: `gemini-pro`
- **Max Tokens**: 2048
- **Temperature**: 0.7
- **Chat History**: Maintained per session

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Static site hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google AI** for the Gemini API
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Lucide** for the beautiful icons

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ using React and Google Gemini AI**
