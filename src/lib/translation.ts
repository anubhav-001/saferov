const rawBase = import.meta.env.VITE_API_URL as string | undefined;
const API_BASE_URL = (rawBase || 'http://localhost:8000').replace(/^\"|\"$/g, '').trim();

const FALLBACK_LANGUAGES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
};

// Helper function to handle API requests
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000); // Increased timeout to 5 seconds
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Only log errors in development mode to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      console.warn('[translation] API request error or timeout:', error);
    }
    throw error;
  }
}

interface TranslationResult {
  original_text: string;
  transliterated_text: string;
}

interface TranslationResponse {
  status: string;
  data: TranslationResult;
}

interface LanguageListResponse {
  status: string;
  languages: Record<string, string>;
}

export const translationService = {
  /**
   * Get list of supported languages
   */
  async getSupportedLanguages(): Promise<Record<string, string>> {
    try {
      const data = await apiRequest<LanguageListResponse>(
        `${API_BASE_URL}/api/translation/languages`
      );
      return data.languages || {};
    } catch (error) {
      console.warn('[translation] Backend unavailable, using fallback languages');
      return FALLBACK_LANGUAGES;
    }
  },

  /**
   * Transliterate a single word
   */
  async transliterateWord(
    text: string,
    targetLang: string = 'hi'
  ): Promise<TranslationResult | null> {
    if (!text.trim()) return null;

    try {
      const params = new URLSearchParams({
        text,
        lang: targetLang,
      });
      
      const url = `${API_BASE_URL}/api/translation/transliterate/word?${params}`;
      const data = await apiRequest<TranslationResponse>(url);
      return data.data;
    } catch (error) {
      console.warn('[translation] Fallback transliteration (echo)');
      return { original_text: text, transliterated_text: text };
    }
  },

  /**
   * Transliterate a sentence
   */
  async transliterateSentence(
    text: string,
    targetLang: string = 'hi'
  ): Promise<TranslationResult | null> {
    if (!text.trim()) return null;

    try {
      const params = new URLSearchParams({
        text,
        lang: targetLang,
      });
      
      const url = `${API_BASE_URL}/api/translation/transliterate/sentence?${params}`;
      const data = await apiRequest<TranslationResponse>(url);
      return data.data;
    } catch (error) {
      console.warn('[translation] Fallback transliteration (echo)');
      return { original_text: text, transliterated_text: text };
    }
  },

  /**
   * Get language name from code
   */
  getLanguageName(
    code: string,
    languages: Record<string, string>
  ): string {
    return languages[code] || code;
  },
};
