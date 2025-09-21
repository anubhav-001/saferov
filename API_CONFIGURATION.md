# API Configuration Guide

To fully utilize all features of SafeRove, you need to configure the following API keys:

## 1. Weather API (OpenWeatherMap)
- **Purpose**: Real-time weather data for locations
- **Get API Key**: https://openweathermap.org/api
- **Free Tier**: 1,000 calls/day
- **Environment Variable**: `VITE_WEATHER_API_KEY`

## 2. Gemini AI API (Google)
- **Purpose**: Chatbot functionality and AI responses
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Free Tier**: 15 requests/minute
- **Environment Variable**: `VITE_GEMINI_API_KEY`

## 3. Backend API
- **Purpose**: ML models, translation, emergency processing
- **Default URL**: `http://localhost:8000`
- **Environment Variable**: `VITE_API_URL`

## Setup Instructions

1. Create a `.env` file in the root directory
2. Add the following variables:

```env
# Weather API Configuration
VITE_WEATHER_API_KEY=your_actual_openweather_api_key

# Gemini AI API Configuration  
VITE_GEMINI_API_KEY=your_actual_gemini_api_key

# Backend API Configuration
VITE_API_URL=http://localhost:8000

# Development Mode
NODE_ENV=development
```

3. Restart the development server after adding the keys

## Features That Require API Keys

### Without Weather API Key:
- Weather information will show "API key not configured" message
- Map weather overlay will be disabled

### Without Gemini API Key:
- Chatbot will fallback to backend API
- If backend is unavailable, chatbot responses will be limited

### Without Backend API:
- ML models will use mock data
- Translation features will use fallback languages
- Emergency SOS will work locally but won't reach backend services

## Testing API Keys

1. **Weather API**: Check the map component for weather data
2. **Gemini API**: Try asking the chatbot a question
3. **Backend API**: Check browser console for connection status

All features will work with mock data if APIs are not configured, but for full functionality, please configure the API keys.




