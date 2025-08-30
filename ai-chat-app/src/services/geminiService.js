import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key format
if (!API_KEY) {
  console.error('❌ No API key found. Please create a .env file with VITE_GEMINI_API_KEY=your_api_key');
  console.error('Get your API key from: https://makersuite.google.com/app/apikey');
} else if (API_KEY.length < 30) {
  console.error('❌ Invalid API key format. API key should be at least 30 characters long.');
} else {
  console.log('✅ API key loaded successfully:', API_KEY.substring(0, 10) + '...');
}

// Initialize the API client
let genAI;
let model;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
  });
  console.log('✅ Gemini API client initialized successfully with gemini-1.5-flash model');
} catch (error) {
  console.error('❌ Failed to initialize Gemini API client:', error);
  // Try with gemini-pro as fallback
  try {
    model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
    });
    console.log('✅ Gemini API client initialized successfully with gemini-pro model');
  } catch (fallbackError) {
    console.error('❌ Failed to initialize with both models:', fallbackError);
  }
}

// Chat history to maintain conversation context
let chatHistory = [];

// Simple API key validation
const validateAPIKey = async () => {
  try {
    if (!model) {
      return { valid: false, error: 'Model not initialized' };
    }
    
    const testResult = await model.generateContent('test');
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const geminiService = {
  // Initialize a new chat session
  async startChat() {
    try {
      console.log('Starting new chat session...');
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });
      console.log('Chat session started successfully');
      return chat;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw new Error(`Failed to start chat session: ${error.message}`);
    }
  },

  // Send a message and get response
  async sendMessage(message, chatSession = null) {
    try {
      console.log('Sending message:', message);
      
      if (!model) {
        throw new Error('Model not initialized. Please check your API key configuration.');
      }
      
      // Use generateContent directly for better reliability
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      console.log('Received response:', text.substring(0, 100) + '...');

      // Add to chat history for context
      chatHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });
      chatHistory.push({
        role: 'model',
        parts: [{ text: text }]
      });

      return {
        success: true,
        response: text,
        chat: null // We're not using chat sessions anymore
      };
    } catch (error) {
      console.error('Error sending message:', error);
      
      // More specific error handling
      let errorMessage = 'I apologize, but I encountered an error processing your request. Please try again.';
      
      if (error.message.includes('API_KEY') || error.message.includes('key') || error.message.includes('authentication')) {
        errorMessage = 'API key error. Please check your Gemini API configuration.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('model') || error.message.includes('not initialized')) {
        errorMessage = 'Model error. Please try again.';
      } else if (error.message.includes('safety')) {
        errorMessage = 'Content blocked by safety filters. Please rephrase your question.';
      }
      
      // If all else fails, provide a helpful fallback response
      if (!errorMessage.includes('API key') && !errorMessage.includes('quota')) {
        errorMessage = 'I apologize, but I\'m having trouble connecting to my services right now. Please try again in a moment, or check your internet connection.';
      }
      
      return {
        success: false,
        error: error.message,
        response: errorMessage
      };
    }
  },

  // Get chat history
  getChatHistory() {
    return chatHistory;
  },

  // Clear chat history
  clearChatHistory() {
    chatHistory = [];
    console.log('Chat history cleared');
  },

  // Generate a response for a single message (without chat context)
  async generateResponse(prompt) {
    try {
      console.log('Generating response for:', prompt.substring(0, 50) + '...');
      
      if (!model) {
        throw new Error('Model not initialized');
      }
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Generated response:', text.substring(0, 100) + '...');
      
      return {
        success: true,
        response: text
      };
    } catch (error) {
      console.error('Error generating response:', error);
      
      let errorMessage = 'I apologize, but I encountered an error. Please try again.';
      
      if (error.message.includes('API_KEY') || error.message.includes('key')) {
        errorMessage = 'API key error. Please check your Gemini API configuration.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('model')) {
        errorMessage = 'Model error. Please try again.';
      }
      
      return {
        success: false,
        error: error.message,
        response: errorMessage
      };
    }
  },

  // Test API connection
  async testConnection() {
    try {
      console.log('🧪 Testing API connection with key:', API_KEY.substring(0, 10) + '...');
      
      // First validate the API key
      const validation = await validateAPIKey();
      if (!validation.valid) {
        console.error('❌ API key validation failed:', validation.error);
        return false;
      }
      
      const result = await this.generateResponse('Hello, this is a test message.');
      if (result.success) {
        console.log('✅ API connection test successful!');
        console.log('Sample response:', result.response.substring(0, 100) + '...');
      } else {
        console.log('❌ API connection test failed:', result.error);
      }
      return result.success;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      return false;
    }
  }
};

export default geminiService;
