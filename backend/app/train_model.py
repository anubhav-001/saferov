# Script to train and save the TouristSafetyScoreModel

import sys
import os

# Add the current directory to the path so we can import the modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from .ai_models import TouristSafetyScoreModel
from .config import settings

# Sample training data with NCRB and Weather enhanced features
training_data = [
    {
        'location_risk': 8,
        'group_size': 1,
        'experience_level': 'beginner',
        'has_itinerary': False,
        'age': 25,
        'health_score': 7,
        'state': 'Delhi',
        'district': 'Central Delhi',
        'city': 'New Delhi',
        'latitude': 28.6139,
        'longitude': 77.2090,
        'safety_score': 3
    },
    {
        'location_risk': 3,
        'group_size': 4,
        'experience_level': 'expert',
        'has_itinerary': True,
        'age': 35,
        'health_score': 9,
        'state': 'Karnataka',
        'district': 'Bangalore Urban',
        'city': 'Bangalore',
        'latitude': 12.9716,
        'longitude': 77.5946,
        'safety_score': 9
    },
    {
        'location_risk': 5,
        'group_size': 2,
        'experience_level': 'intermediate',
        'has_itinerary': True,
        'age': 30,
        'health_score': 8,
        'state': 'Tamil Nadu',
        'district': 'Chennai',
        'city': 'Chennai',
        'latitude': 13.0827,
        'longitude': 80.2707,
        'safety_score': 7
    },
    {
        'location_risk': 7,
        'group_size': 1,
        'experience_level': 'beginner',
        'has_itinerary': False,
        'age': 22,
        'health_score': 6,
        'state': 'Maharashtra',
        'district': 'Mumbai',
        'city': 'Mumbai',
        'latitude': 19.0760,
        'longitude': 72.8777,
        'safety_score': 4
    },
    {
        'location_risk': 2,
        'group_size': 3,
        'experience_level': 'expert',
        'has_itinerary': True,
        'age': 40,
        'health_score': 9,
        'state': 'Kerala',
        'district': 'Thiruvananthapuram',
        'city': 'Thiruvananthapuram',
        'latitude': 8.5241,
        'longitude': 76.9366,
        'safety_score': 9
    },
    {
        'location_risk': 6,
        'group_size': 2,
        'experience_level': 'intermediate',
        'has_itinerary': True,
        'age': 28,
        'health_score': 7,
        'state': 'West Bengal',
        'district': 'Kolkata',
        'city': 'Kolkata',
        'latitude': 22.5726,
        'longitude': 88.3639,
        'safety_score': 6
    },
    {
        'location_risk': 9,
        'group_size': 1,
        'experience_level': 'beginner',
        'has_itinerary': False,
        'age': 20,
        'health_score': 5,
        'state': 'Uttar Pradesh',
        'district': 'Lucknow',
        'city': 'Lucknow',
        'latitude': 26.8467,
        'longitude': 80.9462,
        'safety_score': 2
    },
    {
        'location_risk': 4,
        'group_size': 5,
        'experience_level': 'expert',
        'has_itinerary': True,
        'age': 45,
        'health_score': 8,
        'state': 'Rajasthan',
        'district': 'Jaipur',
        'city': 'Jaipur',
        'latitude': 26.9124,
        'longitude': 75.7873,
        'safety_score': 8
    }
]

def main():
    print("Training TouristSafetyScoreModel...")
    model = TouristSafetyScoreModel()
    model.train_model(training_data)
    print("Model trained and saved successfully!")
    
    # Test prediction with NCRB and Weather enhanced data
    test_data = {
        'location_risk': 6,
        'group_size': 2,
        'experience_level': 'intermediate',
        'has_itinerary': True,
        'age': 28,
        'health_score': 7,
        'state': 'Gujarat',
        'district': 'Ahmedabad',
        'city': 'Ahmedabad',
        'latitude': 23.0225,
        'longitude': 72.5714
    }
    score = model.predict_safety_score(test_data)
    print(f"Predicted safety score for test data: {score}")

if __name__ == "__main__":
    main()