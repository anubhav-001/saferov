# Translation Guide

This guide explains how to use the translation functionality in the SafeTravel application.

## Features

- Transliteration of text from English to various Indian languages
- Support for multiple Indian languages
- Easy-to-use React hooks and components
- Server-side translation API

## Setup

1. Make sure you have the required dependencies installed:
   ```bash
   pip install ai4bharat-transliteration
   ```

2. The translation service is automatically set up when you start the backend server.

## Available Languages

The following languages are supported:

- Hindi (hi)
- Bengali (bn)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Marathi (mr)
- Gujarati (gu)
- Punjabi (pa)
- Odia (or)
- Assamese (as)

## Frontend Usage

### Using the Translation Hook

```typescript
import { useTranslationContext } from '@/components/TranslationProvider';

function MyComponent() {
  const { t, currentLang, setLanguage, languages } = useTranslationContext();
  
  // Translating text
  const [translatedText, setTranslatedText] = useState('');
  
  useEffect(() => {
    const translate = async () => {
      const result = await t('Hello World');
      setTranslatedText(result);
    };
    translate();
  }, [t]);
  
  return (
    <div>
      <p>{translatedText}</p>
      <select 
        value={currentLang} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Using the TranslatedText Component

```typescript
import { TranslatedText } from '@/components/TranslatedText';

function MyComponent() {
  return (
    <div>
      <h1><TranslatedText>Welcome to SafeTravel</TranslatedText></h1>
      <p><TranslatedText>Your safety is our priority</TranslatedText></p>
    </div>
  );
}
```

### Using the Language Switcher

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function Navbar() {
  return (
    <nav>
      {/* Your navigation items */}
      <div className="ml-auto">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
```

## Backend API Endpoints

### Get Supported Languages

```
GET /api/translation/languages
```

Response:
```json
{
  "status": "success",
  "languages": {
    "hi": "Hindi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "or": "Odia",
    "as": "Assamese"
  }
}
```

### Transliterate a Word

```
GET /api/translation/transliterate/word?text=hello&target_lang=hi
```

Response:
```json
{
  "status": "success",
  "data": {
    "original_text": "hello",
    "transliterated_text": "हेलो"
  }
}
```

### Transliterate a Sentence

```
GET /api/translation/transliterate/sentence?text=hello world&target_lang=hi
```

Response:
```json
{
  "status": "success",
  "data": {
    "original_text": "hello world",
    "transliterated_text": "हेलो वर्ल्ड"
  }
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in the following format:

```json
{
  "detail": "Error message here"
}
```

## Notes

- The translation service uses AI4Bharat's transliteration models
- The first request to a new language may take a moment as the model loads
- For production use, consider adding rate limiting and caching

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
