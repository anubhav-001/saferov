import { google } from 'googlemaps';

export type MarkerType = 'police' | 'tourism' | 'user';

export interface Position {
  lat: number;
  lng: number;
}

export interface Marker {
  position: Position;
  title: string;
  type: MarkerType;
}

export interface Weather {
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

export interface MapWithWeatherProps {
  center?: Position;
  zoom?: number;
  markers?: Marker[];
}
