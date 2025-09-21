from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import logging

from app.services.translation_service import translation_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages for transliteration"""
    try:
        languages = translation_service.get_supported_languages()
        return {
            "status": "success",
            "languages": languages
        }
    except Exception as e:
        logger.error(f"Error getting supported languages: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve supported languages")

@router.get("/transliterate/word")
async def transliterate_word(
    text: str,
    target_lang: str = 'hi',
):
    """
    Transliterate a single word from English to the target language script
    
    Args:
        text: The English text to transliterate
        target_lang: Target language code (default: 'hi' for Hindi)
    """
    try:
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        result = await translation_service.transliterate_word(text, target_lang)
        return {
            "status": "success",
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in transliteration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

@router.get("/transliterate/sentence")
async def transliterate_sentence(
    text: str,
    target_lang: str = 'hi',
):
    """
    Transliterate a sentence from English to the target language script
    
    Args:
        text: The English text to transliterate
        target_lang: Target language code (default: 'hi' for Hindi)
    """
    try:
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        result = await translation_service.transliterate_sentence(text, target_lang)
        return {
            "status": "success",
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in sentence transliteration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
