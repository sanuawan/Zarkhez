// src/api/agricultureApi.ts
import { API_CONFIG, MOCK_DATA } from './index';

export interface RecommendationRequest {
  district: string;
  crop_type: string;
  soil_type: string;
  area: number; // hectares
}

export interface RecommendationResponse {
  success: boolean;
  data?: {
    water_needed_liters: number;
    irrigation_method: string;
    method_score: number;
    method_reason: string;
    duration_hours: number;
    sessions: number;
    hours_per_session: number;
    efficiency_score: number;
    weather_data: {
      temperature: number;
      humidity: number;
      rainfall: number;
      condition: string;
    };
    tips: string[];
  };
  error?: string;
}

class AgricultureApi {
  // Local ML calculation (agar API na ho)
  private calculateWaterRequirement(
    crop: string, 
    soil: string, 
    area: number, 
    weather: any
  ): number {
    const cropWaterMap: Record<string, number> = {
      'wheat': 4500,
      'rice': 6800,
      'cotton': 5200,
      'maize': 4800,
      'sugarcane': 7500,
      'potato': 4000
    };

    const soilFactorMap: Record<string, number> = {
      'sandy': 1.2,
      'sandy loam': 1.1,
      'loam': 1.0,
      'clay loam': 0.9,
      'clay': 0.8
    };

    const baseWater = cropWaterMap[crop] || 5000;
    const soilFactor = soilFactorMap[soil] || 1.0;
    const weatherFactor = weather.temperature > 30 ? 1.2 : 1.0;

    return Math.round(baseWater * soilFactor * weatherFactor * area);
  }

  // Get recommendation from API
  async getRecommendation(data: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      // Agar backend API available ho
      const response = await fetch(`${API_CONFIG.BASE_URL}/recommendation`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }
      
      // Agar API na chale to local calculation use karein
      return this.getMockRecommendation(data);
      
    } catch (error) {
      console.log('Using mock data due to API error:', error);
      return this.getMockRecommendation(data);
    }
  }

  // Mock recommendation (testing ke liye)
  private getMockRecommendation(data: RecommendationRequest): RecommendationResponse {
    const waterNeeded = this.calculateWaterRequirement(
      data.crop_type,
      data.soil_type,
      data.area,
      { temperature: 28 }
    );

    const methods = [
      { name: 'Drip Irrigation', score: 8, reason: 'Best for water conservation' },
      { name: 'Sprinkler System', score: 6, reason: 'Good coverage' },
      { name: 'Tube Well', score: 7, reason: 'Reliable water source' }
    ];

    const selectedMethod = methods[0];

    return {
      success: true,
      data: {
        water_needed_liters: waterNeeded,
        irrigation_method: selectedMethod.name,
        method_score: selectedMethod.score,
        method_reason: selectedMethod.reason,
        duration_hours: Math.round(waterNeeded / 10000),
        sessions: 1,
        hours_per_session: Math.round(waterNeeded / 10000),
        efficiency_score: 7,
        weather_data: {
          temperature: 28,
          humidity: 45,
          rainfall: 0,
          condition: 'Sunny'
        },
        tips: [
          'Irrigate in early morning',
          'Check soil moisture regularly',
          'Use mulch to reduce evaporation'
        ]
      }
    };
  }

  // Get available districts
  async getDistricts(): Promise<string[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/districts`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return MOCK_DATA.districts;
    } catch {
      return MOCK_DATA.districts;
    }
  }

  // Get available crops
  async getCrops(): Promise<string[]> {
    return MOCK_DATA.crops;
  }

  // Get soil types
  async getSoilTypes(): Promise<string[]> {
    return MOCK_DATA.soilTypes;
  }
}

export default new AgricultureApi();