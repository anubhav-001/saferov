# Predictive Analytics Module

## Overview

The Predictive Analytics module enhances the Smart Tourist Safety System with advanced forecasting capabilities. It consists of two main components:

1. **TouristFlowPredictor**: Forecasts tourist density at specific locations based on temporal and environmental factors
2. **IncidentPredictor**: Calculates the probability of safety incidents occurring based on multiple risk factors

## Features

### Tourist Flow Prediction

- Predicts tourist density at specific locations and times
- Considers temporal factors (hour, day, month, weekday, etc.)
- Incorporates weather conditions and local events
- Provides numerical estimates of expected tourist numbers

### Incident Probability Prediction

- Calculates the likelihood of safety incidents
- Analyzes multiple risk factors:
  - Location risk score
  - Tourist density
  - Tourist safety profile
  - Environmental conditions
- Categorizes risk as low, medium, or high

## Implementation Details

### TouristFlowPredictor

```python
class TouristFlowPredictor:
    def __init__(self):
        self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
```

The TouristFlowPredictor uses a Gradient Boosting Regressor model to predict tourist numbers. Key methods include:

- `prepare_time_features()`: Extracts temporal features from timestamps
- `predict_tourist_flow()`: Generates predictions for specific locations and times
- `_get_weather_score()`: Evaluates weather favorability (placeholder for API integration)
- `_get_event_score()`: Assesses impact of local events (placeholder for API integration)

### IncidentPredictor

```python
class IncidentPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=200, random_state=42)
        self.is_trained = False
```

The IncidentPredictor uses a Random Forest Classifier to estimate incident probabilities. The main method is:

- `predict_incident_probability()`: Calculates incident likelihood based on location, tourist, and environmental data

## API Endpoints

### Tourist Flow Prediction

```
POST /api/predict/tourist-flow
```

**Request Body:**
```json
{
  "location_id": 1,
  "timestamp": "2023-09-15T14:30:00"  // Optional, defaults to current time
}
```

**Response:**
```json
{
  "status": "ok",
  "location_id": 1,
  "timestamp": "2023-09-15T14:30:00",
  "predicted_tourist_flow": 120
}
```

### Incident Probability Prediction

```
POST /api/predict/incident-probability
```

**Request Body:**
```json
{
  "location_data": {
    "risk_score": 5,
    "tourist_density": 50
  },
  "tourist_data": {
    "safety_score": 7,
    "experience_level_score": 6
  },
  "environmental_data": {
    "weather_score": 3,
    "time_of_day_risk": 4,
    "visibility_score": 8
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "incident_probability": 0.35,
  "risk_level": "medium"
}
```

## Integration with SmartTouristSafetySystem

The predictive analytics components are integrated into the main `SmartTouristSafetySystem` class:

```python
class SmartTouristSafetySystem:
  def __init__(self):
    self.safety_model = TouristSafetyScoreModel()
    self.geo_fencing = GeoFencingSystem()
    self.flow_predictor = TouristFlowPredictor()
    self.incident_predictor = IncidentPredictor()
```

The `process_tourist_data()` method now includes tourist flow and incident probability predictions when location data is available.

## Model Training and Storage

The predictive models can be trained with historical data and stored for future use. The system looks for trained models at these paths:

- Tourist Flow Model: `settings.FLOW_MODEL_PATH`
- Tourist Flow Scaler: `settings.FLOW_SCALER_PATH`
- Incident Predictor Model: `settings.INCIDENT_MODEL_PATH`

If models are not found, the system falls back to default values.

## Testing

Two test scripts are provided to verify functionality:

1. `test_predictive_analytics.py`: Tests the core predictive components
2. `test_predictive_api.py`: Tests the API endpoints

Run these scripts to ensure proper operation of the predictive analytics module.

## Future Enhancements

- Implement actual weather API integration
- Add event database integration
- Create model training endpoints
- Develop visualization tools for predictions
- Implement automated model retraining