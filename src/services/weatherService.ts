// src/services/weatherService.ts
import { API_CONFIG } from '../config/apiConfig';

// Data Types
export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  rainfall: number;
}

export interface ForecastData {
  date: string; // e.g., "Monday", "Tuesday"
  temp: number;
  condition: string;
  rainfall: number;
}

// Helper function to get Day Name
const getDayName = (dateString: string) => {
  const date = new Date(dateString); // "window.Date" ensures React Native compatibility
  return date.toLocaleDateString('en-US', { weekday: 'long' }); // Returns "Monday", "Tuesday"
};

const weatherService = {
  
  // 1. Current Weather
  getCurrentWeather: async (city: string): Promise<WeatherData> => {
    try {
      const coords = API_CONFIG.CITY_COORDINATES[city];
      if (!coords) throw new Error("City not found in config");

      // API Call with Lat/Lon for accuracy
      const response = await fetch(
        `${API_CONFIG.WEATHER_BASE_URL}?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_CONFIG.WEATHER_API_KEY}`
      );
      
      const data = await response.json();

      if (data.cod !== 200) throw new Error(data.message);

      // Rainfall check
      const rain = data.rain ? (data.rain['1h'] || 0) : 0;

      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        feelsLike: Math.round(data.main.feels_like),
        rainfall: rain,
      };
    } catch (error) {
      console.error("Current Weather Error:", error);
      throw error;
    }
  },

  // 2. 5-Days Forecast
  getWeatherForecast: async (city: string): Promise<ForecastData[]> => {
    try {
      const coords = API_CONFIG.CITY_COORDINATES[city];
      if (!coords) throw new Error("City not found");

      const response = await fetch(
        `${API_CONFIG.WEATHER_FORECAST_URL}?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_CONFIG.WEATHER_API_KEY}`
      );

      const data = await response.json();
      if (data.cod !== "200") throw new Error(data.message);

      // Filtering 3-hour data to Daily Data ---
      const dailyForecasts: ForecastData[] = [];
      const seenDates = new Set();
      
      // today date
      const today = new Date().toISOString().split('T')[0];

      // API 40 items bhejta hai (5 days * 8 intervals)
      // Hum loop laga kar har naye din ka pehla record uthayen gay
      for (const item of data.list) {
        const datePart = item.dt_txt.split(' ')[0]; // YYYY-MM-DD

        // Agar ye date pehlay save nahi ki, aur ye aaj ki date nahi hai
        if (!seenDates.has(datePart) && datePart !== today) {
          
          seenDates.add(datePart); // Is date ko note kar lo

          // Rain handling
          const rain = item.rain ? (item.rain['3h'] || 0) : 0;

          dailyForecasts.push({
            date: getDayName(datePart), // "2024-03-20" -> "Wednesday"
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            rainfall: rain
          });
        }

        // Hamain sirf aglay 5 din chahiye
        if (dailyForecasts.length === 5) break;
      }

      return dailyForecasts;

    } catch (error) {
      console.error("Forecast Error:", error);
      return []; // Error aye to khali array bhejo ta ke app crash na ho
    }
  }
};

export default weatherService;