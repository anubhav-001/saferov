# Geo-Fencing & Risk Assessment System

## Overview

The Geo-Fencing System is a critical component of the Smart Tourist Safety platform that provides real-time location-based risk assessment and alerting. The system allows for defining geographical risk zones with varying risk levels and automatically generates alerts when tourists enter high-risk areas.

## Features

- **Risk Zone Management**: Define polygonal risk zones with custom risk levels (1-10 scale)
- **Real-time Location Risk Assessment**: Check if a tourist's location falls within any defined risk zones
- **Automated Alert Generation**: Generate alerts when tourists enter high-risk areas
- **Emergency Notification**: Send SMS alerts to emergency contacts via Twilio integration
- **API Integration**: Fully integrated with the Smart Tourist Safety API

## Implementation Details

### Core Components

1. **GeoFencingSystem Class**: Main implementation in `ai_models.py`
2. **API Endpoints**: Defined in `main.py`
3. **Configuration**: Twilio integration settings in `config.py`

### Dependencies

- **Shapely**: For geometric operations (point-in-polygon checks)
- **Twilio**: For sending emergency SMS alerts

## API Endpoints

### 1. Add Risk Zone

```
POST /api/geo/risk-zone
```

Request Body:
```json
{
  "zone_id": "delhi_red_fort",
  "coordinates": [
    [28.656450, 77.241500],
    [28.656450, 77.244000],
    [28.654000, 77.244000],
    [28.654000, 77.241500]
  ],
  "risk_level": 8
}
```

### 2. Check Location Risk

```
POST /api/geo/check-location
```

Request Body:
```json
{
  "latitude": 28.655000,
  "longitude": 77.242500
}
```

### 3. Generate Alert

```
POST /api/geo/alert/{tourist_id}
```

Request Body:
```json
{
  "latitude": 28.655000,
  "longitude": 77.242500
}
```

## Integration with SmartTouristSafetySystem

The GeoFencingSystem is integrated with the SmartTouristSafetySystem class to provide comprehensive safety monitoring. When tourist location data is processed, the system automatically checks for geo-fence breaches and generates alerts when necessary.

## Testing

A test script (`test_geofencing.py`) is provided to verify the functionality of the GeoFencingSystem. The test script:

1. Creates sample risk zones
2. Tests location risk assessment for various coordinates
3. Verifies alert generation functionality

Run the test with:
```
python test_geofencing.py
```

## Configuration

The following configuration settings are available in `config.py`:

- `TWILIO_ACCOUNT_SID`: Twilio account SID for SMS alerts
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for sending alerts
- `EMERGENCY_CONTACT_NUMBER`: Default emergency contact number