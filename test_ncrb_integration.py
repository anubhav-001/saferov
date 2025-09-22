#!/usr/bin/env python3
"""
Test script for NCRB API integration with safety score prediction
"""

import sys
import os
import requests
import json
from datetime import datetime

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def test_ncrb_integration():
    """Test the NCRB integration endpoints"""
    
    base_url = "http://localhost:8000"  # Adjust if your server runs on different port
    
    print("🧪 Testing NCRB API Integration")
    print("=" * 50)
    
    # Test 1: Safety Score Prediction with NCRB Data
    print("\n1️⃣ Testing Safety Score Prediction with NCRB Data")
    safety_request = {
        "location_risk": 6,
        "group_size": 2,
        "experience_level": "intermediate",
        "has_itinerary": True,
        "age": 28,
        "health_score": 7,
        "state": "Delhi",
        "district": "Central Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/ncrb/safety-score",
            json=safety_request,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Safety Score Prediction Successful!")
            print(f"   Safety Score: {data['safety_score']}")
            print(f"   NCRB Risk Score: {data['ncrb_risk_score']}")
            print(f"   Enhanced Location Risk: {data['enhanced_location_risk']}")
            print(f"   Confidence: {data['confidence']}")
            print(f"   Recommendations: {len(data['recommendations'])} items")
            
            # Show first few recommendations
            for i, rec in enumerate(data['recommendations'][:3]):
                print(f"   - {rec}")
        else:
            print(f"❌ Safety Score Prediction Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 2: Get Crime Data
    print("\n2️⃣ Testing Crime Data Retrieval")
    try:
        response = requests.get(
            f"{base_url}/api/ncrb/crime-data/Delhi",
            params={"district": "Central Delhi", "year": 2024},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Crime Data Retrieval Successful!")
            print(f"   State: {data['state']}")
            print(f"   District: {data['district']}")
            print(f"   Year: {data['year']}")
            
            crime_stats = data['data']
            print(f"   Total Crimes: {crime_stats.get('total_crimes', 'N/A')}")
            print(f"   Violent Crimes: {crime_stats.get('violent_crimes', 'N/A')}")
            print(f"   Property Crimes: {crime_stats.get('property_crimes', 'N/A')}")
            print(f"   Crime Rate per 100k: {crime_stats.get('crime_rate_per_100k', 'N/A')}")
        else:
            print(f"❌ Crime Data Retrieval Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 3: Get Crime Trends
    print("\n3️⃣ Testing Crime Trends Retrieval")
    try:
        response = requests.get(
            f"{base_url}/api/ncrb/crime-trends/Delhi",
            params={"district": "Central Delhi", "months": 12},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Crime Trends Retrieval Successful!")
            print(f"   State: {data['state']}")
            print(f"   District: {data['district']}")
            print(f"   Trend Period: {data['trend_period_months']} months")
            
            trends = data['trends']
            if 'trend_direction' in trends:
                print(f"   Trend Direction: {trends['trend_direction']}")
            if 'trends' in trends and trends['trends']:
                print(f"   Data Points: {len(trends['trends'])}")
        else:
            print(f"❌ Crime Trends Retrieval Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test 4: Get Safety Indicators
    print("\n4️⃣ Testing Safety Indicators Retrieval")
    try:
        response = requests.get(
            f"{base_url}/api/ncrb/safety-indicators",
            params={
                "latitude": 28.6139,
                "longitude": 77.2090,
                "radius_km": 10
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Safety Indicators Retrieval Successful!")
            print(f"   Latitude: {data['latitude']}")
            print(f"   Longitude: {data['longitude']}")
            print(f"   Radius: {data['radius_km']} km")
            
            indicators = data['indicators']
            print(f"   Safety Score: {indicators.get('safety_score', 'N/A')}")
            print(f"   Crime Density: {indicators.get('crime_density', 'N/A')}")
            print(f"   Police Stations Nearby: {indicators.get('police_stations_nearby', 'N/A')}")
            print(f"   Emergency Response Time: {indicators.get('emergency_response_time_minutes', 'N/A')} minutes")
        else:
            print(f"❌ Safety Indicators Retrieval Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 NCRB Integration Testing Complete!")

def test_model_training():
    """Test the enhanced model training with NCRB data"""
    print("\n🤖 Testing Enhanced Model Training")
    print("=" * 50)
    
    try:
        # Import the training module
        from backend.app.train_model import main as train_main
        
        print("Training model with NCRB-enhanced data...")
        train_main()
        print("✅ Model training completed successfully!")
        
    except Exception as e:
        print(f"❌ Model training failed: {e}")

if __name__ == "__main__":
    print("🚀 Starting NCRB API Integration Tests")
    print(f"⏰ Test started at: {datetime.now().isoformat()}")
    
    # Test the API endpoints
    test_ncrb_integration()
    
    # Test model training
    test_model_training()
    
    print(f"\n⏰ Test completed at: {datetime.now().isoformat()}")
    print("🎉 All tests completed!")

