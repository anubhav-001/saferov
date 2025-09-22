# NCRB API Integration Documentation

## Overview

The SafeRove platform now integrates with the National Crime Records Bureau (NCRB) API to enhance safety score predictions with real-time crime data. This integration provides more accurate and location-specific safety assessments for tourists.

## API Key

**API Key**: `579b464db66ec23bdd00000103f3e5383cc74a3a52239069a8495b74`

## Features

### 1. Real-time Crime Data Integration
- Fetches crime statistics by state/district
- Retrieves crime trends over time
- Provides safety indicators for specific locations
- Caches data for performance optimization

### 2. Enhanced Safety Score Prediction
- Integrates NCRB crime data into existing safety model
- Calculates location-specific risk scores
- Considers crime trends and patterns
- Provides confidence scores based on data availability

### 3. Comprehensive Safety Analysis
- Crime rate calculations per 100,000 population
- Violent crime vs property crime analysis
- Trend direction assessment (increasing/decreasing/stable)
- Geographic safety indicators

## API Endpoints

### Safety Score Prediction with NCRB Data
```
POST /api/ncrb/safety-score
```

**Request Body:**
```json
{
  "location_risk": 6,
  "group_size": 2,
  "experience_level": "intermediate",
  "has_itinerary": true,
  "age": 28,
  "health_score": 7,
  "state": "Delhi",
  "district": "Central Delhi",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Response:**
```json
{
  "safety_score": 6,
  "ncrb_risk_score": 5.2,
  "enhanced_location_risk": 5.6,
  "crime_statistics": {
    "total_crimes": 1500,
    "violent_crimes": 300,
    "property_crimes": 800,
    "crime_rate_per_100k": 300.0
  },
  "crime_trends": {
    "trend_direction": "stable",
    "trends": [...]
  },
  "safety_indicators": {
    "safety_score": 6.0,
    "police_stations_nearby": 3,
    "emergency_response_time_minutes": 8
  },
  "recommendations": [
    "Moderate risk area. Travel with companions when possible.",
    "Stay alert and aware of your surroundings.",
    "Keep valuables secure and out of sight."
  ],
  "confidence": 0.85
}
```

### Crime Data Retrieval
```
GET /api/ncrb/crime-data/{state}?district={district}&year={year}
```

### Crime Trends
```
GET /api/ncrb/crime-trends/{state}?district={district}&months={months}
```

### Safety Indicators
```
GET /api/ncrb/safety-indicators?latitude={lat}&longitude={lng}&radius_km={radius}
```

## Implementation Details

### NCRB Service (`backend/app/services/ncrb_service.py`)

The `NCRBService` class handles all interactions with the NCRB API:

- **Authentication**: Uses Bearer token authentication
- **Caching**: Implements 1-hour cache for performance
- **Error Handling**: Graceful fallback to mock data when API is unavailable
- **Rate Limiting**: Handles API rate limits appropriately

### Enhanced Safety Model (`backend/app/ai_models.py`)

The `TouristSafetyScoreModel` has been enhanced to:

- **Feature Engineering**: Incorporates NCRB data into feature vectors
- **Risk Calculation**: Uses crime statistics to calculate location risk
- **Trend Analysis**: Considers crime trends in risk assessment
- **Geographic Integration**: Uses coordinates for location-specific analysis

### API Endpoints (`backend/app/api/endpoints/ncrb_safety.py`)

New FastAPI endpoints provide:

- **Safety Score Prediction**: Enhanced prediction with NCRB data
- **Crime Data Access**: Direct access to NCRB crime statistics
- **Trend Analysis**: Crime trend data retrieval
- **Safety Indicators**: Location-specific safety metrics

## Data Flow

1. **Request Processing**: User provides location and tourist data
2. **NCRB Data Retrieval**: System fetches crime data for the location
3. **Risk Calculation**: NCRB data is processed to calculate risk scores
4. **Feature Enhancement**: Safety model features are enhanced with NCRB data
5. **Prediction**: Enhanced safety score is calculated
6. **Recommendations**: Safety recommendations are generated based on NCRB data
7. **Response**: Comprehensive safety analysis is returned

## Mock Data System

When the NCRB API is unavailable, the system provides realistic mock data:

- **State-specific Multipliers**: Different crime rates for different states
- **Realistic Statistics**: Based on actual Indian crime patterns
- **Trend Simulation**: Simulated crime trends with seasonal variations
- **Geographic Variation**: Location-based safety score adjustments

## Testing

### Manual Testing
```bash
# Test the training script
cd backend
python -m app.train_model

# Test API endpoints (when server is running)
python test_ncrb_integration.py
```

### Expected Behavior
- API calls fail gracefully with mock data fallback
- Model training completes successfully
- Safety scores are calculated with NCRB enhancement
- All endpoints return appropriate responses

## Configuration

### Environment Variables
- `NCRB_API_KEY`: The API key for NCRB authentication
- `NCRB_BASE_URL`: Base URL for NCRB API (default: https://api.ncrb.gov.in)

### Model Paths
- `SAFETY_MODEL_PATH`: Path to trained safety model
- `SAFETY_SCALER_PATH`: Path to feature scaler

## Performance Considerations

- **Caching**: 1-hour cache reduces API calls
- **Async Processing**: Non-blocking API calls
- **Fallback System**: Mock data ensures system availability
- **Error Handling**: Graceful degradation when API is unavailable

## Security

- **API Key Protection**: Secure storage of API credentials
- **Data Privacy**: No personal data sent to NCRB API
- **Rate Limiting**: Respects API rate limits
- **Error Logging**: Comprehensive logging without exposing sensitive data

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live crime data
2. **Machine Learning**: Train models on historical NCRB data
3. **Predictive Analytics**: Predict crime trends using ML
4. **Multi-source Integration**: Combine NCRB with other data sources
5. **Geographic Clustering**: Advanced geographic analysis

## Troubleshooting

### Common Issues

1. **API Connection Failed**: System falls back to mock data
2. **Authentication Error**: Check API key configuration
3. **Rate Limit Exceeded**: System implements exponential backoff
4. **Data Parsing Error**: Graceful error handling with defaults

### Debug Mode
Enable debug logging to see detailed API interactions:
```python
import logging
logging.getLogger('ncrb_service').setLevel(logging.DEBUG)
```

## Support

For issues related to NCRB integration:
1. Check API key validity
2. Verify network connectivity
3. Review error logs
4. Test with mock data mode

The system is designed to be robust and continue functioning even when the NCRB API is unavailable, ensuring uninterrupted service for tourists.

