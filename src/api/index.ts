// src/api/index.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Apna backend URL
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Mock data agar API na ho
export const MOCK_DATA = {
  districts: ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad'],
  crops: ['wheat', 'rice', 'cotton', 'maize', 'sugarcane'],
  soilTypes: ['loam', 'clay', 'sandy', 'sandy loam', 'clay loam']
};