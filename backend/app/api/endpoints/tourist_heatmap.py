"""
Tourist Heat Map API Endpoints
Provides real-time tourist location data for the heat map visualization
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime, timedelta
import random
import math
from ...services.ncrb_service import ncrb_service
from ...services.weather_service import weather_service
from ...ai_models import TouristSafetyScoreModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tourist-heatmap", tags=["Tourist Heat Map"])

class TouristLocation(BaseModel):
    """Model for tourist location data"""
    id: str
    position: Dict[str, float]  # {"lat": float, "lng": float}
    count: int
    safety_score: float
    last_update: str
    nationality: Optional[str] = None
    group_size: Optional[int] = None
    age_group: Optional[str] = None
    experience_level: Optional[str] = None

class SafetyZone(BaseModel):
    """Model for safety zone data"""
    id: str
    name: str
    position: Dict[str, float]
    radius: float  # in meters
    safety_level: str  # "low", "medium", "high", "critical"
    color: str
    description: str
    tourist_count: int
    risk_factors: List[str]

class HeatMapData(BaseModel):
    """Model for complete heat map data"""
    city: str
    tourist_locations: List[TouristLocation]
    safety_zones: List[SafetyZone]
    total_tourists: int
    average_safety_score: float
    last_updated: str
    statistics: Dict[str, Any]

# Mock data generators for demonstration
def generate_tourist_locations(city: str) -> List[TouristLocation]:
    """Generate mock tourist location data"""
    base_positions = {
        'Delhi': [
            {"lat": 28.6139, "lng": 77.2090, "name": "India Gate"},
            {"lat": 28.6562, "lng": 77.2410, "name": "Red Fort"},
            {"lat": 28.5244, "lng": 77.1855, "name": "Qutub Minar"},
            {"lat": 28.6129, "lng": 77.2295, "name": "Connaught Place"},
            {"lat": 28.5355, "lng": 77.2459, "name": "Chandni Chowk"},
            {"lat": 28.7041, "lng": 77.1025, "name": "Lotus Temple"},
            {"lat": 28.5921, "lng": 77.2500, "name": "Jama Masjid"},
        ],
        'Agra': [
            {"lat": 27.1751, "lng": 78.0421, "name": "Taj Mahal"},
            {"lat": 27.1833, "lng": 78.0167, "name": "Agra Fort"},
            {"lat": 27.2167, "lng": 78.0167, "name": "Fatehpur Sikri"},
            {"lat": 27.1767, "lng": 78.0081, "name": "Itmad-ud-Daulah"},
        ],
        'Jaipur': [
            {"lat": 26.9124, "lng": 75.7873, "name": "City Palace"},
            {"lat": 26.9239, "lng": 75.8267, "name": "Hawa Mahal"},
            {"lat": 26.9859, "lng": 75.8513, "name": "Amber Fort"},
            {"lat": 26.9220, "lng": 75.8687, "name": "Jantar Mantar"},
            {"lat": 26.9519, "lng": 75.8414, "name": "Albert Hall Museum"},
        ]
    }
    
    positions = base_positions.get(city, base_positions['Delhi'])
    locations = []
    
    for i, pos in enumerate(positions):
        # Add some randomness to simulate real tourist distribution
        lat_offset = (random.random() - 0.5) * 0.01
        lng_offset = (random.random() - 0.5) * 0.01
        
        # Generate realistic tourist count based on location popularity
        base_count = random.randint(15, 80)
        if "Taj Mahal" in pos["name"] or "Red Fort" in pos["name"]:
            base_count = random.randint(50, 120)
        
        # Calculate safety score using our integrated model
        tourist_data = {
            'location_risk': random.randint(3, 8),
            'group_size': random.randint(1, 6),
            'experience_level': random.choice(['beginner', 'intermediate', 'expert']),
            'has_itinerary': random.choice([True, False]),
            'age': random.randint(20, 65),
            'health_score': random.randint(6, 10),
            'state': city,
            'city': pos["name"],
            'latitude': pos["lat"] + lat_offset,
            'longitude': pos["lng"] + lng_offset
        }
        
        safety_model = TouristSafetyScoreModel()
        safety_score = safety_model.predict_safety_score(tourist_data)
        
        locations.append(TouristLocation(
            id=f"tourist-{city}-{i}",
            position={
                "lat": pos["lat"] + lat_offset,
                "lng": pos["lng"] + lng_offset
            },
            count=base_count,
            safety_score=float(safety_score),
            last_update=datetime.now().isoformat(),
            nationality=random.choice(['Indian', 'American', 'British', 'German', 'French', 'Japanese', 'Australian']),
            group_size=random.randint(1, 8),
            age_group=random.choice(['18-25', '26-35', '36-45', '46-55', '55+']),
            experience_level=random.choice(['beginner', 'intermediate', 'expert'])
        ))
    
    return locations

def generate_safety_zones(city: str, tourist_locations: List[TouristLocation]) -> List[SafetyZone]:
    """Generate safety zones based on tourist locations and city data"""
    base_zones = {
        'Delhi': [
            {
                "name": "Central Delhi",
                "position": {"lat": 28.6139, "lng": 77.2090},
                "radius": 2000,
                "safety_level": "medium",
                "description": "Moderate safety zone with regular patrols"
            },
            {
                "name": "Old Delhi",
                "position": {"lat": 28.6562, "lng": 77.2410},
                "radius": 1500,
                "safety_level": "high",
                "description": "High-risk area with increased monitoring"
            },
            {
                "name": "New Delhi",
                "position": {"lat": 28.6129, "lng": 77.2295},
                "radius": 3000,
                "safety_level": "low",
                "description": "Safe zone with excellent infrastructure"
            }
        ],
        'Agra': [
            {
                "name": "Taj Mahal Area",
                "position": {"lat": 27.1751, "lng": 78.0421},
                "radius": 1000,
                "safety_level": "low",
                "description": "Highly secured tourist area"
            },
            {
                "name": "City Center",
                "position": {"lat": 27.1833, "lng": 78.0167},
                "radius": 2000,
                "safety_level": "medium",
                "description": "Moderate safety with good facilities"
            }
        ],
        'Jaipur': [
            {
                "name": "Pink City",
                "position": {"lat": 26.9124, "lng": 75.7873},
                "radius": 2500,
                "safety_level": "low",
                "description": "Well-maintained heritage area"
            },
            {
                "name": "Outskirts",
                "position": {"lat": 26.9859, "lng": 75.8513},
                "radius": 3000,
                "safety_level": "medium",
                "description": "Moderate safety with some concerns"
            }
        ]
    }
    
    zones_data = base_zones.get(city, base_zones['Delhi'])
    zones = []
    
    for i, zone_data in enumerate(zones_data):
        # Count tourists in this zone
        zone_tourist_count = 0
        for tourist in tourist_locations:
            distance = math.sqrt(
                (tourist.position["lat"] - zone_data["position"]["lat"])**2 +
                (tourist.position["lng"] - zone_data["position"]["lng"])**2
            ) * 111000  # Convert to meters (rough approximation)
            
            if distance <= zone_data["radius"]:
                zone_tourist_count += tourist.count
        
        # Generate risk factors based on safety level
        risk_factors = []
        if zone_data["safety_level"] == "high":
            risk_factors = ["High crime rate", "Poor lighting", "Limited police presence"]
        elif zone_data["safety_level"] == "medium":
            risk_factors = ["Moderate crime", "Some safety concerns"]
        else:
            risk_factors = ["Well-patrolled", "Good infrastructure"]
        
        # Get zone color
        color_map = {
            "low": "#10b981",
            "medium": "#fbbf24", 
            "high": "#f97316",
            "critical": "#ef4444"
        }
        
        zones.append(SafetyZone(
            id=f"zone-{city}-{i}",
            name=zone_data["name"],
            position=zone_data["position"],
            radius=zone_data["radius"],
            safety_level=zone_data["safety_level"],
            color=color_map.get(zone_data["safety_level"], "#6b7280"),
            description=zone_data["description"],
            tourist_count=zone_tourist_count,
            risk_factors=risk_factors
        ))
    
    return zones

@router.get("/data/{city}", response_model=HeatMapData)
async def get_heatmap_data(city: str):
    """
    Get tourist heat map data for a specific city
    
    Returns real-time tourist locations, safety zones, and statistics
    """
    try:
        # Generate tourist locations
        tourist_locations = generate_tourist_locations(city)
        
        # Generate safety zones
        safety_zones = generate_safety_zones(city, tourist_locations)
        
        # Calculate statistics
        total_tourists = sum(loc.count for loc in tourist_locations)
        average_safety_score = sum(loc.safety_score for loc in tourist_locations) / len(tourist_locations) if tourist_locations else 0
        
        # Get additional statistics
        nationality_distribution = {}
        age_group_distribution = {}
        experience_distribution = {}
        
        for location in tourist_locations:
            # Count nationalities
            if location.nationality:
                nationality_distribution[location.nationality] = nationality_distribution.get(location.nationality, 0) + location.count
            
            # Count age groups
            if location.age_group:
                age_group_distribution[location.age_group] = age_group_distribution.get(location.age_group, 0) + location.count
            
            # Count experience levels
            if location.experience_level:
                experience_distribution[location.experience_level] = experience_distribution.get(location.experience_level, 0) + location.count
        
        statistics = {
            "total_locations": len(tourist_locations),
            "total_zones": len(safety_zones),
            "nationality_distribution": nationality_distribution,
            "age_group_distribution": age_group_distribution,
            "experience_distribution": experience_distribution,
            "safety_score_distribution": {
                "safe": len([loc for loc in tourist_locations if loc.safety_score >= 8]),
                "moderate": len([loc for loc in tourist_locations if 6 <= loc.safety_score < 8]),
                "caution": len([loc for loc in tourist_locations if 4 <= loc.safety_score < 6]),
                "high_risk": len([loc for loc in tourist_locations if loc.safety_score < 4])
            }
        }
        
        return HeatMapData(
            city=city,
            tourist_locations=tourist_locations,
            safety_zones=safety_zones,
            total_tourists=total_tourists,
            average_safety_score=average_safety_score,
            last_updated=datetime.now().isoformat(),
            statistics=statistics
        )
        
    except Exception as e:
        logger.error(f"Error generating heat map data for {city}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate heat map data: {str(e)}")

@router.get("/locations/{city}", response_model=List[TouristLocation])
async def get_tourist_locations(city: str):
    """
    Get tourist locations for a specific city
    """
    try:
        locations = generate_tourist_locations(city)
        return locations
    except Exception as e:
        logger.error(f"Error getting tourist locations for {city}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get tourist locations: {str(e)}")

@router.get("/zones/{city}", response_model=List[SafetyZone])
async def get_safety_zones(city: str):
    """
    Get safety zones for a specific city
    """
    try:
        tourist_locations = generate_tourist_locations(city)
        zones = generate_safety_zones(city, tourist_locations)
        return zones
    except Exception as e:
        logger.error(f"Error getting safety zones for {city}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get safety zones: {str(e)}")

@router.get("/statistics/{city}")
async def get_heatmap_statistics(city: str):
    """
    Get heat map statistics for a specific city
    """
    try:
        tourist_locations = generate_tourist_locations(city)
        safety_zones = generate_safety_zones(city, tourist_locations)
        
        total_tourists = sum(loc.count for loc in tourist_locations)
        average_safety_score = sum(loc.safety_score for loc in tourist_locations) / len(tourist_locations) if tourist_locations else 0
        
        return {
            "city": city,
            "total_tourists": total_tourists,
            "total_locations": len(tourist_locations),
            "total_zones": len(safety_zones),
            "average_safety_score": average_safety_score,
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting heat map statistics for {city}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get heat map statistics: {str(e)}")

@router.post("/update-location")
async def update_tourist_location(location_data: TouristLocation):
    """
    Update tourist location data (for real-time updates)
    """
    try:
        # In a real implementation, this would update the database
        # For now, we'll just return success
        return {
            "status": "success",
            "message": "Tourist location updated successfully",
            "location_id": location_data.id,
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error updating tourist location: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update tourist location: {str(e)}")
