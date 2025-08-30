import { useState, useRef, useEffect } from 'react'
import { Trash2, Send, Sparkles, MessageSquare, User, LogOut, Menu, X } from 'lucide-react'
import Login from './Login'
import Register from './Register'
import geminiService from './services/geminiService'
import authService from './firebase/auth'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState(null)
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (user) {
      // Initialize chat session when user logs in
      geminiService.startChat().then(session => {
        setChatSession(session)
      })
    }
  }, [user])

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User signed in' : 'User signed out')
      if (firebaseUser) {
        // User is signed in
        const userData = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          uid: firebaseUser.uid
        }
        console.log('Setting user data:', userData)
        setUser(userData)
      } else {
        // User is signed out
        console.log('Clearing user data')
        setUser(null)
        // Reset app state when user logs out
        setMessages([])
        setRecentSearches([])
        setChatSession(null)
        setInputValue('')
        setIsLoading(false)
        setShowRegister(false)
        setShowMobileMenu(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      content: inputValue,
      type: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setRecentSearches(prev => [inputValue, ...prev.filter(s => s !== inputValue)].slice(0, 5))
    setInputValue('')
    setIsLoading(true)

    try {
      console.log('Calling geminiService.sendMessage with:', inputValue);
      const result = await geminiService.sendMessage(inputValue)
      console.log('Received result from geminiService:', result);
      
      if (result.success) {
        const aiMessage = {
          id: Date.now() + 1,
          content: result.response,
          type: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }
        console.log('Adding AI message to chat:', aiMessage);
        setMessages(prev => [...prev, aiMessage])
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          content: result.response || 'Sorry, I encountered an error. Please try again.',
          type: 'ai',
          isError: true,
          timestamp: new Date().toLocaleTimeString()
        }
        console.log('Adding error message to chat:', errorMessage);
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        type: 'ai',
        isError: true,
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRecentSearchClick = (search) => {
    setInputValue(search)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  const clearChatHistory = () => {
    setMessages([])
    geminiService.clearChatHistory()
  }

  const handleLogout = () => {
    authService.signOut()
  }

  if (!user) {
    return showRegister ? <Register onBackToLogin={() => setShowRegister(false)} /> : <Login onShowRegister={() => setShowRegister(true)} />
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Mobile menu overlay */}
        {showMobileMenu && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowMobileMenu(false)}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-5 h-screen">
          {/* Left Sidebar */}
          <div className={`${showMobileMenu ? 'block' : 'hidden'} lg:block lg:col-span-1 glass border-r border-gray-700/50 p-4 lg:p-6 absolute lg:relative inset-0 z-40 lg:z-auto`}>
            <div className="flex items-center gap-3 mb-8 hover-lift">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                AI Chat
              </h1>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300">Recent Searches</h2>
                <button
                  onClick={clearRecentSearches}
                  className="p-1 hover:bg-gray-700/50 rounded-md transition-colors"
                  title="Clear all searches"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>

              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group hover-lift"
                    onClick={() => {
                      handleRecentSearchClick(search)
                      setShowMobileMenu(false)
                    }}
                  >
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                      {search}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-700/50 space-y-2">
                <button 
                  onClick={() => {
                    clearChatHistory()
                    setShowMobileMenu(false)
                  }}
                  className="flex items-center gap-3 w-full p-3 text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Clear Chat</span>
                </button>
                <button 
                  onClick={async () => {
                    console.log('Testing API connection...')
                    try {
                      const result = await geminiService.testConnection()
                      console.log('API test result:', result)
                      if (result) {
                        alert('API connection successful! You can now send messages.')
                      } else {
                        alert('API connection failed. Check console for details.')
                      }
                    } catch (error) {
                      console.error('Test connection error:', error)
                      alert('API test failed: ' + error.message)
                    }
                    setShowMobileMenu(false)
                  }}
                  className="flex items-center gap-3 w-full p-3 text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-lg transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Test API</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-4 flex flex-col">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 lg:gap-4">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                  >
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg lg:text-2xl font-bold gradient-text truncate">
                      Hello {user.name}, Ask me Anything
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm lg:text-base">Your AI assistant is ready to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 ml-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[70%] p-3 lg:p-4 rounded-2xl hover-lift ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : message.isError
                        ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                        : 'glass text-gray-100'
                    }`}
                  >
                    <p className="text-sm lg:text-base">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start message-enter">
                  <div className="max-w-[85%] lg:max-w-[70%] p-3 lg:p-4 rounded-2xl glass text-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">This may take a few seconds...</p>
                  </div>
                </div>
              )}
              
              {/* Scroll to bottom reference */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 lg:p-6 border-t border-gray-700/50">
              <div className="flex items-end gap-3 lg:gap-4 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="w-full p-3 lg:p-4 pr-12 glass border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 input-focus text-sm lg:text-base"
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-3 bottom-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  </div>
                  {inputValue.length > 0 && (
                    <div className="absolute right-3 top-3">
                      <span className="text-xs text-gray-500">
                        {inputValue.length}/4000
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-3 lg:p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-2xl transition-all duration-200 btn-animate"
                >
                  <Send className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
