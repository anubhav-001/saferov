import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ai_models import TouristFlowPredictor, IncidentPredictor
from datetime import datetime, timedelta
import numpy as np

def test_tourist_flow_predictor():
    print("\n=== Testing TouristFlowPredictor ===\n")
    
    # Initialize the predictor
    flow_predictor = TouristFlowPredictor()
    
    # Test locations (location IDs)
    test_locations = [1, 5, 10]  # Assuming these are valid location IDs
    
    # Test different times
    now = datetime.now()
    test_times = [
        now.isoformat(),  # Current time
        (now + timedelta(hours=6)).isoformat(),  # 6 hours later
        (now + timedelta(days=1)).isoformat(),  # Tomorrow
        (now + timedelta(days=7)).isoformat()  # Next week
    ]
    
    # Test predictions
    for location_id in test_locations:
        print(f"\nLocation ID: {location_id}")
        for timestamp in test_times:
            dt = datetime.fromisoformat(timestamp)
            time_str = dt.strftime("%Y-%m-%d %H:%M")
            predicted_flow = flow_predictor.predict_tourist_flow(location_id, timestamp)
            print(f"  Time: {time_str} - Predicted tourist flow: {predicted_flow}")

def test_incident_predictor():
    print("\n=== Testing IncidentPredictor ===\n")
    
    # Initialize the predictor
    incident_predictor = IncidentPredictor()
    
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
        print(f"  Location data: {scenario['location_data']}")
        print(f"  Tourist data: {scenario['tourist_data']}")
        print(f"  Environmental data: {scenario['environmental_data']}")
        
        probability = incident_predictor.predict_incident_probability(
            scenario["location_data"],
            scenario["tourist_data"],
            scenario["environmental_data"]
        )
        
        risk_category = "high" if probability > 0.7 else "medium" if probability > 0.3 else "low"
        print(f"  Incident probability: {probability:.2f} (Risk level: {risk_category})")

def test_time_features():
    print("\n=== Testing Time Features Extraction ===\n")
    
    flow_predictor = TouristFlowPredictor()
    
    # Test different dates
    test_dates = [
        datetime.now(),
        datetime(2023, 1, 1, 12, 0),  # New Year's Day at noon
        datetime(2023, 7, 4, 18, 0),  # July 4th evening
        datetime(2023, 12, 25, 9, 0)  # Christmas morning
    ]
    
    for dt in test_dates:
        features = flow_predictor.prepare_time_features(dt.isoformat())
        print(f"Date: {dt.strftime('%Y-%m-%d %H:%M')}")
        print(f"  Hour: {features[0]}")
        print(f"  Day: {features[1]}")
        print(f"  Month: {features[2]}")
        print(f"  Weekday: {features[3]}")
        print(f"  Week of year: {features[4]}")
        print(f"  Day of year: {features[5]}")
        print()

if __name__ == "__main__":
    print("\n===== TESTING PREDICTIVE ANALYTICS COMPONENTS =====\n")
    
    # Test the time features extraction
    test_time_features()
    
    # Test the tourist flow predictor
    test_tourist_flow_predictor()
    
    # Test the incident predictor
    test_incident_predictor()
    
    print("\n===== ALL TESTS COMPLETED =====\n")