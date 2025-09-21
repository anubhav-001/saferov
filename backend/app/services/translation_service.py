from fastapi import HTTPException
from typing import Dict, List
import re

# Try to import ai4bharat transliteration engine; fallback to simple rules if unavailable
try:
    from ai4bharat.transliteration import XlitEngine  # type: ignore
    _xlit_available = True
except Exception:
    XlitEngine = None  # type: ignore
    _xlit_available = False

class TranslationService:
    def __init__(self):
        # Simple mapping of common words to Hindi (Devanagari script)
        self.word_mapping = {
            'hi': {
                'hello': 'नमस्ते',
                'welcome': 'स्वागत है',
                'thank you': 'धन्यवाद',
                'goodbye': 'अलविदा',
                'yes': 'हाँ',
                'no': 'नहीं',
                'please': 'कृपया',
                'sorry': 'माफ़ कीजिए',
                'help': 'मदद',
                'emergency': 'आपातकाल',
                'police': 'पुलिस',
                'hospital': 'अस्पताल',
                'doctor': 'डॉक्टर',
                'water': 'पानी',
                'food': 'भोजन',
                'hotel': 'होटल',
                'room': 'कमरा',
                'price': 'कीमत',
                'where': 'कहाँ',
                'when': 'कब',
                'why': 'क्यों',
                'how': 'कैसे',
                'what': 'क्या',
                'who': 'कौन'
            }
        }
        
        # Supported languages
        self.supported_languages = {
            'hi': 'Hindi',
            'bn': 'Bengali',
            'ta': 'Tamil',
            'te': 'Telugu',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'mr': 'Marathi',
            'gu': 'Gujarati',
            'pa': 'Punjabi',
            'or': 'Odia',
            'as': 'Assamese',
            'en': 'English'
        }

        # Initialize XlitEngine lazily per language to avoid heavy startup
        self._xlit_engines: Dict[str, any] = {}
        
    def get_supported_languages(self) -> Dict[str, str]:
        """Return list of supported languages"""
        return self.supported_languages
    
    def _simple_transliterate(self, text: str, target_lang: str) -> str:
        """Simple transliteration for common words"""
        if target_lang not in self.word_mapping:
            return text
            
        # Convert to lowercase for case-insensitive matching
        lower_text = text.lower()
        
        # Check for exact matches first
        if lower_text in self.word_mapping[target_lang]:
            return self.word_mapping[target_lang][lower_text]
            
        # Check for partial matches
        for eng, trans in self.word_mapping[target_lang].items():
            if eng in lower_text:
                # Simple replacement - in a real app, you'd want more sophisticated handling
                return text.replace(eng, trans)
                
        # Return original text if no match found
        return text

    def _xlit_transliterate(self, text: str, target_lang: str) -> str:
        """Use ai4bharat XlitEngine if available."""
        if not _xlit_available:
            return self._simple_transliterate(text, target_lang)

        try:
            if target_lang not in self._xlit_engines:
                # src_script_type='en' for English to Indic
                self._xlit_engines[target_lang] = XlitEngine(
                    target_lang,
                    beam_width=4,
                    rescore=True,
                    src_script_type="en",
                )
            engine = self._xlit_engines[target_lang]
            out = engine.translit_word(text, topk=1)
            if isinstance(out, list) and out:
                return out[0]
            if isinstance(out, str):
                return out
        except Exception:
            # Fallback silently to simple rules
            pass
        return self._simple_transliterate(text, target_lang)
    
    async def transliterate_word(self, text: str, target_lang: str = 'hi') -> Dict[str, str]:
        """Transliterate a single word"""
        try:
            if not text.strip():
                return {"original_text": text, "transliterated_text": text}
                
            if target_lang not in self.supported_languages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported language code: {target_lang}"
                )
                
            result = self._xlit_transliterate(text, target_lang)
            return {"original_text": text, "transliterated_text": result}
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(
                status_code=500,
                detail=f"Translation failed: {str(e)}"
            )
    
    async def transliterate_sentence(self, text: str, target_lang: str = 'hi') -> Dict[str, str]:
        """Transliterate a sentence"""
        try:
            if not text.strip():
                return {"original_text": text, "transliterated_text": text}
                
            if target_lang not in self.supported_languages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported language code: {target_lang}"
                )
                
            # Split into words and translate each one
            words = re.findall(r"\b\w+\b|\S", text)
            translated_words = []
            
            for word in words:
                if word.strip():
                    translated = self._xlit_transliterate(word, target_lang)
                    translated_words.append(translated)
                else:
                    translated_words.append(word)
                    
            result = ''.join(translated_words)
            return {"original_text": text, "transliterated_text": result}
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(
                status_code=500,
                detail=f"Translation failed: {str(e)}"
            )

# Create a singleton instance
translation_service = TranslationService()
