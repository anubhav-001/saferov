"""
Visual Crossing Weather API Integration Service
Integrates weather data for enhanced safety score predictions
"""

import json
import urllib.request
import urllib.error
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import requests
from ..config import settings

logger = logging.getLogger(__name__)

class WeatherService:
    """Service to interact with Visual Crossing Weather API"""
    
    def __init__(self):
        self.api_key = 'ERBNWFCSPDFBZPP97S7QFGCS9'
        self.unit_group = 'metric'
        self.content_type = 'json'
        self.base_url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
        self.cache_duration = 1800  # Cache for 30 minutes
        self._cache = {}
        
    def _make_request(self, location: str, days: int = 1) -> Optional[Dict]:
        """Make request to Visual Crossing Weather API"""
        try:
            # Construct the full API URL
            url = f"{self.base_url}{location}?unitGroup={self.unit_group}&contentType={self.content_type}&key={self.api_key}&days={days}"
            
            # Make the request to the API
            with urllib.request.urlopen(url) as response:
                data = response.read().decode()
                weather_data = json.loads(data)
                return weather_data
                
        except urllib.error.HTTPError as e:
            error_message = e.read().decode()
            logger.error(f"Weather API HTTPError: {e.code} - {error_message}")
            return None
        except urllib.error.URLError as e:
            logger.error(f"Weather API URLError: {e.reason}")
            return None
        except Exception as e:
            logger.error(f"Weather API request error: {e}")
            return None
    
    def _get_cached_data(self, cache_key: str) -> Optional[Dict]:
        """Get cached weather data if still valid"""
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=self.cache_duration):
                return cached_data
            else:
                del self._cache[cache_key]
        return None
    
    def _cache_data(self, cache_key: str, data: Dict):
        """Cache weather data with timestamp"""
        self._cache[cache_key] = (data, datetime.now())
    
    def get_current_weather(self, location: str) -> Dict:
        """
        Get current weather data for a location
        
        Args:
            location: Location string (e.g., "Delhi,India", "28.6139,77.2090")
        
        Returns:
            Dict containing current weather data
        """
        cache_key = f"current_weather_{location}"
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        weather_data = self._make_request(location, days=1)
        
        if weather_data:
            # Extract current weather information
            current_weather = self._extract_current_weather(weather_data)
            self._cache_data(cache_key, current_weather)
            return current_weather
        
        # Return mock data if API is unavailable
        return self._get_mock_weather_data(location)
    
    def get_weather_forecast(self, location: str, days: int = 7) -> Dict:
        """
        Get weather forecast for a location
        
        Args:
            location: Location string
            days: Number of days to forecast (max 15)
        
        Returns:
            Dict containing weather forecast
        """
        cache_key = f"forecast_{location}_{days}"
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        weather_data = self._make_request(location, days=min(days, 15))
        
        if weather_data:
            forecast = self._extract_forecast(weather_data)
            self._cache_data(cache_key, forecast)
            return forecast
        
        # Return mock forecast if API is unavailable
        return self._get_mock_forecast_data(location, days)
    
    def get_weather_alerts(self, location: str) -> List[Dict]:
        """
        Get weather alerts for a location
        
        Args:
            location: Location string
        
        Returns:
            List of weather alerts
        """
        weather_data = self.get_current_weather(location)
        alerts = weather_data.get('alerts', [])
        
        # Process alerts for safety relevance
        safety_alerts = []
        for alert in alerts:
            safety_level = self._assess_alert_safety_level(alert)
            if safety_level > 5:  # Only include significant alerts
                safety_alerts.append({
                    'alert': alert,
                    'safety_level': safety_level,
                    'recommendations': self._get_alert_recommendations(alert)
                })
        
        return safety_alerts
    
    def calculate_weather_safety_score(self, location: str) -> Dict:
        """
        Calculate weather-based safety score for a location
        
        Args:
            location: Location string
        
        Returns:
            Dict containing weather safety analysis
        """
        weather_data = self.get_current_weather(location)
        
        # Extract key weather metrics
        temperature = weather_data.get('temp', 20)
        humidity = weather_data.get('humidity', 50)
        wind_speed = weather_data.get('windspeed', 10)
        visibility = weather_data.get('visibility', 10)
        conditions = weather_data.get('conditions', 'Clear')
        uv_index = weather_data.get('uvindex', 5)
        
        # Calculate safety score based on weather conditions
        safety_score = self._calculate_weather_risk(
            temperature, humidity, wind_speed, visibility, conditions, uv_index
        )
        
        # Generate weather-specific recommendations
        recommendations = self._generate_weather_recommendations(
            temperature, humidity, wind_speed, visibility, conditions, uv_index
        )
        
        return {
            'location': location,
            'weather_safety_score': safety_score,
            'weather_conditions': {
                'temperature': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed,
                'visibility': visibility,
                'conditions': conditions,
                'uv_index': uv_index
            },
            'safety_factors': {
                'temperature_risk': self._assess_temperature_risk(temperature),
                'humidity_risk': self._assess_humidity_risk(humidity),
                'wind_risk': self._assess_wind_risk(wind_speed),
                'visibility_risk': self._assess_visibility_risk(visibility),
                'weather_condition_risk': self._assess_condition_risk(conditions),
                'uv_risk': self._assess_uv_risk(uv_index)
            },
            'recommendations': recommendations,
            'alerts': self.get_weather_alerts(location),
            'last_updated': datetime.now().isoformat()
        }
    
    def _extract_current_weather(self, weather_data: Dict) -> Dict:
        """Extract current weather information from API response"""
        try:
            current_conditions = weather_data.get('currentConditions', {})
            return {
                'temp': current_conditions.get('temp', 20),
                'humidity': current_conditions.get('humidity', 50),
                'windspeed': current_conditions.get('windspeed', 10),
                'visibility': current_conditions.get('visibility', 10),
                'conditions': current_conditions.get('conditions', 'Clear'),
                'uvindex': current_conditions.get('uvindex', 5),
                'feelslike': current_conditions.get('feelslike', 20),
                'pressure': current_conditions.get('pressure', 1013),
                'cloudcover': current_conditions.get('cloudcover', 0),
                'alerts': weather_data.get('alerts', [])
            }
        except Exception as e:
            logger.error(f"Error extracting current weather: {e}")
            return self._get_mock_weather_data("Unknown")
    
    def _extract_forecast(self, weather_data: Dict) -> Dict:
        """Extract forecast information from API response"""
        try:
            days = weather_data.get('days', [])
            forecast = []
            
            for day in days:
                forecast.append({
                    'date': day.get('datetime'),
                    'temp_max': day.get('tempmax'),
                    'temp_min': day.get('tempmin'),
                    'conditions': day.get('conditions'),
                    'precip_prob': day.get('precipprob'),
                    'windspeed': day.get('windspeed'),
                    'humidity': day.get('humidity')
                })
            
            return {
                'location': weather_data.get('address', 'Unknown'),
                'forecast': forecast,
                'alerts': weather_data.get('alerts', [])
            }
        except Exception as e:
            logger.error(f"Error extracting forecast: {e}")
            return self._get_mock_forecast_data("Unknown", 7)
    
    def _calculate_weather_risk(self, temp: float, humidity: float, wind_speed: float, 
                               visibility: float, conditions: str, uv_index: float) -> float:
        """Calculate overall weather safety score (1-10, 10 being safest)"""
        base_score = 7.0  # Start with moderate safety
        
        # Temperature risk
        if temp < 0 or temp > 40:
            base_score -= 3
        elif temp < 5 or temp > 35:
            base_score -= 2
        elif temp < 10 or temp > 30:
            base_score -= 1
        
        # Humidity risk
        if humidity > 90:
            base_score -= 2
        elif humidity > 80:
            base_score -= 1
        
        # Wind risk
        if wind_speed > 50:  # Very strong winds
            base_score -= 3
        elif wind_speed > 30:  # Strong winds
            base_score -= 2
        elif wind_speed > 20:  # Moderate winds
            base_score -= 1
        
        # Visibility risk
        if visibility < 1:  # Very poor visibility
            base_score -= 3
        elif visibility < 5:  # Poor visibility
            base_score -= 2
        elif visibility < 10:  # Reduced visibility
            base_score -= 1
        
        # Weather condition risk
        dangerous_conditions = ['Thunderstorm', 'Heavy Rain', 'Snow', 'Fog', 'Hail']
        if any(condition in conditions for condition in dangerous_conditions):
            base_score -= 2
        
        # UV risk
        if uv_index > 10:  # Extreme UV
            base_score -= 1
        elif uv_index > 8:  # Very high UV
            base_score -= 0.5
        
        return max(1, min(10, base_score))
    
    def _assess_temperature_risk(self, temp: float) -> str:
        """Assess temperature risk level"""
        if temp < 0 or temp > 40:
            return "extreme"
        elif temp < 5 or temp > 35:
            return "high"
        elif temp < 10 or temp > 30:
            return "moderate"
        else:
            return "low"
    
    def _assess_humidity_risk(self, humidity: float) -> str:
        """Assess humidity risk level"""
        if humidity > 90:
            return "high"
        elif humidity > 80:
            return "moderate"
        else:
            return "low"
    
    def _assess_wind_risk(self, wind_speed: float) -> str:
        """Assess wind risk level"""
        if wind_speed > 50:
            return "extreme"
        elif wind_speed > 30:
            return "high"
        elif wind_speed > 20:
            return "moderate"
        else:
            return "low"
    
    def _assess_visibility_risk(self, visibility: float) -> str:
        """Assess visibility risk level"""
        if visibility < 1:
            return "extreme"
        elif visibility < 5:
            return "high"
        elif visibility < 10:
            return "moderate"
        else:
            return "low"
    
    def _assess_condition_risk(self, conditions: str) -> str:
        """Assess weather condition risk level"""
        dangerous_conditions = ['Thunderstorm', 'Heavy Rain', 'Snow', 'Fog', 'Hail']
        if any(condition in conditions for condition in dangerous_conditions):
            return "high"
        elif 'Rain' in conditions or 'Cloudy' in conditions:
            return "moderate"
        else:
            return "low"
    
    def _assess_uv_risk(self, uv_index: float) -> str:
        """Assess UV risk level"""
        if uv_index > 10:
            return "extreme"
        elif uv_index > 8:
            return "high"
        elif uv_index > 6:
            return "moderate"
        else:
            return "low"
    
    def _assess_alert_safety_level(self, alert: Dict) -> int:
        """Assess safety level of weather alert (1-10)"""
        severity = alert.get('severity', 'minor').lower()
        if severity in ['extreme', 'severe']:
            return 9
        elif severity in ['moderate', 'major']:
            return 7
        elif severity in ['minor']:
            return 5
        else:
            return 3
    
    def _get_alert_recommendations(self, alert: Dict) -> List[str]:
        """Get safety recommendations for weather alert"""
        recommendations = []
        event = alert.get('event', '').lower()
        
        if 'thunderstorm' in event:
            recommendations.extend([
                "Avoid outdoor activities during thunderstorms",
                "Seek shelter in a sturdy building",
                "Avoid open areas and tall objects"
            ])
        elif 'flood' in event:
            recommendations.extend([
                "Avoid flooded areas and roads",
                "Do not attempt to cross flooded streets",
                "Move to higher ground if necessary"
            ])
        elif 'heat' in event:
            recommendations.extend([
                "Stay hydrated and drink plenty of water",
                "Avoid outdoor activities during peak heat",
                "Wear light-colored, loose-fitting clothing"
            ])
        elif 'cold' in event or 'freeze' in event:
            recommendations.extend([
                "Dress in layers to stay warm",
                "Limit time outdoors",
                "Be aware of frostbite and hypothermia risks"
            ])
        
        return recommendations
    
    def _generate_weather_recommendations(self, temp: float, humidity: float, wind_speed: float,
                                        visibility: float, conditions: str, uv_index: float) -> List[str]:
        """Generate weather-specific safety recommendations"""
        recommendations = []
        
        # Temperature recommendations
        if temp < 0:
            recommendations.append("❄️ Extreme cold weather. Dress warmly and limit outdoor exposure.")
        elif temp < 10:
            recommendations.append("🧥 Cold weather. Wear warm clothing and layers.")
        elif temp > 35:
            recommendations.append("☀️ Hot weather. Stay hydrated and avoid peak sun hours.")
        elif temp > 30:
            recommendations.append("🌡️ Warm weather. Drink plenty of water and wear sunscreen.")
        
        # Humidity recommendations
        if humidity > 80:
            recommendations.append("💧 High humidity. Stay hydrated and take breaks in air-conditioned areas.")
        
        # Wind recommendations
        if wind_speed > 30:
            recommendations.append("💨 Strong winds. Be cautious of falling objects and unstable surfaces.")
        elif wind_speed > 20:
            recommendations.append("🌬️ Moderate winds. Secure loose items and be aware of wind conditions.")
        
        # Visibility recommendations
        if visibility < 5:
            recommendations.append("🌫️ Poor visibility. Use extra caution when traveling and avoid unnecessary trips.")
        
        # Weather condition recommendations
        if 'Thunderstorm' in conditions:
            recommendations.append("⛈️ Thunderstorm conditions. Seek shelter immediately and avoid outdoor activities.")
        elif 'Rain' in conditions:
            recommendations.append("🌧️ Rainy conditions. Use appropriate rain gear and be cautious on wet surfaces.")
        elif 'Snow' in conditions:
            recommendations.append("❄️ Snow conditions. Use winter tires and drive carefully.")
        elif 'Fog' in conditions:
            recommendations.append("🌫️ Foggy conditions. Reduce speed and use fog lights.")
        
        # UV recommendations
        if uv_index > 8:
            recommendations.append("☀️ High UV index. Use sunscreen, wear a hat, and seek shade.")
        elif uv_index > 6:
            recommendations.append("🌞 Moderate UV index. Apply sunscreen and wear protective clothing.")
        
        return recommendations
    
    def _get_mock_weather_data(self, location: str) -> Dict:
        """Generate mock weather data for testing"""
        import random
        
        # Mock weather data based on location
        base_temp = 25
        if 'Delhi' in location or 'Mumbai' in location:
            base_temp = 30
        elif 'Bangalore' in location or 'Chennai' in location:
            base_temp = 28
        elif 'Kolkata' in location:
            base_temp = 32
        
        return {
            'temp': base_temp + random.uniform(-5, 5),
            'humidity': random.uniform(40, 80),
            'windspeed': random.uniform(5, 25),
            'visibility': random.uniform(8, 15),
            'conditions': random.choice(['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain']),
            'uvindex': random.uniform(3, 8),
            'feelslike': base_temp + random.uniform(-3, 3),
            'pressure': random.uniform(1000, 1020),
            'cloudcover': random.uniform(0, 50),
            'alerts': []
        }
    
    def _get_mock_forecast_data(self, location: str, days: int) -> Dict:
        """Generate mock forecast data for testing"""
        import random
        
        forecast = []
        base_temp = 25
        
        for i in range(days):
            forecast.append({
                'date': (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'),
                'temp_max': base_temp + random.uniform(-3, 8),
                'temp_min': base_temp + random.uniform(-8, 3),
                'conditions': random.choice(['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain']),
                'precip_prob': random.uniform(0, 30),
                'windspeed': random.uniform(5, 20),
                'humidity': random.uniform(40, 80)
            })
        
        return {
            'location': location,
            'forecast': forecast,
            'alerts': []
        }

# Global instance
weather_service = WeatherService()

