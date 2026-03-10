// src/config/apiConfig.ts

export const API_CONFIG = {
  // API Key
  WEATHER_API_KEY: 'a7e93a4511535b6ed4d9cc47ab75d6f6', 
  
  // Base URLs
  WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  WEATHER_FORECAST_URL: 'https://api.openweathermap.org/data/2.5/forecast',
  
  // Coordinates for SPECIFIC 7 Cities
  CITY_COORDINATES: {
    'Lahore':     { lat: 31.5204, lon: 74.3587 },
    'Faisalabad': { lat: 31.4187, lon: 73.0791 },
    'Multan':     { lat: 30.1575, lon: 71.5249 },
    'Sargodha':   { lat: 32.0836, lon: 72.6711 },
    'Bahawalpur': { lat: 29.3956, lon: 71.6836 },
    'Sukkur':     { lat: 27.7132, lon: 68.8482 },
    'Hyderabad':  { lat: 25.3969, lon: 68.3772 }
  } as Record<string, { lat: number; lon: number }>
};