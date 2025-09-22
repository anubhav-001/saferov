"""
Weather API Integration Endpoints
Integrates Visual Crossing Weather API for enhanced safety predictions
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import logging
from ..services.weather_service import weather_service
from ..ai_models import TouristSafetyScoreModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/weather", tags=["Weather Integration"])

class WeatherSafetyRequest(BaseModel):
    """Request model for weather-enhanced safety prediction"""
    location_risk: Optional[int] = 5
    group_size: Optional[int] = 1
    experience_level: Optional[str] = "beginner"
    has_itinerary: Optional[bool] = False
    age: Optional[int] = 30
    health_score: Optional[int] = 8
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WeatherSafetyResponse(BaseModel):
    """Response model for weather-enhanced safety prediction"""
    safety_score: int
    weather_safety_score: float
    weather_risk_score: float
    weather_conditions: Dict[str, Any]
    weather_alerts: List[Dict[str, Any]]
    weather_recommendations: List[str]
    ncrb_risk_score: float
    enhanced_location_risk: float
    crime_statistics: Dict[str, Any]
    crime_trends: Dict[str, Any]
    safety_indicators: Dict[str, Any]
    recommendations: List[str]
    confidence: float

class WeatherRequest(BaseModel):
    """Request model for weather data"""
    location: str
    days: Optional[int] = 1

class WeatherResponse(BaseModel):
    """Response model for weather data"""
    location: str
    current_weather: Dict[str, Any]
    forecast: Optional[Dict[str, Any]] = None
    weather_safety_analysis: Dict[str, Any]

@router.post("/safety-score", response_model=WeatherSafetyResponse)
async def predict_safety_score_with_weather(request: WeatherSafetyRequest):
    """
    Predict safety score using both NCRB crime data and weather data
    
    This endpoint provides comprehensive safety analysis combining:
    - Real-time weather conditions
    - Crime statistics from NCRB
    - Tourist-specific factors
    """
    try:
        # Initialize the safety model
        safety_model = TouristSafetyScoreModel()
        
        # Convert request to dict
        tourist_data = request.dict()
        
        # Get location string for weather API
        location_string = safety_model._get_location_string(tourist_data)
        
        # Get weather safety analysis
        weather_analysis = weather_service.calculate_weather_safety_score(location_string)
        
        # Get weather safety score
        weather_safety_score = weather_analysis.get('weather_safety_score', 7.0)
        weather_risk_score = 10 - weather_safety_score
        
        # Get NCRB risk score
        ncrb_risk_score = safety_model._get_ncrb_risk_score(tourist_data)
        
        # Calculate enhanced location risk
        location_risk = request.location_risk or 5
        enhanced_location_risk = (location_risk + ncrb_risk_score) / 2
        
        # Predict overall safety score
        safety_score = safety_model.predict_safety_score(tourist_data)
        
        # Get comprehensive recommendations
        recommendations = _generate_comprehensive_recommendations(
            weather_analysis, ncrb_risk_score, safety_score, tourist_data
        )
        
        # Calculate confidence based on data availability
        confidence = _calculate_enhanced_confidence(weather_analysis, tourist_data)
        
        return WeatherSafetyResponse(
            safety_score=safety_score,
            weather_safety_score=weather_safety_score,
            weather_risk_score=weather_risk_score,
            weather_conditions=weather_analysis.get('weather_conditions', {}),
            weather_alerts=weather_analysis.get('alerts', []),
            weather_recommendations=weather_analysis.get('recommendations', []),
            ncrb_risk_score=ncrb_risk_score,
            enhanced_location_risk=enhanced_location_risk,
            crime_statistics={},  # Will be populated by NCRB service
            crime_trends={},      # Will be populated by NCRB service
            safety_indicators={}, # Will be populated by NCRB service
            recommendations=recommendations,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Error predicting safety score with weather data: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/current", response_model=WeatherResponse)
async def get_current_weather(request: WeatherRequest):
    """
    Get current weather data for a location
    """
    try:
        location = request.location
        
        # Get current weather
        current_weather = weather_service.get_current_weather(location)
        
        # Get weather safety analysis
        weather_safety_analysis = weather_service.calculate_weather_safety_score(location)
        
        # Get forecast if requested
        forecast = None
        if request.days > 1:
            forecast = weather_service.get_weather_forecast(location, request.days)
        
        return WeatherResponse(
            location=location,
            current_weather=current_weather,
            forecast=forecast,
            weather_safety_analysis=weather_safety_analysis
        )
        
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather data: {str(e)}")

@router.get("/forecast/{location}")
async def get_weather_forecast(location: str, days: int = 7):
    """
    Get weather forecast for a location
    """
    try:
        forecast = weather_service.get_weather_forecast(location, days)
        return {
            "location": location,
            "forecast_days": days,
            "forecast": forecast
        }
    except Exception as e:
        logger.error(f"Error fetching weather forecast: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather forecast: {str(e)}")

@router.get("/alerts/{location}")
async def get_weather_alerts(location: str):
    """
    Get weather alerts for a location
    """
    try:
        alerts = weather_service.get_weather_alerts(location)
        return {
            "location": location,
            "alerts": alerts,
            "alert_count": len(alerts),
            "high_priority_alerts": len([a for a in alerts if a.get('safety_level', 0) > 7])
        }
    except Exception as e:
        logger.error(f"Error fetching weather alerts: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather alerts: {str(e)}")

@router.get("/safety-analysis/{location}")
async def get_weather_safety_analysis(location: str):
    """
    Get comprehensive weather safety analysis for a location
    """
    try:
        analysis = weather_service.calculate_weather_safety_score(location)
        return {
            "location": location,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"Error fetching weather safety analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather safety analysis: {str(e)}")

def _generate_comprehensive_recommendations(weather_analysis: Dict, ncrb_risk_score: float, 
                                          safety_score: int, tourist_data: Dict) -> List[str]:
    """Generate comprehensive safety recommendations combining weather and crime data"""
    recommendations = []
    
    # Weather-based recommendations
    weather_recommendations = weather_analysis.get('recommendations', [])
    recommendations.extend(weather_recommendations)
    
    # Safety score based recommendations
    if safety_score <= 3:
        recommendations.extend([
            "🚨 High risk area detected. Avoid traveling alone.",
            "Stay in well-lit, populated areas.",
            "Keep emergency contacts readily available.",
            "Consider postponing non-essential travel."
        ])
    elif safety_score <= 6:
        recommendations.extend([
            "⚠️ Moderate risk area. Travel with companions when possible.",
            "Stay alert and aware of your surroundings.",
            "Keep valuables secure and out of sight.",
            "Share your itinerary with trusted contacts."
        ])
    else:
        recommendations.extend([
            "✅ Low risk area. Enjoy your travels safely.",
            "Maintain basic safety precautions.",
            "Keep emergency contacts updated."
        ])
    
    # NCRB-specific recommendations
    if ncrb_risk_score > 7:
        recommendations.append("📊 High crime rate in this area. Exercise extra caution.")
    elif ncrb_risk_score < 3:
        recommendations.append("📊 Low crime rate in this area. Good safety record.")
    
    # Weather alert recommendations
    alerts = weather_analysis.get('alerts', [])
    if alerts:
        high_alerts = [a for a in alerts if a.get('safety_level', 0) > 7]
        if high_alerts:
            recommendations.append("🌩️ Weather alerts active. Monitor conditions closely.")
    
    # Experience level recommendations
    experience = tourist_data.get('experience_level', 'beginner')
    if experience == 'beginner':
        recommendations.append("👶 As a beginner traveler, consider hiring a local guide for safer exploration.")
    
    # Group size recommendations
    group_size = tourist_data.get('group_size', 1)
    if group_size == 1:
        recommendations.append("👤 Solo travel detected. Consider joining group tours or connecting with other travelers.")
    
    return recommendations

def _calculate_enhanced_confidence(weather_analysis: Dict, tourist_data: Dict) -> float:
    """Calculate confidence score based on weather and location data availability"""
    confidence = 0.5  # Base confidence
    
    # Increase confidence based on weather data availability
    if weather_analysis.get('weather_conditions'):
        confidence += 0.2
    if weather_analysis.get('alerts'):
        confidence += 0.1
    
    # Increase confidence based on location data completeness
    if tourist_data.get('latitude') and tourist_data.get('longitude'):
        confidence += 0.15
    elif tourist_data.get('city') and tourist_data.get('state'):
        confidence += 0.1
    elif tourist_data.get('state'):
        confidence += 0.05
    
    return min(1.0, confidence)

