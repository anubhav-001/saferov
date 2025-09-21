# Script to train and save the TouristSafetyScoreModel

import sys
import os

# Add the current directory to the path so we can import the modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_models import TouristSafetyScoreModel
from config import settings

# Sample training data
training_data = [
    {
        'location_risk': 8,
        'group_size': 1,
        'experience_level': 'beginner',
        'has_itinerary': False,
        'age': 25,
        'health_score': 7,
        'safety_score': 3
    },
    {
        'location_risk': 3,
        'group_size': 4,
        'experience_level': 'expert',
        'has_itinerary': True,
        'age': 35,
        'health_score': 9,
        'safety_score': 9
    },
    {
        'location_risk': 5,
        'group_size': 2,
        'experience_level': 'intermediate',
        'has_itinerary': True,
        'age': 30,
        'health_score': 8,
        'safety_score': 7
    },
    {
        'location_risk': 7,
        'group_size': 1,
        'experience_level': 'beginner',
        'has_itinerary': False,
        'age': 22,
        'health_score': 6,
        'safety_score': 4
    },
    {
        'location_risk': 2,
        'group_size': 3,
        'experience_level': 'expert',
        'has_itinerary': True,
        'age': 40,
        'health_score': 9,
        'safety_score': 9
    }
]

def main():
    print("Training TouristSafetyScoreModel...")
    model = TouristSafetyScoreModel()
    model.train_model(training_data)
    print("Model trained and saved successfully!")
    
    # Test prediction
    test_data = {
        'location_risk': 6,
        'group_size': 2,
        'experience_level': 'intermediate',
        'has_itinerary': True,
        'age': 28,
        'health_score': 7
    }
    score = model.predict_safety_score(test_data)
    print(f"Predicted safety score for test data: {score}")

if __name__ == "__main__":
    main()