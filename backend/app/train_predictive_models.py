import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ai_models import TouristFlowPredictor, IncidentPredictor
from app.config import settings
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import random

# Ensure models directory exists
os.makedirs(os.path.dirname(settings.FLOW_MODEL_PATH), exist_ok=True)

def generate_synthetic_tourist_flow_data(num_samples=1000):
    """Generate synthetic data for tourist flow prediction"""
    print("Generating synthetic tourist flow training data...")
    
    data = []
    
    # Generate data for multiple locations
    location_ids = list(range(1, 11))  # 10 locations
    
    # Start date for data generation
    start_date = datetime.now() - timedelta(days=365)  # 1 year of data
    
    for _ in range(num_samples):
        # Random location
        location_id = random.choice(location_ids)
        
        # Random date within the past year
        days_offset = random.randint(0, 365)
        hours_offset = random.randint(0, 23)
        timestamp = start_date + timedelta(days=days_offset, hours=hours_offset)
        
        # Extract time features
        hour = timestamp.hour
        day = timestamp.day
        month = timestamp.month
        weekday = timestamp.weekday()
        week = int(timestamp.strftime('%W'))
        day_of_year = int(timestamp.strftime('%j'))
        
        # Generate weather and event scores
        # Higher scores on weekends and holidays
        is_weekend = weekday >= 5
        is_summer = 6 <= month <= 8
        weather_score = random.randint(6, 10) if is_summer else random.randint(3, 8)
        event_score = random.randint(7, 10) if is_weekend else random.randint(2, 6)
        
        # Generate tourist flow (target variable)
        # Base flow depends on location
        base_flow = location_id * 10
        
        # Adjust for time factors
        time_factor = 1.5 if (9 <= hour <= 17) else 0.7  # Higher during day
        season_factor = 1.3 if is_summer else 0.9  # Higher in summer
        weekend_factor = 1.4 if is_weekend else 1.0  # Higher on weekends
        
        # Calculate flow with some randomness
        tourist_flow = int(base_flow * time_factor * season_factor * weekend_factor * 
                          (0.8 + 0.4 * random.random()))
        
        # Create feature vector
        features = [hour, day, month, weekday, week, day_of_year, 
                   location_id, weather_score, event_score]
        
        # Add to dataset
        data.append(features + [tourist_flow])
    
    # Create DataFrame
    columns = ['hour', 'day', 'month', 'weekday', 'week', 'day_of_year', 
               'location_id', 'weather_score', 'event_score', 'tourist_flow']
    df = pd.DataFrame(data, columns=columns)
    
    return df

def generate_synthetic_incident_data(num_samples=1000):
    """Generate synthetic data for incident prediction"""
    print("Generating synthetic incident prediction training data...")
    
    data = []
    
    for _ in range(num_samples):
        # Generate risk factors
        location_risk = random.randint(1, 10)
        tourist_density = random.randint(10, 100)
        safety_score = random.randint(1, 10)
        experience_level = random.randint(1, 10)
        weather_score = random.randint(1, 10)
        time_risk = random.randint(1, 10)
        visibility = random.randint(1, 10)
        
        # Calculate incident probability based on risk factors
        # Higher location risk, tourist density, time risk increase probability
        # Higher safety score, experience level, visibility decrease probability
        incident_prob = (
            0.1 * location_risk + 
            0.05 * (tourist_density / 10) + 
            0.1 * (11 - safety_score) +  # Invert safety score
            0.1 * (11 - experience_level) +  # Invert experience level
            0.05 * weather_score + 
            0.1 * time_risk + 
            0.1 * (11 - visibility)  # Invert visibility
        ) / 6.0  # Normalize to 0-1 range
        
        # Add some randomness
        incident_prob = max(0.01, min(0.99, incident_prob + random.uniform(-0.1, 0.1)))
        
        # Binary incident outcome (1 = incident occurred, 0 = no incident)
        incident = 1 if random.random() < incident_prob else 0
        
        # Create feature vector
        features = [location_risk, tourist_density, safety_score, experience_level, 
                   weather_score, time_risk, visibility]
        
        # Add to dataset
        data.append(features + [incident])
    
    # Create DataFrame
    columns = ['location_risk', 'tourist_density', 'safety_score', 'experience_level', 
               'weather_score', 'time_risk', 'visibility', 'incident']
    df = pd.DataFrame(data, columns=columns)
    
    return df

def train_tourist_flow_model():
    """Train and save the tourist flow prediction model"""
    print("\n=== Training Tourist Flow Prediction Model ===\n")
    
    # Generate or load training data
    df = generate_synthetic_tourist_flow_data(2000)
    
    # Split features and target
    X = df.drop('tourist_flow', axis=1).values
    y = df['tourist_flow'].values
    
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Tourist Flow Model Training Score: {train_score:.4f}")
    print(f"Tourist Flow Model Testing Score: {test_score:.4f}")
    
    # Save model and scaler
    joblib.dump(model, settings.FLOW_MODEL_PATH)
    joblib.dump(scaler, settings.FLOW_SCALER_PATH)
    
    print(f"Tourist flow model saved to {settings.FLOW_MODEL_PATH}")
    print(f"Tourist flow scaler saved to {settings.FLOW_SCALER_PATH}")

def train_incident_model():
    """Train and save the incident prediction model"""
    print("\n=== Training Incident Prediction Model ===\n")
    
    # Generate or load training data
    df = generate_synthetic_incident_data(2000)
    
    # Split features and target
    X = df.drop('incident', axis=1).values
    y = df['incident'].values
    
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Incident Model Training Score: {train_score:.4f}")
    print(f"Incident Model Testing Score: {test_score:.4f}")
    
    # Save model
    joblib.dump(model, settings.INCIDENT_MODEL_PATH)
    
    print(f"Incident prediction model saved to {settings.INCIDENT_MODEL_PATH}")

if __name__ == "__main__":
    print("\n===== TRAINING PREDICTIVE ANALYTICS MODELS =====\n")
    
    # Train the tourist flow prediction model
    train_tourist_flow_model()
    
    # Train the incident prediction model
    train_incident_model()
    
    print("\n===== MODEL TRAINING COMPLETED =====\n")