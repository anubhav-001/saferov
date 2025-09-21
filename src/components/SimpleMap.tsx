import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Position {
  lat: number;
  lng: number;
}

interface SimpleMapProps {
  center?: Position;
  zoom?: number;
  markers?: Array<{
    position: Position;
    title?: string;
  }>;
  onMapClick?: (position: Position) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi
const DEFAULT_ZOOM = 12;

export const SimpleMap: React.FC<SimpleMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  markers = [],
  onMapClick,
  className = 'h-96 w-full',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const apiKeyRaw = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
        const apiKey = (apiKeyRaw || '').replace(/^\"|\"$/g, '').trim();
        const hasKey = !!apiKey && apiKey !== 'your_google_maps_api_key_here' && apiKey !== 'AIzaSyBvOkBwv90yBvOkBwv90yBvOkBwv90yBvOk';

        if (hasKey) {
          console.log('Initializing Google Maps...');
          const loader = new Loader({
            apiKey,
            version: 'weekly',
            libraries: ['places'],
          });

          const google = await loader.load();
          console.log('Google Maps loaded');
          
          const mapInstance = new google.maps.Map(mapRef.current!, {
            center,
            zoom,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });

          // Add click listener if provided
          if (onMapClick) {
            mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
              if (e.latLng) {
                onMapClick({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                });
              }
            });
          }

          // Add markers if any
          markers.forEach(marker => {
            new google.maps.Marker({
              position: marker.position,
              map: mapInstance,
              title: marker.title,
            });
          });

          setMap(mapInstance);
          setIsLoading(false);
        } else {
          // No key: render OpenStreetMap fallback via iframe (real map)
          setMap(null);
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to load map: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Cleanup if needed
    };
  }, [center, zoom, markers, onMapClick]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50 rounded-lg`}>
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-red-700">Map Error</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <p className="mt-2 text-xs text-gray-500">
            Using OpenStreetMap fallback. To enable Google Maps, add a valid API key to your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full rounded-lg border border-gray-200"
        style={{ minHeight: '300px' }}
      />
      {/* Fallback OpenStreetMap when Google key is not provided */}
      {!map && !error && (
        <div className="absolute inset-0 w-full h-full rounded-lg border border-gray-200">
          <iframe
            title="Map"
            className="w-full h-full rounded-lg"
            src={`https://www.openstreetmap.org/export/embed.html?&marker=${center.lat}%2C${center.lng}`}
            style={{ minHeight: '300px' }}
          />
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
            OpenStreetMap
          </div>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMap;
