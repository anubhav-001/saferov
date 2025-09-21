import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_tourist_flow_prediction_api():
    print("\n=== Testing Tourist Flow Prediction API ===\n")
    
    # Endpoint URL
    url = f"{BASE_URL}/api/predict/tourist-flow"
    
    # Test locations
    test_locations = [1, 5, 10]  # Assuming these are valid location IDs
    
    # Test different times
    now = datetime.now()
    test_times = [
        None,  # Current time (will be handled by the API)
        (now + timedelta(hours=6)).isoformat(),  # 6 hours later
        (now + timedelta(days=1)).isoformat(),  # Tomorrow
    ]
    
    # Test predictions
    for location_id in test_locations:
        print(f"\nLocation ID: {location_id}")
        for timestamp in test_times:
            payload = {"location_id": location_id}
            if timestamp:
                payload["timestamp"] = timestamp
                time_str = datetime.fromisoformat(timestamp).strftime("%Y-%m-%d %H:%M")
                print(f"  Time: {time_str}")
            else:
                print(f"  Time: Current time")
            
            try:
                response = requests.post(url, json=payload)
                if response.status_code == 200:
                    result = response.json()
                    print(f"  Predicted tourist flow: {result['predicted_tourist_flow']}")
                else:
                    print(f"  Error: {response.status_code} - {response.text}")
            except Exception as e:
                print(f"  Exception: {str(e)}")

def test_incident_prediction_api():
    print("\n=== Testing Incident Prediction API ===\n")
    
    # Endpoint URL
    url = f"{BASE_URL}/api/predict/incident-probability"
    
    # Test scenarios
    test_scenarios = [
        # Low risk scenario
        {
            "location_data": {"risk_score": 2, "tourist_density": 20},
            "tourist_data": {"safety_score": 8, "experience_level_score": 7},
            "environmental_data": {"weather_score": 2, "time_of_day_risk": 2, "visibility_score": 9}
        },
        # Medium risk scenario
        {
            "location_data": {"risk_score": 5, "tourist_density": 50},
            "tourist_data": {"safety_score": 5, "experience_level_score": 5},
            "environmental_data": {"weather_score": 5, "time_of_day_risk": 5, "visibility_score": 5}
        },
        # High risk scenario
        {
            "location_data": {"risk_score": 8, "tourist_density": 90},
            "tourist_data": {"safety_score": 3, "experience_level_score": 2},
            "environmental_data": {"weather_score": 7, "time_of_day_risk": 8, "visibility_score": 3}
        }
    ]
    
    # Test predictions
    for i, scenario in enumerate(test_scenarios):
        risk_level = "Low" if i == 0 else "Medium" if i == 1 else "High"
        print(f"\nScenario {i+1} ({risk_level} risk):")
        
        try:
            response = requests.post(url, json=scenario)
            if response.status_code == 200:
                result = response.json()
                print(f"  Incident probability: {result['incident_probability']:.2f}")
                print(f"  Risk level: {result['risk_level']}")
            else:
                print(f"  Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"  Exception: {str(e)}")

if __name__ == "__main__":
    print("\n===== TESTING PREDICTIVE ANALYTICS API ENDPOINTS =====\n")
    print("Note: Make sure the FastAPI server is running on http://localhost:8000")
    
    # Test the tourist flow prediction API
    test_tourist_flow_prediction_api()
    
    # Test the incident prediction API
    test_incident_prediction_api()
    
    print("\n===== API TESTS COMPLETED =====\n")