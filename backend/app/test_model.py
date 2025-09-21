# Script to test the TouristSafetyScoreModel

import sys
import os

# Add the current directory to the path so we can import the modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_models import TouristSafetyScoreModel
from config import settings

def main():
    print("Testing TouristSafetyScoreModel...")
    model = TouristSafetyScoreModel()
    
    # Test cases
    test_cases = [
        {
            'location_risk': 8,
            'group_size': 1,
            'experience_level': 'beginner',
            'has_itinerary': False,
            'age': 25,
            'health_score': 7,
            'description': 'High risk solo beginner traveler'
        },
        {
            'location_risk': 3,
            'group_size': 4,
            'experience_level': 'expert',
            'has_itinerary': True,
            'age': 35,
            'health_score': 9,
            'description': 'Low risk group expert traveler'
        },
        {
            'location_risk': 5,
            'group_size': 2,
            'experience_level': 'intermediate',
            'has_itinerary': True,
            'age': 30,
            'health_score': 8,
            'description': 'Medium risk intermediate traveler'
        }
    ]
    
    print(f"\nModel files location:")
    print(f"Model: {settings.SAFETY_MODEL_PATH}")
    print(f"Scaler: {settings.SAFETY_SCALER_PATH}")
    print("\nPrediction results:")
    
    for i, test in enumerate(test_cases, 1):
        description = test.pop('description')
        score = model.predict_safety_score(test)
        print(f"Test {i} ({description}): Safety Score = {score}/10")

if __name__ == "__main__":
    main()