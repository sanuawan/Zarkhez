// src/services/weatherService.ts
import { API_CONFIG } from '../config/apiConfig';

export interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number;
  condition: string;
  windSpeed: number;
  feelsLike: number;
  sunrise: number;
  sunset: number;
  pressure: number;
  visibility: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  temp: number;
  condition: string;
  humidity: number;
  rainfall: number;
  icon: string;
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string;
  private forecastUrl: string;

  constructor() {
    this.apiKey = API_CONFIG.WEATHER_API_KEY;
    this.baseUrl = API_CONFIG.WEATHER_BASE_URL;
    this.forecastUrl = API_CONFIG.WEATHER_FORECAST_URL;
  }

  // Get current weather for a city
  async getCurrentWeather(cityName: string): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}?q=${cityName},PK&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to mock data if API fails
      return this.getMockWeatherData(cityName);
    }
  }

  // Get weather by coordinates
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather by coords:', error);
      return this.getMockWeatherData('Lahore');
    }
  }

  // Get 5-day forecast
  async getWeatherForecast(cityName: string): Promise<ForecastData[]> {
    try {
      const response = await fetch(
        `${this.forecastUrl}?q=${cityName},PK&appid=${this.apiKey}&units=metric&cnt=5`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return this.getMockForecastData();
    }
  }

  // Transform API response to our format
  private transformWeatherData(data: any): WeatherData {
    const rainfall = data.rain ? data.rain['1h'] || 0 : 0;
    
    return {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      rainfall: rainfall,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      pressure: data.main.pressure,
      visibility: data.visibility,
      icon: data.weather[0].icon
    };
  }

  // Transform forecast data
  private transformForecastData(data: any): ForecastData[] {
    return data.list.slice(0, 5).map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      humidity: item.main.humidity,
      rainfall: item.rain ? item.rain['3h'] || 0 : 0,
      icon: item.weather[0].icon
    }));
  }

  // Mock weather data for fallback
  private getMockWeatherData(cityName: string): WeatherData {
    const cityLower = cityName.toLowerCase();
    const mockData: Record<string, WeatherData> = {
      'lahore': { temp: 32, humidity: 50, rainfall: 0, condition: 'Clear', windSpeed: 5.2, feelsLike: 34, sunrise: 1680834000, sunset: 1680882000, pressure: 1013, visibility: 10000, icon: '01d' },
      'karachi': { temp: 35, humidity: 70, rainfall: 0, condition: 'Humid', windSpeed: 6.8, feelsLike: 38, sunrise: 1680836000, sunset: 1680884000, pressure: 1012, visibility: 8000, icon: '50d' },
      'islamabad': { temp: 28, humidity: 45, rainfall: 0, condition: 'Clear', windSpeed: 4.5, feelsLike: 30, sunrise: 1680835000, sunset: 1680883000, pressure: 1014, visibility: 12000, icon: '01d' },
      'rawalpindi': { temp: 29, humidity: 48, rainfall: 0, condition: 'Sunny', windSpeed: 5.0, feelsLike: 31, sunrise: 1680834500, sunset: 1680882500, pressure: 1013, visibility: 11000, icon: '01d' },
      'faisalabad': { temp: 33, humidity: 52, rainfall: 2, condition: 'Partly Cloudy', windSpeed: 5.5, feelsLike: 35, sunrise: 1680834200, sunset: 1680882200, pressure: 1012, visibility: 9500, icon: '02d' },
      'multan': { temp: 36, humidity: 40, rainfall: 0, condition: 'Hot', windSpeed: 6.2, feelsLike: 38, sunrise: 1680833800, sunset: 1680881800, pressure: 1011, visibility: 13000, icon: '01d' },
      'gujranwala': { temp: 31, humidity: 55, rainfall: 3, condition: 'Sunny', windSpeed: 4.8, feelsLike: 33, sunrise: 1680834400, sunset: 1680882400, pressure: 1013, visibility: 10500, icon: '01d' },
      'peshawar': { temp: 34, humidity: 45, rainfall: 0, condition: 'Hot', windSpeed: 5.8, feelsLike: 36, sunrise: 1680834800, sunset: 1680882800, pressure: 1012, visibility: 12000, icon: '01d' },
      'quetta': { temp: 25, humidity: 30, rainfall: 0, condition: 'Cool', windSpeed: 4.2, feelsLike: 26, sunrise: 1680836000, sunset: 1680884000, pressure: 1015, visibility: 15000, icon: '01d' },
      'sargodha': { temp: 30, humidity: 53, rainfall: 4, condition: 'Partly Cloudy', windSpeed: 5.1, feelsLike: 32, sunrise: 1680834300, sunset: 1680882300, pressure: 1013, visibility: 9800, icon: '02d' }
    };

    return mockData[cityLower] || mockData['lahore'];
  }

  // Mock forecast data
  private getMockForecastData(): ForecastData[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days.map((day, index) => ({
      date: `${day}, ${index + 10} Mar`,
      temp: 28 + index,
      condition: index % 2 === 0 ? 'Sunny' : 'Partly Cloudy',
      humidity: 45 + (index * 5),
      rainfall: index === 2 ? 5 : 0,
      icon: index % 2 === 0 ? '01d' : '02d'
    }));
  }

  // Get weather icon URL
  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export default new WeatherService();