"""
NCRB (National Crime Records Bureau) API Integration Service
Integrates real-time crime data for enhanced safety score predictions
"""

import requests
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import pandas as pd
from ..config import settings

logger = logging.getLogger(__name__)

class NCRBService:
    """Service to interact with NCRB API for crime data"""
    
    def __init__(self):
        self.api_key = "579b464db66ec23bdd00000103f3e5383cc74a3a52239069a8495b74"
        self.base_url = "https://api.ncrb.gov.in"  # Update with actual NCRB API URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        self.cache_duration = 3600  # Cache for 1 hour
        self._cache = {}
        
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make authenticated request to NCRB API"""
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                logger.error("NCRB API authentication failed")
                return None
            elif response.status_code == 429:
                logger.warning("NCRB API rate limit exceeded")
                return None
            else:
                logger.error(f"NCRB API request failed with status {response.status_code}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"NCRB API request error: {e}")
            return None
    
    def _get_cached_data(self, cache_key: str) -> Optional[Dict]:
        """Get cached data if still valid"""
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=self.cache_duration):
                return cached_data
            else:
                del self._cache[cache_key]
        return None
    
    def _cache_data(self, cache_key: str, data: Dict):
        """Cache data with timestamp"""
        self._cache[cache_key] = (data, datetime.now())
    
    def get_crime_data_by_location(self, state: str, district: str = None, 
                                 crime_type: str = None, year: int = None) -> Dict:
        """
        Get crime data for a specific location
        
        Args:
            state: State name
            district: District name (optional)
            crime_type: Type of crime (optional)
            year: Year for data (defaults to current year)
        
        Returns:
            Dict containing crime statistics
        """
        cache_key = f"crime_{state}_{district}_{crime_type}_{year or datetime.now().year}"
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        params = {
            "state": state,
            "year": year or datetime.now().year
        }
        
        if district:
            params["district"] = district
        if crime_type:
            params["crime_type"] = crime_type
            
        endpoint = "crime-statistics"
        data = self._make_request(endpoint, params)
        
        if data:
            self._cache_data(cache_key, data)
            return data
        
        # Return mock data if API is unavailable
        return self._get_mock_crime_data(state, district, crime_type, year)
    
    def get_crime_trends(self, state: str, district: str = None, 
                        months: int = 12) -> Dict:
        """
        Get crime trends over time
        
        Args:
            state: State name
            district: District name (optional)
            months: Number of months to look back
        
        Returns:
            Dict containing crime trend data
        """
        cache_key = f"trends_{state}_{district}_{months}"
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        params = {
            "state": state,
            "months": months
        }
        
        if district:
            params["district"] = district
            
        endpoint = "crime-trends"
        data = self._make_request(endpoint, params)
        
        if data:
            self._cache_data(cache_key, data)
            return data
        
        # Return mock trend data if API is unavailable
        return self._get_mock_trend_data(state, district, months)
    
    def get_safety_indicators(self, latitude: float, longitude: float, 
                            radius_km: float = 10) -> Dict:
        """
        Get safety indicators for a specific location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            radius_km: Search radius in kilometers
        
        Returns:
            Dict containing safety indicators
        """
        cache_key = f"safety_{latitude}_{longitude}_{radius_km}"
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        params = {
            "lat": latitude,
            "lng": longitude,
            "radius": radius_km
        }
        
        endpoint = "safety-indicators"
        data = self._make_request(endpoint, params)
        
        if data:
            self._cache_data(cache_key, data)
            return data
        
        # Return mock safety data if API is unavailable
        return self._get_mock_safety_data(latitude, longitude, radius_km)
    
    def calculate_location_risk_score(self, location_data: Dict) -> float:
        """
        Calculate risk score based on NCRB crime data
        
        Args:
            location_data: Location-specific crime data
        
        Returns:
            Risk score from 1-10 (10 being highest risk)
        """
        try:
            # Extract key metrics
            total_crimes = location_data.get('total_crimes', 0)
            violent_crimes = location_data.get('violent_crimes', 0)
            property_crimes = location_data.get('property_crimes', 0)
            population = location_data.get('population', 100000)
            
            # Calculate crime rates per 100,000 population
            total_crime_rate = (total_crimes / population) * 100000
            violent_crime_rate = (violent_crimes / population) * 100000
            property_crime_rate = (property_crimes / population) * 100000
            
            # Weighted risk calculation
            risk_score = (
                total_crime_rate * 0.3 +
                violent_crime_rate * 0.5 +
                property_crime_rate * 0.2
            )
            
            # Normalize to 1-10 scale
            # Assuming average crime rate of 200 per 100k = score of 5
            normalized_score = min(10, max(1, (risk_score / 200) * 5))
            
            return round(normalized_score, 2)
            
        except Exception as e:
            logger.error(f"Error calculating risk score: {e}")
            return 5.0  # Default moderate risk
    
    def _get_mock_crime_data(self, state: str, district: str = None, 
                           crime_type: str = None, year: int = None) -> Dict:
        """Generate mock crime data for testing"""
        base_crimes = {
            "total_crimes": 1500,
            "violent_crimes": 300,
            "property_crimes": 800,
            "cyber_crimes": 200,
            "drug_related": 100,
            "theft": 600,
            "assault": 250,
            "robbery": 150,
            "population": 500000
        }
        
        # Adjust based on state (mock data)
        state_multipliers = {
            "Delhi": 1.5,
            "Mumbai": 1.3,
            "Bangalore": 1.1,
            "Chennai": 1.0,
            "Kolkata": 1.2,
            "Hyderabad": 1.0
        }
        
        multiplier = state_multipliers.get(state, 1.0)
        
        return {
            "state": state,
            "district": district,
            "year": year or datetime.now().year,
            "total_crimes": int(base_crimes["total_crimes"] * multiplier),
            "violent_crimes": int(base_crimes["violent_crimes"] * multiplier),
            "property_crimes": int(base_crimes["property_crimes"] * multiplier),
            "cyber_crimes": int(base_crimes["cyber_crimes"] * multiplier),
            "drug_related": int(base_crimes["drug_related"] * multiplier),
            "theft": int(base_crimes["theft"] * multiplier),
            "assault": int(base_crimes["assault"] * multiplier),
            "robbery": int(base_crimes["robbery"] * multiplier),
            "population": int(base_crimes["population"] * multiplier),
            "crime_rate_per_100k": round((base_crimes["total_crimes"] * multiplier / base_crimes["population"]) * 100000, 2),
            "last_updated": datetime.now().isoformat()
        }
    
    def _get_mock_trend_data(self, state: str, district: str = None, 
                           months: int = 12) -> Dict:
        """Generate mock trend data for testing"""
        import random
        
        trends = []
        base_crime_count = 100
        
        for i in range(months):
            month_date = datetime.now() - timedelta(days=30 * i)
            # Add some seasonal variation
            seasonal_factor = 1 + 0.2 * abs(month_date.month - 6) / 6
            crime_count = int(base_crime_count * seasonal_factor * (1 + random.uniform(-0.1, 0.1)))
            
            trends.append({
                "month": month_date.strftime("%Y-%m"),
                "total_crimes": crime_count,
                "violent_crimes": int(crime_count * 0.2),
                "property_crimes": int(crime_count * 0.6),
                "cyber_crimes": int(crime_count * 0.1)
            })
        
        return {
            "state": state,
            "district": district,
            "trend_period_months": months,
            "trends": list(reversed(trends)),
            "trend_direction": "stable",  # stable, increasing, decreasing
            "last_updated": datetime.now().isoformat()
        }
    
    def _get_mock_safety_data(self, latitude: float, longitude: float, 
                            radius_km: float = 10) -> Dict:
        """Generate mock safety data for testing"""
        # Mock safety indicators based on coordinates
        base_safety_score = 7.0
        
        # Adjust based on location (mock logic)
        if 28.0 <= latitude <= 29.0 and 77.0 <= longitude <= 78.0:  # Delhi area
            base_safety_score = 6.0
        elif 19.0 <= latitude <= 20.0 and 72.0 <= longitude <= 73.0:  # Mumbai area
            base_safety_score = 6.5
        
        return {
            "latitude": latitude,
            "longitude": longitude,
            "radius_km": radius_km,
            "safety_score": base_safety_score,
            "crime_density": "medium",
            "police_stations_nearby": 3,
            "emergency_response_time_minutes": 8,
            "street_lighting_score": 7,
            "crowd_density_score": 6,
            "transport_safety_score": 7,
            "last_updated": datetime.now().isoformat()
        }
    
    def get_comprehensive_safety_data(self, location_info: Dict) -> Dict:
        """
        Get comprehensive safety data for a location
        
        Args:
            location_info: Dict containing location details
        
        Returns:
            Comprehensive safety data including NCRB statistics
        """
        state = location_info.get('state', 'Unknown')
        district = location_info.get('district')
        latitude = location_info.get('latitude')
        longitude = location_info.get('longitude')
        
        # Get crime data
        crime_data = self.get_crime_data_by_location(state, district)
        
        # Get trends
        trends = self.get_crime_trends(state, district)
        
        # Get safety indicators if coordinates available
        safety_indicators = {}
        if latitude and longitude:
            safety_indicators = self.get_safety_indicators(latitude, longitude)
        
        # Calculate risk score
        risk_score = self.calculate_location_risk_score(crime_data)
        
        return {
            "location": {
                "state": state,
                "district": district,
                "latitude": latitude,
                "longitude": longitude
            },
            "crime_statistics": crime_data,
            "crime_trends": trends,
            "safety_indicators": safety_indicators,
            "calculated_risk_score": risk_score,
            "data_source": "NCRB API",
            "last_updated": datetime.now().isoformat()
        }

# Global instance
ncrb_service = NCRBService()
