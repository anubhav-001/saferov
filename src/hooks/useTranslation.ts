import { useState, useEffect, useCallback, useMemo } from 'react';
import { translationService } from '@/lib/translation';

// Cache for translations to avoid redundant API calls
const translationCache = new Map<string, string>();

// Default languages if API fails
const DEFAULT_LANGUAGES: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  pa: 'ਪੰਜਾਬੀ',
  or: 'ଓଡ଼ିଆ',
  as: 'অসমীয়া',
};

export interface TranslationContextType {
  t: (text: string) => Promise<string>;
  translate: (text: string) => Promise<string>;
  currentLang: string;
  setLanguage: (lang: string) => void;
  languages: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

export const useTranslation = (initialLang = 'en') => {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [languages, setLanguages] = useState<Record<string, string>>(DEFAULT_LANGUAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load supported languages on mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        const langs = await translationService.getSupportedLanguages();
        setLanguages(prev => (Object.keys(langs).length > 0 ? langs : prev));
        setError(null);
      } catch (err) {
        console.error('Failed to load languages:', err);
        setError('Failed to load translation languages. Using default languages.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguages();
  }, []);

  // Memoize the translation function to prevent unnecessary re-renders
  const t = useCallback(async (text: string): Promise<string> => {
    if (!text?.trim()) return text;
    
    const cacheKey = `${currentLang}:${text}`;
    
    // Return from cache if available
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey) || text;
    }
    
    try {
      // For very short texts (likely single words), use word transliteration
      const isWord = text.split(/\s+/).length === 1;
      let result;
      
      if (isWord) {
        result = await translationService.transliterateWord(text, currentLang);
      } else {
        // For sentences, try to translate each word and combine
        const words = text.split(/(\s+)/);
        const translatedWords = await Promise.all(
          words.map(async (word) => {
            if (!word.trim()) return word;
            const wordCacheKey = `${currentLang}:${word}`;
            
            if (translationCache.has(wordCacheKey)) {
              return translationCache.get(wordCacheKey) || word;
            }
            
            try {
              const wordResult = await translationService.transliterateWord(word, currentLang);
              const translated = wordResult?.transliterated_text || word;
              translationCache.set(wordCacheKey, translated);
              return translated;
            } catch (e) {
              return word;
            }
          })
        );
        
        return translatedWords.join('');
      }
      
      const translatedText = result?.transliterated_text || text;
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    } catch (err) {
      console.error('Translation error:', err);
      return text; // Return original text on error
    }
  }, [currentLang]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    t,
    translate: t, // Alias for t
    currentLang,
    setLanguage: (lang: string) => {
      if (lang !== currentLang) {
        setCurrentLang(lang);
        // Optionally save to localStorage for persistence
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('preferredLanguage', lang);
          } catch (e) {
            console.warn('Failed to save language preference:', e);
          }
        }
      }
    },
    languages,
    isLoading,
    error,
  }), [t, currentLang, languages, isLoading, error]);

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
          setCurrentLang(savedLang);
        }
      } catch (e) {
        console.warn('Failed to load language preference:', e);
      }
    }
  }, []);

  return contextValue;
};

export default useTranslation;
