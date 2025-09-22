import { useState, useCallback, useEffect } from 'react';
import { SimpleMap } from './SimpleMap';
import { MapPin, Users, Shield, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Position {
  lat: number;
  lng: number;
}

interface TouristLocation {
  id: string;
  position: Position;
  count: number;
  safetyScore: number;
  lastUpdate: string;
  nationality?: string;
  groupSize?: number;
}

interface SafetyZone {
  id: string;
  name: string;
  position: Position;
  radius: number; // in meters
  safetyLevel: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  description: string;
}

interface TouristHeatMapProps {
  center?: Position;
  zoom?: number;
  city?: string;
  markers?: Array<{
    position: Position;
    title?: string;
    type?: 'user' | 'police' | 'tourism' | 'poi';
  }>;
}

// Mock data for demonstration
const generateMockTouristData = (city: string): TouristLocation[] => {
  const basePositions = {
    'Delhi': [
      { lat: 28.6139, lng: 77.2090, name: 'India Gate' },
      { lat: 28.6562, lng: 77.2410, name: 'Red Fort' },
      { lat: 28.5244, lng: 77.1855, name: 'Qutub Minar' },
      { lat: 28.6129, lng: 77.2295, name: 'Connaught Place' },
      { lat: 28.5355, lng: 77.2459, name: 'Chandni Chowk' },
    ],
    'Agra': [
      { lat: 27.1751, lng: 78.0421, name: 'Taj Mahal' },
      { lat: 27.1833, lng: 78.0167, name: 'Agra Fort' },
      { lat: 27.2167, lng: 78.0167, name: 'Fatehpur Sikri' },
    ],
    'Jaipur': [
      { lat: 26.9124, lng: 75.7873, name: 'City Palace' },
      { lat: 26.9239, lng: 75.8267, name: 'Hawa Mahal' },
      { lat: 26.9859, lng: 75.8513, name: 'Amber Fort' },
    ]
  };

  const positions = basePositions[city as keyof typeof basePositions] || basePositions['Delhi'];
  
  return positions.map((pos, index) => ({
    id: `tourist-${city}-${index}`,
    position: { lat: pos.lat + (Math.random() - 0.5) * 0.01, lng: pos.lng + (Math.random() - 0.5) * 0.01 },
    count: Math.floor(Math.random() * 50) + 10,
    safetyScore: Math.floor(Math.random() * 4) + 6, // 6-10 range
    lastUpdate: new Date().toISOString(),
    nationality: ['Indian', 'American', 'British', 'German', 'French'][Math.floor(Math.random() * 5)],
    groupSize: Math.floor(Math.random() * 8) + 1,
  }));
};

const generateMockSafetyZones = (city: string): SafetyZone[] => {
  const baseZones = {
    'Delhi': [
      {
        id: 'zone-1',
        name: 'Central Delhi',
        position: { lat: 28.6139, lng: 77.2090 },
        radius: 2000,
        safetyLevel: 'medium' as const,
        color: '#fbbf24',
        description: 'Moderate safety zone with regular patrols'
      },
      {
        id: 'zone-2',
        name: 'Old Delhi',
        position: { lat: 28.6562, lng: 77.2410 },
        radius: 1500,
        safetyLevel: 'high' as const,
        color: '#ef4444',
        description: 'High-risk area with increased monitoring'
      },
      {
        id: 'zone-3',
        name: 'New Delhi',
        position: { lat: 28.6129, lng: 77.2295 },
        radius: 3000,
        safetyLevel: 'low' as const,
        color: '#10b981',
        description: 'Safe zone with excellent infrastructure'
      }
    ],
    'Agra': [
      {
        id: 'zone-1',
        name: 'Taj Mahal Area',
        position: { lat: 27.1751, lng: 78.0421 },
        radius: 1000,
        safetyLevel: 'low' as const,
        color: '#10b981',
        description: 'Highly secured tourist area'
      },
      {
        id: 'zone-2',
        name: 'City Center',
        position: { lat: 27.1833, lng: 78.0167 },
        radius: 2000,
        safetyLevel: 'medium' as const,
        color: '#fbbf24',
        description: 'Moderate safety with good facilities'
      }
    ],
    'Jaipur': [
      {
        id: 'zone-1',
        name: 'Pink City',
        position: { lat: 26.9124, lng: 75.7873 },
        radius: 2500,
        safetyLevel: 'low' as const,
        color: '#10b981',
        description: 'Well-maintained heritage area'
      },
      {
        id: 'zone-2',
        name: 'Outskirts',
        position: { lat: 26.9859, lng: 75.8513 },
        radius: 3000,
        safetyLevel: 'medium' as const,
        color: '#fbbf24',
        description: 'Moderate safety with some concerns'
      }
    ]
  };

  return baseZones[city as keyof typeof baseZones] || baseZones['Delhi'];
};

const TouristHeatMap: React.FC<TouristHeatMapProps> = ({ center, zoom, city = 'Delhi', markers }) => {
  const [touristLocations, setTouristLocations] = useState<TouristLocation[]>([]);
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TouristLocation | null>(null);
  const [totalTourists, setTotalTourists] = useState(0);
  const [averageSafetyScore, setAverageSafetyScore] = useState(0);

  const fetchTouristData = useCallback(async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
        const response = await fetch(`http://localhost:8000/api/tourist-heatmap/data/${cityName}`);
        if (response.ok) {
          const data = await response.json();
          setTouristLocations(data.tourist_locations);
          setSafetyZones(data.safety_zones);
          setTotalTourists(data.total_tourists);
          setAverageSafetyScore(data.average_safety_score);
          return;
        }
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
      }
      
      // Fallback to mock data if API is not available
      const mockTourists = generateMockTouristData(cityName);
      const mockZones = generateMockSafetyZones(cityName);
      
      setTouristLocations(mockTourists);
      setSafetyZones(mockZones);
      
      // Calculate totals
      const total = mockTourists.reduce((sum, loc) => sum + loc.count, 0);
      const avgSafety = mockTourists.reduce((sum, loc) => sum + loc.safetyScore, 0) / mockTourists.length;
      
      setTotalTourists(total);
      setAverageSafetyScore(avgSafety);
      
    } catch (err) {
      console.error('[TouristHeatMap] Error fetching tourist data:', err);
      setError('Failed to fetch tourist data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMapClick = useCallback(async (position: Position) => {
    // Find nearest tourist location
    const nearest = touristLocations.reduce((closest, location) => {
      const distance = Math.sqrt(
        Math.pow(location.position.lat - position.lat, 2) + 
        Math.pow(location.position.lng - position.lng, 2)
      );
      const closestDistance = Math.sqrt(
        Math.pow(closest.position.lat - position.lat, 2) + 
        Math.pow(closest.position.lng - position.lng, 2)
      );
      return distance < closestDistance ? location : closest;
    }, touristLocations[0]);
    
    if (nearest) {
      setSelectedLocation(nearest);
    }
  }, [touristLocations]);

  // Load tourist data when city changes
  useEffect(() => {
    fetchTouristData(city);
  }, [city, fetchTouristData]);

  // Update data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTouristData(city);
    }, 30000);

    return () => clearInterval(interval);
  }, [city, fetchTouristData]);

  const getSafetyColor = (score: number) => {
    if (score >= 8) return '#10b981'; // Green
    if (score >= 6) return '#fbbf24'; // Yellow
    if (score >= 4) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 8) return 'Safe';
    if (score >= 6) return 'Moderate';
    if (score >= 4) return 'Caution';
    return 'High Risk';
  };

  const getZoneColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#fbbf24';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4">
      <div className="w-full md:w-2/3 h-96 md:h-auto">
        <SimpleMap 
          center={center}
          zoom={zoom}
          markers={[
            ...(markers?.map(m => ({ position: m.position, title: m.title })) || []),
            ...touristLocations.map(loc => ({
              position: loc.position,
              title: `${loc.count} tourists`,
              color: getSafetyColor(loc.safetyScore)
            }))
          ]}
          onMapClick={handleMapClick}
          className="h-full w-full"
        />
        
        {/* Safety Zone Overlays */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h3 className="text-sm font-semibold mb-2">Safety Zones</h3>
            <div className="space-y-1">
              {safetyZones.map(zone => (
                <div key={zone.id} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getZoneColor(zone.safetyLevel) }}
                  />
                  <span>{zone.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Tourist Heat Map
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="flex items-center">
                  <Users className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Total Tourists</p>
                    <p className="text-xl font-semibold">{totalTourists}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-center">
                  <Shield className="text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Avg Safety</p>
                    <p className="text-xl font-semibold">{averageSafetyScore.toFixed(1)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tourist Locations */}
            <div>
              <h3 className="text-lg font-medium mb-3">Active Locations</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {touristLocations.map(location => (
                  <div 
                    key={location.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="text-red-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{location.count} tourists</p>
                          <p className="text-xs text-gray-500">
                            {location.position.lat.toFixed(4)}, {location.position.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        style={{ 
                          color: getSafetyColor(location.safetyScore),
                          borderColor: getSafetyColor(location.safetyScore)
                        }}
                      >
                        {getSafetyLevel(location.safetyScore)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Location Details */}
            {selectedLocation && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tourist Count:</span>
                      <span className="font-medium">{selectedLocation.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Safety Score:</span>
                      <Badge 
                        variant="outline"
                        style={{ 
                          color: getSafetyColor(selectedLocation.safetyScore),
                          borderColor: getSafetyColor(selectedLocation.safetyScore)
                        }}
                      >
                        {selectedLocation.safetyScore}/10
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Update:</span>
                      <span className="text-xs">{new Date(selectedLocation.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                    {selectedLocation.nationality && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nationality:</span>
                        <span className="text-sm">{selectedLocation.nationality}</span>
                      </div>
                    )}
                    {selectedLocation.groupSize && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Group Size:</span>
                        <span className="text-sm">{selectedLocation.groupSize}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safety Zones */}
            <div>
              <h3 className="text-lg font-medium mb-3">Safety Zones</h3>
              <div className="space-y-2">
                {safetyZones.map(zone => (
                  <div key={zone.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{zone.name}</span>
                      <Badge 
                        variant="outline"
                        style={{ 
                          color: getZoneColor(zone.safetyLevel),
                          borderColor: getZoneColor(zone.safetyLevel)
                        }}
                      >
                        {zone.safetyLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{zone.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Radius: {zone.radius}m
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristHeatMap;
