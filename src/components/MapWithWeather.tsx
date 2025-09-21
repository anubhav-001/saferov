import { useState, useCallback, useEffect } from 'react';
import { SimpleMap } from './SimpleMap';
import { MapPin, Thermometer, Droplets, Wind } from 'lucide-react';

interface Position {
  lat: number;
  lng: number;
}

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface MapWithWeatherProps {
  center?: Position;
  zoom?: number;
  markers?: Array<{
    position: Position;
    title?: string;
    type?: 'user' | 'police' | 'tourism' | 'poi';
  }>;
}

const MapWithWeather: React.FC<MapWithWeatherProps> = ({ center, zoom, markers }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (lat: number, lng: number) => {
    const apiKeyRaw = import.meta.env.VITE_WEATHER_API_KEY as string | undefined;
    const apiKey = (apiKeyRaw || '').replace(/^\"|\"$/g, '').trim();
    
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      console.warn('[Weather] Missing OpenWeather API key (VITE_WEATHER_API_KEY)');
      setError('Weather data not available. Please check your API key in .env file.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('[Weather] Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMapClick = useCallback(async (position: Position) => {
    await fetchWeatherData(position.lat, position.lng);
  }, [fetchWeatherData]);

  // Load initial weather data for the provided center or New Delhi
  useEffect(() => {
    if (!weather && !loading && !error) {
      const initial = center || { lat: 28.6139, lng: 77.2090 };
      fetchWeatherData(initial.lat, initial.lng);
    }
  }, [weather, loading, error, fetchWeatherData, center]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4">
      <div className="w-full md:w-2/3 h-96 md:h-auto">
        <SimpleMap 
          center={center}
          zoom={zoom}
          markers={markers?.map(m => ({ position: m.position, title: m.title }))}
          onMapClick={handleMapClick}
          className="h-full w-full"
        />
      </div>
      
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Weather Information</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            {error}
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="text-red-500 mr-2" />
              <h3 className="text-lg font-medium">
                {weather.name}, {weather.sys.country}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Thermometer className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="text-xl font-semibold">{weather.main.temp.toFixed(1)}°C</p>
                    <p className="text-sm text-gray-500">
                      Feels like {weather.main.feels_like.toFixed(1)}°C
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Droplets className="text-blue-300 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="text-xl font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Wind className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-2">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                      alt={weather.weather[0].description}
                      className="w-8 h-8"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="text-sm font-medium capitalize">
                      {weather.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapWithWeather;
