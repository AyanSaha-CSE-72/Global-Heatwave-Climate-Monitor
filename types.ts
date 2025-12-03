
export interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  location: string;
}

export interface PredictionData {
  day: string;
  date: string; // ISO Date String
  temp: number;
  riskLevel: RiskLevel;
  confidence: number;
}

export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  EXTREME = 'Extreme'
}

export interface SatelliteRecord {
  date: string;
  avgTemp: number;
  humidity: number;
  recordedAt: string;
}

export interface AlertSubscription {
  id: string;
  name: string;
  phone: string;
  district: string;
  timestamp: number;
}

export interface UserRequest {
  id: string;
  name: string;
  contact: string;
  location: LocationData;
  question?: string;
  status: 'PENDING' | 'GENERATED' | 'SENT';
  aiReply?: string;
  timestamp: number;
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface AiReport {
  newsSummary: string;
  newsSources: { title: string; uri: string }[];
  reliefCenters: string; // Markdown content for places
  reliefSources: { title: string; uri: string }[];
}

export type Language = 'EN' | 'BN';

export interface Translation {
  [key: string]: {
    EN: string;
    BN: string;
  };
}
