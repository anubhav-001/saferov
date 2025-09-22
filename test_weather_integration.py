#!/usr/bin/env python3
"""
Test script for Weather API integration with safety score prediction
"""

import sys
import os
import requests
import json
from datetime import datetime

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def test_weather_integration():
    """Test the Weather API integration endpoints"""
    
    base_url = "http://localhost:8000"  # Adjust if your server runs on different port
    
    print("🌤️ Testing Weather API Integration")
    print("=" * 50)
    
    # Test 1: Weather-Enhanced Safety Score Prediction
    print("\n1️⃣ Testing Weather-Enhanced Safety Score Prediction")
    safety_request = {
        "location_risk": 6,
        "group_size": 2,
        "experience_level": "intermediate",
        "has_itinerary": True,
        "age": 28,
        "health_score": 7,
        "state": "Delhi",
        "district": "Central Delhi",
        "city": "New Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/weather/safety-score",
            json=safety_request,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather-Enhanced Safety Score Prediction Successful!")
            print(f"   Overall Safety Score: {data['safety_score']}")
            print(f"   Weather Safety Score: {data['weather_safety_score']}")
            print(f"   Weather Risk Score: {data['weather_risk_score']}")
            print(f"   NCRB Risk Score: {data['ncrb_risk_score']}")
            print(f"   Enhanced Location Risk: {data['enhanced_location_risk']}")
            print(f"   Confidence: {data['confidence']}")
            print(f"   Total Recommendations: {len(data['recommendations'])}")
            
            # Show weather conditions
            weather_conditions = data.get('weather_conditions', {})
            if weather_conditions:
                print(f"   Current Temperature: {weather_conditions.get('temp', 'N/A')}°C")
                print(f"   Weather Conditions: {weather_conditions.get('conditions', 'N/A')}")
                print(f"   Humidity: {weather_conditions.get('humidity', 'N/A')}%")
                print(f"   Wind Speed: {weather_conditions.get('windspeed', 'N/A')} km/h")
                print(f"   Visibility: {weather_conditions.get('visibility', 'N/A')} km")
                print(f"   UV Index: {weather_conditions.get('uvindex', 'N/A')}")
            
            # Show first few recommendations
            print("   Key Recommendations:")
            for i, rec in enumerate(data['recommendations'][:5]):
                print(f"   - {rec}")
        else:
            print(f"❌ Weather-Enhanced Safety Score Prediction Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 2: Get Current Weather
    print("\n2️⃣ Testing Current Weather Retrieval")
    try:
        response = requests.post(
            f"{base_url}/api/weather/current",
            json={"location": "Delhi,India", "days": 1},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Current Weather Retrieval Successful!")
            print(f"   Location: {data['location']}")
            
            current_weather = data['current_weather']
            print(f"   Temperature: {current_weather.get('temp', 'N/A')}°C")
            print(f"   Conditions: {current_weather.get('conditions', 'N/A')}")
            print(f"   Humidity: {current_weather.get('humidity', 'N/A')}%")
            print(f"   Wind Speed: {current_weather.get('windspeed', 'N/A')} km/h")
            print(f"   Visibility: {current_weather.get('visibility', 'N/A')} km")
            print(f"   UV Index: {current_weather.get('uvindex', 'N/A')}")
            
            # Show weather safety analysis
            safety_analysis = data.get('weather_safety_analysis', {})
            if safety_analysis:
                print(f"   Weather Safety Score: {safety_analysis.get('weather_safety_score', 'N/A')}")
                print(f"   Weather Recommendations: {len(safety_analysis.get('recommendations', []))}")
        else:
            print(f"❌ Current Weather Retrieval Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 3: Get Weather Forecast
    print("\n3️⃣ Testing Weather Forecast Retrieval")
    try:
        response = requests.get(
            f"{base_url}/api/weather/forecast/Delhi,India",
            params={"days": 7},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather Forecast Retrieval Successful!")
            print(f"   Location: {data['location']}")
            print(f"   Forecast Days: {data['forecast_days']}")
            
            forecast = data.get('forecast', {})
            if forecast and 'forecast' in forecast:
                print(f"   Forecast Data Points: {len(forecast['forecast'])}")
                # Show first 3 days
                for i, day in enumerate(forecast['forecast'][:3]):
                    print(f"   Day {i+1}: {day.get('date')} - {day.get('conditions')} "
                          f"(High: {day.get('temp_max')}°C, Low: {day.get('temp_min')}°C)")
        else:
            print(f"❌ Weather Forecast Retrieval Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 4: Get Weather Alerts
    print("\n4️⃣ Testing Weather Alerts Retrieval")
    try:
        response = requests.get(
            f"{base_url}/api/weather/alerts/Delhi,India",
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather Alerts Retrieval Successful!")
            print(f"   Location: {data['location']}")
            print(f"   Total Alerts: {data['alert_count']}")
            print(f"   High Priority Alerts: {data['high_priority_alerts']}")
            
            alerts = data.get('alerts', [])
            if alerts:
                print("   Active Alerts:")
                for alert in alerts[:3]:  # Show first 3 alerts
                    alert_info = alert.get('alert', {})
                    print(f"   - {alert_info.get('event', 'Unknown')}: {alert_info.get('description', 'No description')}")
        else:
            print(f"❌ Weather Alerts Retrieval Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 5: Get Weather Safety Analysis
    print("\n5️⃣ Testing Weather Safety Analysis")
    try:
        response = requests.get(
            f"{base_url}/api/weather/safety-analysis/Delhi,India",
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather Safety Analysis Successful!")
            print(f"   Location: {data['location']}")
            
            analysis = data.get('analysis', {})
            if analysis:
                print(f"   Weather Safety Score: {analysis.get('weather_safety_score', 'N/A')}")
                
                weather_conditions = analysis.get('weather_conditions', {})
                if weather_conditions:
                    print(f"   Temperature: {weather_conditions.get('temperature', 'N/A')}°C")
                    print(f"   Conditions: {weather_conditions.get('conditions', 'N/A')}")
                    print(f"   Humidity: {weather_conditions.get('humidity', 'N/A')}%")
                    print(f"   Wind Speed: {weather_conditions.get('wind_speed', 'N/A')} km/h")
                    print(f"   Visibility: {weather_conditions.get('visibility', 'N/A')} km")
                    print(f"   UV Index: {weather_conditions.get('uv_index', 'N/A')}")
                
                safety_factors = analysis.get('safety_factors', {})
                if safety_factors:
                    print("   Safety Factor Analysis:")
                    for factor, level in safety_factors.items():
                        print(f"   - {factor.replace('_', ' ').title()}: {level}")
                
                recommendations = analysis.get('recommendations', [])
                print(f"   Weather Recommendations: {len(recommendations)}")
                for i, rec in enumerate(recommendations[:3]):
                    print(f"   - {rec}")
        else:
            print(f"❌ Weather Safety Analysis Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Weather Integration Testing Complete!")

def test_model_training_with_weather():
    """Test the enhanced model training with weather data"""
    print("\n🤖 Testing Enhanced Model Training with Weather Data")
    print("=" * 50)
    
    try:
        # Import the training module
        from backend.app.train_model import main as train_main
        
        print("Training model with NCRB and Weather enhanced data...")
        train_main()
        print("✅ Model training completed successfully!")
        
    except Exception as e:
        print(f"❌ Model training failed: {e}")

def test_weather_service_directly():
    """Test the weather service directly"""
    print("\n🌤️ Testing Weather Service Directly")
    print("=" * 50)
    
    try:
        from backend.app.services.weather_service import weather_service
        
        # Test current weather
        print("Testing current weather for Delhi...")
        weather_data = weather_service.get_current_weather("Delhi,India")
        print(f"✅ Current Weather Retrieved:")
        print(f"   Temperature: {weather_data.get('temp', 'N/A')}°C")
        print(f"   Conditions: {weather_data.get('conditions', 'N/A')}")
        print(f"   Humidity: {weather_data.get('humidity', 'N/A')}%")
        
        # Test weather safety analysis
        print("\nTesting weather safety analysis...")
        safety_analysis = weather_service.calculate_weather_safety_score("Delhi,India")
        print(f"✅ Weather Safety Analysis:")
        print(f"   Weather Safety Score: {safety_analysis.get('weather_safety_score', 'N/A')}")
        print(f"   Recommendations: {len(safety_analysis.get('recommendations', []))}")
        
        # Test forecast
        print("\nTesting weather forecast...")
        forecast = weather_service.get_weather_forecast("Delhi,India", 3)
        print(f"✅ Weather Forecast Retrieved:")
        print(f"   Location: {forecast.get('location', 'N/A')}")
        print(f"   Forecast Days: {len(forecast.get('forecast', []))}")
        
    except Exception as e:
        print(f"❌ Weather service test failed: {e}")

if __name__ == "__main__":
    print("🚀 Starting Weather API Integration Tests")
    print(f"⏰ Test started at: {datetime.now().isoformat()}")
    
    # Test the weather service directly first
    test_weather_service_directly()
    
    # Test the API endpoints
    test_weather_integration()
    
    # Test model training
    test_model_training_with_weather()
    
    print(f"\n⏰ Test completed at: {datetime.now().isoformat()}")
    print("🎉 All weather integration tests completed!")

