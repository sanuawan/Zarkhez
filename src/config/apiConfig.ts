// src/config/apiConfig.ts
export const API_CONFIG = {
  WEATHER_API_KEY: 'a7e93a4511535b6ed4d9cc47ab75d6f6', 
  WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  WEATHER_FORECAST_URL: 'https://api.openweathermap.org/data/2.5/forecast',
  
  // Pakistan cities coordinates for fallback
  CITY_COORDINATES: {
    Lahore: { lat: 31.5204, lon: 74.3587 },
    Karachi: { lat: 24.8607, lon: 67.0011 },
    Islamabad: { lat: 33.6844, lon: 73.0479 },
    Rawalpindi: { lat: 33.5651, lon: 73.0169 },
    Faisalabad: { lat: 31.4504, lon: 73.1350 },
    Multan: { lat: 30.1575, lon: 71.5249 },
    Gujranwala: { lat: 32.1877, lon: 74.1945 },
    Peshawar: { lat: 34.0151, lon: 71.5249 },
    Quetta: { lat: 30.1798, lon: 66.9750 },
    Sargodha: { lat: 32.0836, lon: 72.6711 },
    Sialkot: { lat: 32.4922, lon: 74.5311 },
    Bahawalpur: { lat: 29.3956, lon: 71.6836 },
    Sukkur: { lat: 27.7132, lon: 68.8482 },
    Jhang: { lat: 31.2682, lon: 72.3184 },
    Sheikhupura: { lat: 31.7131, lon: 73.9783 },
    RahimYarKhan: { lat: 28.4209, lon: 70.2952 },
    Gujrat: { lat: 32.5742, lon: 74.0754 },
    Kasur: { lat: 31.1155, lon: 74.4466 },
    Okara: { lat: 30.8103, lon: 73.4513 },
    Sahiwal: { lat: 30.6705, lon: 73.1063 }
  }
};