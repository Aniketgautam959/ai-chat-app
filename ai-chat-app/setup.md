# 🔧 Environment Setup Guide

## Quick Setup

1. **Create your `.env` file**
   ```bash
   cp src/env.example .env
   ```

2. **Edit the `.env` file**
   Replace `your_gemini_api_key_here` with your actual API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Start the app**
   ```bash
   npm run dev
   ```

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ API key is not hardcoded in source code
- ✅ Example file shows structure without real key
- ✅ Environment variables are used properly

## Troubleshooting

If you see "No API key found" error:
1. Make sure you created a `.env` file in the root directory
2. Check that the variable name is exactly `VITE_GEMINI_API_KEY`
3. Restart your development server after creating the `.env` file
4. Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
