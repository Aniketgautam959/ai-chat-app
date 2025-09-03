import { useState, useRef, useEffect } from 'react'
import { Trash2, Send, Sparkles, MessageSquare, User, LogOut, Menu, X, Compass, Lightbulb, MessageCircle, Code, Copy, Check } from 'lucide-react'
import Login from './Login'
import Register from './Register'
import geminiService from './services/geminiService'
import authService from './firebase/auth'
import './App.css'

// Utility function to format Gemini response with headings and bullet points
const formatGeminiResponse = (text) => {
  if (!text) return '';
  
  // Split the text into lines
  const lines = text.split('\n');
  const formattedLines = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check for main headings (single asterisk)
    if (trimmedLine.startsWith('* ') && trimmedLine.endsWith('*')) {
      const headingText = trimmedLine.slice(2, -1); // Remove * and *
      formattedLines.push(`<h2 class="text-lg font-bold text-white mb-3 mt-4 first:mt-0">${headingText}</h2>`);
    }
    // Check for sub-headings (double asterisk)
    else if (trimmedLine.startsWith('** ') && trimmedLine.endsWith('**')) {
      const headingText = trimmedLine.slice(3, -2); // Remove ** and **
      formattedLines.push(`<h3 class="text-xl font-bold text-white mb-3 mt-4">${headingText}</h3>`);
    }
    // Check for bullet points (single asterisk at start)
    else if (trimmedLine.startsWith('* ') && !trimmedLine.endsWith('*')) {
      const bulletText = trimmedLine.slice(2); // Remove *
      
      // Check if the bullet point contains sub-headings (text wrapped in **)
      const formattedBulletText = bulletText.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="text-white font-bold text-base">$1</span>'
      );
      
      formattedLines.push(`<li class="text-sm text-gray-300 mb-1 ml-4">${formattedBulletText}</li>`);
    }
    // Check for sub-bullet points (double asterisk at start)
    else if (trimmedLine.startsWith('** ') && !trimmedLine.endsWith('**')) {
      const bulletText = trimmedLine.slice(3); // Remove **
      formattedLines.push(`<li class="text-xs text-gray-400 mb-1 ml-8">${bulletText}</li>`);
    }
    // Regular text
    else if (trimmedLine) {
      formattedLines.push(`<p class="text-sm text-gray-300 mb-2">${trimmedLine}</p>`);
    }
    // Empty lines
    else {
      formattedLines.push('<br>');
    }
  });
  
  // Wrap bullet points in ul tags
  let formattedText = formattedLines.join('');
  
  // Replace consecutive li tags with ul wrapper
  formattedText = formattedText.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    (match) => `<ul class="list-disc list-inside mb-3">${match}</ul>`
  );
  
  return formattedText;
};

function App() {
  const [inputValue, setInputValue] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState(null)
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [copiedMessages, setCopiedMessages] = useState(new Set())
  const messagesEndRef = useRef(null)

  // Suggestion cards data
  const suggestions = [
    {
      id: 1,
      text: "Suggest beautiful places to see on an upcoming road trip",
      icon: Compass,
      category: "travel"
    },
    {
      id: 2,
      text: "Briefly summarize this concept: urban planning",
      icon: Lightbulb,
      category: "learning"
    },
    {
      id: 3,
      text: "Brainstorm team bonding activities for our work retreat",
      icon: MessageCircle,
      category: "business"
    },
    {
      id: 4,
      text: "Improve the readability of the following code",
      icon: Code,
      category: "coding"
    }
  ]

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
        setShowSuggestions(true)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSendMessage = async (message = null) => {
    const messageToSend = message || inputValue
    if (!messageToSend.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      content: messageToSend,
      type: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setRecentSearches(prev => [messageToSend, ...prev.filter(s => s !== messageToSend)].slice(0, 5))
    setInputValue('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      console.log('Calling geminiService.sendMessage with:', messageToSend);
      const result = await geminiService.sendMessage(messageToSend)
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

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion.text)
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
    setShowSuggestions(true)
    geminiService.clearChatHistory()
  }

  const handleLogout = () => {
    authService.signOut()
  }

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessages(prev => new Set([...prev, messageId]))
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessages(prev => {
          const newSet = new Set(prev)
          newSet.delete(messageId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-5 h-screen overflow-hidden">
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
          <div className="col-span-1 lg:col-span-4 flex flex-col overflow-hidden">
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
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 flex flex-col items-center min-h-0 max-h-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-enter w-full max-w-4xl`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[70%] p-3 lg:p-4 rounded-2xl hover-lift group ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : message.isError
                        ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                        : 'glass text-gray-100'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <p className="text-sm lg:text-base">{message.content}</p>
                    ) : (
                      <div className="relative">
                        <div 
                          className="text-sm lg:text-base formatted-response"
                          dangerouslySetInnerHTML={{ 
                            __html: formatGeminiResponse(message.content) 
                          }}
                        />
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Copy response"
                        >
                          {copiedMessages.has(message.id) ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start message-enter w-full max-w-4xl">
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

              {/* Suggestion Cards - Show only when no messages and not loading */}
              {showSuggestions && messages.length === 0 && !isLoading && (
                <div className="space-y-4 sm:space-y-6 flex flex-col items-center justify-center py-4 sm:py-8">
                  <div className="text-center">
                    <h2 className="text-xl lg:text-2xl font-bold gradient-text mb-2">
                      How can I help you today?
                    </h2>
                    <p className="text-gray-400 text-sm lg:text-base">
                      Choose a suggestion or type your own question
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-5xl mx-auto w-full px-2 sm:px-4">
                    {suggestions.map((suggestion) => {
                      const IconComponent = suggestion.icon
                      return (
                        <div
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="suggestion-card relative p-3 sm:p-4 lg:p-6 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group hover-lift border border-gray-600/30 hover:border-purple-500/50"
                        >
                          <p className="text-sm lg:text-base text-gray-200 group-hover:text-white transition-colors mb-4 leading-relaxed">
                            {suggestion.text}
                          </p>
                          <div className="absolute bottom-3 right-3">
                            <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Scroll to bottom reference */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 lg:p-6 border-t border-gray-700/50">
              <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
                <div className="flex items-end gap-2 sm:gap-3 lg:gap-4 w-full">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="w-full p-3 lg:p-4 pr-12 glass border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 input-focus text-base"
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
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="p-3 lg:p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-2xl transition-all duration-200 btn-animate min-h-[44px]"
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
      </div>
    </>
  )
}

export default App
