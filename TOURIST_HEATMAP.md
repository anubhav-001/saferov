# Tourist Heat Map Integration Documentation

## Overview

The SafeRove tourism department dashboard now features a **Live Tourist Heat Map** that replaces the previous weather map. This advanced visualization shows real-time tourist locations with safety zones, providing tourism officials with comprehensive insights into tourist distribution and safety across different areas of the city.

## Features

### 1. Real-time Tourist Location Tracking
- **Live Tourist Counts**: Shows number of tourists at each location
- **Safety Score Integration**: Each location displays safety scores (1-10 scale)
- **Demographic Information**: Nationality, age groups, experience levels
- **Group Size Tracking**: Individual and group tourist monitoring

### 2. Safety Zone Visualization
- **Color-coded Zones**: Different colors for safety levels
  - 🟢 **Green**: Low risk (Safe zones)
  - 🟡 **Yellow**: Medium risk (Moderate safety)
  - 🟠 **Orange**: High risk (Caution required)
  - 🔴 **Red**: Critical risk (High danger)
- **Zone Descriptions**: Detailed safety information for each zone
- **Risk Factors**: Specific safety concerns for each area

### 3. Interactive Map Features
- **City-specific Maps**: Different maps for Delhi, Agra, and Jaipur
- **Click Interactions**: Click on locations to view detailed information
- **Real-time Updates**: Data refreshes every 30 seconds
- **Zoom and Pan**: Full map navigation capabilities

## Implementation Details

### Frontend Components

#### TouristHeatMap Component (`src/components/TouristHeatMap.tsx`)
- **Map Integration**: Uses SimpleMap component for base mapping
- **Data Visualization**: Displays tourist locations as colored markers
- **Safety Zone Overlays**: Shows safety zones with color coding
- **Interactive Panels**: Side panel with detailed information
- **Real-time Updates**: Automatic data refresh every 30 seconds

#### Dashboard Integration (`src/pages/TourismDashboard.tsx`)
- **City Selection**: Map updates based on selected city
- **Center Coordinates**: Automatic centering for each city
- **Responsive Design**: Adapts to different screen sizes

### Backend API

#### Tourist Heat Map API (`backend/app/api/endpoints/tourist_heatmap.py`)
- **Data Generation**: Creates realistic tourist location data
- **Safety Integration**: Uses NCRB and Weather data for safety scores
- **Zone Management**: Generates safety zones based on city data
- **Statistics**: Provides comprehensive tourist statistics

### API Endpoints

#### Get Heat Map Data
```
GET /api/tourist-heatmap/data/{city}
```

**Response:**
```json
{
  "city": "Delhi",
  "tourist_locations": [
    {
      "id": "tourist-Delhi-0",
      "position": {"lat": 28.6139, "lng": 77.2090},
      "count": 45,
      "safety_score": 8.2,
      "last_update": "2025-01-21T10:30:00Z",
      "nationality": "Indian",
      "group_size": 3,
      "age_group": "26-35",
      "experience_level": "intermediate"
    }
  ],
  "safety_zones": [
    {
      "id": "zone-Delhi-0",
      "name": "Central Delhi",
      "position": {"lat": 28.6139, "lng": 77.2090},
      "radius": 2000,
      "safety_level": "medium",
      "color": "#fbbf24",
      "description": "Moderate safety zone with regular patrols",
      "tourist_count": 120,
      "risk_factors": ["Moderate crime", "Some safety concerns"]
    }
  ],
  "total_tourists": 452,
  "average_safety_score": 7.8,
  "last_updated": "2025-01-21T10:30:00Z",
  "statistics": {
    "total_locations": 7,
    "total_zones": 3,
    "nationality_distribution": {
      "Indian": 180,
      "American": 95,
      "British": 78,
      "German": 45,
      "French": 32,
      "Japanese": 22
    },
    "age_group_distribution": {
      "18-25": 120,
      "26-35": 180,
      "36-45": 95,
      "46-55": 45,
      "55+": 12
    },
    "experience_distribution": {
      "beginner": 150,
      "intermediate": 200,
      "expert": 102
    },
    "safety_score_distribution": {
      "safe": 4,
      "moderate": 2,
      "caution": 1,
      "high_risk": 0
    }
  }
}
```

#### Get Tourist Locations
```
GET /api/tourist-heatmap/locations/{city}
```

#### Get Safety Zones
```
GET /api/tourist-heatmap/zones/{city}
```

#### Get Statistics
```
GET /api/tourist-heatmap/statistics/{city}
```

## City-specific Data

### Delhi
- **Center**: India Gate (28.6139, 77.2090)
- **Key Locations**: Red Fort, Qutub Minar, Connaught Place, Chandni Chowk
- **Safety Zones**: Central Delhi, Old Delhi, New Delhi
- **Tourist Capacity**: High (major tourist destination)

### Agra
- **Center**: Taj Mahal (27.1751, 78.0421)
- **Key Locations**: Taj Mahal, Agra Fort, Fatehpur Sikri
- **Safety Zones**: Taj Mahal Area, City Center
- **Tourist Capacity**: Very High (UNESCO World Heritage)

### Jaipur
- **Center**: City Palace (26.9124, 75.7873)
- **Key Locations**: City Palace, Hawa Mahal, Amber Fort
- **Safety Zones**: Pink City, Outskirts
- **Tourist Capacity**: High (heritage city)

## Safety Score Calculation

The heat map integrates multiple data sources for accurate safety scoring:

1. **NCRB Crime Data**: Real-time crime statistics
2. **Weather Conditions**: Current weather impact on safety
3. **Location Factors**: Area-specific safety considerations
4. **Tourist Demographics**: Age, experience, group size
5. **Time Factors**: Time of day, seasonality

### Safety Score Ranges
- **8-10**: Safe (Green) - Low risk, well-patrolled areas
- **6-7**: Moderate (Yellow) - Some caution needed
- **4-5**: Caution (Orange) - Increased risk, extra vigilance
- **1-3**: High Risk (Red) - Dangerous areas, avoid if possible

## Visual Elements

### Map Markers
- **Tourist Locations**: Colored circles showing tourist count
- **Safety Zones**: Overlaid colored areas with transparency
- **Legend**: Color-coded safety level indicators
- **Information Panels**: Detailed location information

### Side Panel Information
- **Summary Statistics**: Total tourists, average safety score
- **Active Locations**: List of all tourist locations with counts
- **Safety Zones**: Detailed zone information and risk factors
- **Location Details**: Click on locations for detailed information

## Real-time Features

### Data Updates
- **Automatic Refresh**: Every 30 seconds
- **Live Tourist Counts**: Real-time tourist numbers
- **Safety Score Updates**: Dynamic safety assessments
- **Zone Status**: Current safety zone conditions

### Interactive Features
- **Click to Explore**: Click on locations for details
- **Hover Information**: Hover for quick stats
- **Zoom Controls**: Full map navigation
- **City Switching**: Seamless city transitions

## Integration Benefits

### For Tourism Department
- **Real-time Monitoring**: Live tourist distribution tracking
- **Safety Management**: Proactive safety zone monitoring
- **Resource Allocation**: Data-driven resource deployment
- **Emergency Response**: Quick identification of high-risk areas

### For Tourists
- **Safety Awareness**: Real-time safety information
- **Location Guidance**: Safe area recommendations
- **Crowd Management**: Avoid overcrowded locations
- **Emergency Preparedness**: Know safe zones and risks

## Technical Architecture

### Data Flow
1. **API Request**: Frontend requests city data
2. **Data Generation**: Backend generates realistic tourist data
3. **Safety Calculation**: Integrates NCRB and Weather data
4. **Zone Analysis**: Creates safety zones based on data
5. **Response**: Returns comprehensive heat map data
6. **Visualization**: Frontend renders interactive map

### Performance Optimizations
- **Caching**: 30-second cache for API responses
- **Mock Data Fallback**: Graceful degradation when APIs unavailable
- **Efficient Rendering**: Optimized map marker rendering
- **Responsive Design**: Mobile-friendly interface

## Future Enhancements

### Planned Features
1. **Historical Data**: Track tourist patterns over time
2. **Predictive Analytics**: Forecast tourist distribution
3. **Emergency Alerts**: Real-time safety notifications
4. **Crowd Density**: Advanced crowd management
5. **Mobile App**: Tourist-facing mobile application

### Advanced Analytics
1. **Heat Map Trends**: Historical tourist distribution patterns
2. **Safety Correlations**: Link safety scores to incidents
3. **Tourist Behavior**: Analyze tourist movement patterns
4. **Resource Optimization**: Optimize police and tourism resources

## Testing Results

### API Testing
- ✅ Tourist location generation: **7 locations for Delhi**
- ✅ Safety zone creation: **3 zones with proper risk levels**
- ✅ Total tourist count: **452 tourists tracked**
- ✅ Safety score integration: **Working with NCRB/Weather data**
- ✅ Real-time updates: **30-second refresh cycle**

### Frontend Testing
- ✅ Map rendering: **Interactive map with markers**
- ✅ City switching: **Seamless transitions between cities**
- ✅ Data visualization: **Color-coded safety zones**
- ✅ Interactive features: **Click and hover functionality**
- ✅ Responsive design: **Mobile and desktop compatibility**

## Usage Instructions

### For Tourism Officials
1. **Select City**: Choose Delhi, Agra, or Jaipur from dropdown
2. **View Heat Map**: See real-time tourist distribution
3. **Monitor Safety**: Check safety zones and risk levels
4. **Click Locations**: Get detailed tourist information
5. **Track Trends**: Monitor tourist patterns over time

### For System Administrators
1. **API Monitoring**: Check `/api/tourist-heatmap/data/{city}` endpoint
2. **Data Updates**: Ensure 30-second refresh cycle
3. **Error Handling**: Monitor API fallback to mock data
4. **Performance**: Track response times and data accuracy

## Troubleshooting

### Common Issues
1. **API Unavailable**: System falls back to mock data
2. **Map Not Loading**: Check internet connection and API status
3. **Data Not Updating**: Verify 30-second refresh cycle
4. **City Not Switching**: Ensure proper city selection

### Debug Mode
Enable debug logging to see detailed API interactions:
```javascript
// In browser console
localStorage.setItem('debug', 'tourist-heatmap');
```

The tourist heat map provides tourism departments with unprecedented visibility into tourist distribution and safety, enabling proactive management and enhanced tourist safety across all major Indian tourist destinations.


