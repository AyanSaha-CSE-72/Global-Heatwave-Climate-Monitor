
import { LocationData, WeatherData } from '../types';

export const resolveLocation = async (query: string): Promise<LocationData | null> => {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
    
    if (!response.ok) {
       console.warn("Geocoding API unavailable");
       return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
        country: result.country,
        state: result.admin1
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export const searchLocations = async (query: string): Promise<LocationData[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    
    if (!response.ok) return [];

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map((result: any) => ({
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
        country: result.country,
        state: result.admin1
      }));
    }
    return [];
  } catch (error) {
    console.error("Geocoding search error:", error);
    return [];
  }
};

export const fetchWeatherData = async (lat: number = 23.8103, lon: number = 90.4125, locationName: string = 'Dhaka, Bangladesh'): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,rain,wind_speed_10m&daily=uv_index_max&timezone=auto`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Open-Meteo API Error: ${response.status} - ${errorText}`);
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      uvIndex: data.daily.uv_index_max[0] || 5,
      windSpeed: data.current.wind_speed_10m,
      location: locationName
    };
  } catch (error) {
    console.error("Error fetching weather data:", error instanceof Error ? error.message : error);
    
    // Fallback Mock Data
    return {
      temperature: 34.5,
      humidity: 72,
      uvIndex: 8,
      windSpeed: 12,
      location: `${locationName} (Demo Data - API Unavailable)`
    };
  }
};