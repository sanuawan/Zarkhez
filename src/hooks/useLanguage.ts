// src/hooks/useLanguage.ts
import { useState } from 'react';

export type Language = 'en' | 'ur';

const translations = {
  en: {
    // Header
    'header.title': 'Zarkhez',
    'header.subtitle': 'Smart Farming',
    
    // Motor Control
    'motor.status': 'Motor Status',
    'motor.manual': 'Manual',
    'motor.auto': 'Auto',
    'motor.on': 'ON',
    'motor.off': 'OFF',
    'motor.autoActive': 'Auto Mode Active',
    'motor.autoDescription': 'Motor controlled by AI based on soil & weather',
    
    // Measurements
    'measurements.voltage': 'Voltage',
    'measurements.current': 'Current',
    'measurements.weather': 'Weather',
    'measurements.temperature': 'Temperature',
    'measurements.humidity': 'Humidity',
    
    // Navigation
    'nav.home': 'Home',
    'nav.schedule': 'Schedule',
    'nav.soil': 'Soil',
    'nav.billing': 'Billing',
    'nav.alerts': 'Alerts',
    
    // Logout
    'logout': 'Logout',
  },
  ur: {
    // Header
    'header.title': 'زرخیز',
    'header.subtitle': 'ذہین کاشتکاری',
    
    // Motor Control
    'motor.status': 'موٹر حالت',
    'motor.manual': 'دستان',
    'motor.auto': 'خودکار',
    'motor.on': 'چالو',
    'motor.off': 'بند',
    'motor.autoActive': 'خودکار موڈ فعال',
    'motor.autoDescription': 'موٹر مٹی اور موسم کی بنیاد پر AI کے ذریعے کنٹرول ہوتی ہے',
    
    // Measurements
    'measurements.voltage': 'وولٹیج',
    'measurements.current': 'کرنٹ',
    'measurements.weather': 'موسم',
    'measurements.temperature': 'درجہ حرارت',
    'measurements.humidity': 'نمی',
    
    // Navigation
    'nav.home': 'ہوم',
    'nav.schedule': 'شیڈول',
    'nav.soil': 'مٹی',
    'nav.billing': 'بلنگ',
    'nav.alerts': 'الرٹس',
    
    // Logout
    'logout': 'لاگ آؤٹ',
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  return {
    language,
    setLanguage,
    t,
    toggleLanguage
  };
};