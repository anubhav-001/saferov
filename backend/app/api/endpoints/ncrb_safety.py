"""
API endpoint for NCRB-integrated safety score prediction
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
from ..ai_models import TouristSafetyScoreModel
from ..services.ncrb_service import ncrb_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ncrb", tags=["NCRB Integration"])

class SafetyScoreRequest(BaseModel):
    """Request model for safety score prediction with NCRB data"""
    location_risk: Optional[int] = 5
    group_size: Optional[int] = 1
    experience_level: Optional[str] = "beginner"
    has_itinerary: Optional[bool] = False
    age: Optional[int] = 30
    health_score: Optional[int] = 8
    state: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class SafetyScoreResponse(BaseModel):
    """Response model for safety score prediction"""
    safety_score: int
    ncrb_risk_score: float
    enhanced_location_risk: float
    crime_statistics: Dict[str, Any]
    crime_trends: Dict[str, Any]
    safety_indicators: Dict[str, Any]
    recommendations: list
    confidence: float

@router.post("/safety-score", response_model=SafetyScoreResponse)
async def predict_safety_score_with_ncrb(request: SafetyScoreRequest):
    """
    Predict safety score using NCRB crime data integration
    
    This endpoint enhances the safety score prediction by integrating real-time
    crime data from the National Crime Records Bureau (NCRB) API.
    """
    try:
        # Initialize the safety model
        safety_model = TouristSafetyScoreModel()
        
        # Convert request to dict
        tourist_data = request.dict()
        
        # Get NCRB data for the location
        location_info = {
            'state': request.state,
            'district': request.district,
            'latitude': request.latitude,
            'longitude': request.longitude
        }
        
        # Get comprehensive NCRB data
        ncrb_data = ncrb_service.get_comprehensive_safety_data(location_info)
        
        # Get NCRB risk score
        ncrb_risk_score = safety_model._get_ncrb_risk_score(tourist_data)
        
        # Calculate enhanced location risk
        location_risk = request.location_risk or 5
        enhanced_location_risk = (location_risk + ncrb_risk_score) / 2
        
        # Predict safety score
        safety_score = safety_model.predict_safety_score(tourist_data)
        
        # Generate recommendations based on NCRB data
        recommendations = _generate_recommendations(ncrb_data, safety_score, tourist_data)
        
        # Calculate confidence based on data availability
        confidence = _calculate_confidence(ncrb_data, tourist_data)
        
        return SafetyScoreResponse(
            safety_score=safety_score,
            ncrb_risk_score=ncrb_risk_score,
            enhanced_location_risk=enhanced_location_risk,
            crime_statistics=ncrb_data.get('crime_statistics', {}),
            crime_trends=ncrb_data.get('crime_trends', {}),
            safety_indicators=ncrb_data.get('safety_indicators', {}),
            recommendations=recommendations,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Error predicting safety score with NCRB data: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/crime-data/{state}")
async def get_crime_data(state: str, district: Optional[str] = None, year: Optional[int] = None):
    """
    Get crime data for a specific state/district from NCRB
    """
    try:
        crime_data = ncrb_service.get_crime_data_by_location(state, district, year=year)
        return {
            "state": state,
            "district": district,
            "year": year or 2024,
            "data": crime_data
        }
    except Exception as e:
        logger.error(f"Error fetching crime data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch crime data: {str(e)}")

@router.get("/crime-trends/{state}")
async def get_crime_trends(state: str, district: Optional[str] = None, months: int = 12):
    """
    Get crime trends for a specific state/district from NCRB
    """
    try:
        trends = ncrb_service.get_crime_trends(state, district, months)
        return {
            "state": state,
            "district": district,
            "trend_period_months": months,
            "trends": trends
        }
    except Exception as e:
        logger.error(f"Error fetching crime trends: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch crime trends: {str(e)}")

@router.get("/safety-indicators")
async def get_safety_indicators(latitude: float, longitude: float, radius_km: float = 10):
    """
    Get safety indicators for a specific location from NCRB
    """
    try:
        safety_data = ncrb_service.get_safety_indicators(latitude, longitude, radius_km)
        return {
            "latitude": latitude,
            "longitude": longitude,
            "radius_km": radius_km,
            "indicators": safety_data
        }
    except Exception as e:
        logger.error(f"Error fetching safety indicators: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch safety indicators: {str(e)}")

def _generate_recommendations(ncrb_data: Dict, safety_score: int, tourist_data: Dict) -> list:
    """Generate safety recommendations based on NCRB data"""
    recommendations = []
    
    # Basic recommendations based on safety score
    if safety_score <= 3:
        recommendations.extend([
            "High risk area detected. Avoid traveling alone.",
            "Stay in well-lit, populated areas.",
            "Keep emergency contacts readily available.",
            "Consider postponing non-essential travel."
        ])
    elif safety_score <= 6:
        recommendations.extend([
            "Moderate risk area. Travel with companions when possible.",
            "Stay alert and aware of your surroundings.",
            "Keep valuables secure and out of sight.",
            "Share your itinerary with trusted contacts."
        ])
    else:
        recommendations.extend([
            "Low risk area. Enjoy your travels safely.",
            "Maintain basic safety precautions.",
            "Keep emergency contacts updated."
        ])
    
    # NCRB-specific recommendations
    crime_stats = ncrb_data.get('crime_statistics', {})
    trends = ncrb_data.get('crime_trends', {})
    
    # Crime trend recommendations
    trend_direction = trends.get('trend_direction', 'stable')
    if trend_direction == 'increasing':
        recommendations.append("⚠️ Crime rates are increasing in this area. Exercise extra caution.")
    elif trend_direction == 'decreasing':
        recommendations.append("✅ Crime rates are decreasing in this area. Good safety trend.")
    
    # Crime type specific recommendations
    violent_crimes = crime_stats.get('violent_crimes', 0)
    if violent_crimes > crime_stats.get('total_crimes', 1) * 0.3:
        recommendations.append("High violent crime rate. Avoid isolated areas, especially at night.")
    
    property_crimes = crime_stats.get('property_crimes', 0)
    if property_crimes > crime_stats.get('total_crimes', 1) * 0.5:
        recommendations.append("High property crime rate. Keep valuables secure and avoid displaying expensive items.")
    
    # Experience level recommendations
    experience = tourist_data.get('experience_level', 'beginner')
    if experience == 'beginner':
        recommendations.append("As a beginner traveler, consider hiring a local guide for safer exploration.")
    
    # Group size recommendations
    group_size = tourist_data.get('group_size', 1)
    if group_size == 1:
        recommendations.append("Solo travel detected. Consider joining group tours or connecting with other travelers.")
    
    return recommendations

def _calculate_confidence(ncrb_data: Dict, tourist_data: Dict) -> float:
    """Calculate confidence score based on data availability"""
    confidence = 0.5  # Base confidence
    
    # Increase confidence based on available data
    if ncrb_data.get('crime_statistics'):
        confidence += 0.2
    if ncrb_data.get('crime_trends'):
        confidence += 0.15
    if ncrb_data.get('safety_indicators'):
        confidence += 0.1
    
    # Increase confidence based on location data completeness
    if tourist_data.get('state'):
        confidence += 0.05
    if tourist_data.get('district'):
        confidence += 0.05
    if tourist_data.get('latitude') and tourist_data.get('longitude'):
        confidence += 0.05
    
    return min(1.0, confidence)

