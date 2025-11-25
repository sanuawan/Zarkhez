// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
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
    'nav.home': 'Home',
    // Measurements
    'measurements.voltage': 'Voltage',
    'measurements.current': 'Current',
    'measurements.weather': 'Weather',
    'measurements.temperature': 'Temperature',
    'measurements.humidity': 'Humidity',
    
    // Navigation
    'nav.schedule': 'Schedule',
    'nav.soil': 'Soil',
    'nav.billing': 'Billing',
    'nav.alerts': 'Alerts',
    'nav.settings': 'Settings',
    
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
    'nav.home': 'ہوم',
    // Measurements
    'measurements.voltage': 'وولٹیج',
    'measurements.current': 'کرنٹ',
    'measurements.weather': 'موسم',
    'measurements.temperature': 'درجہ حرارت',
    'measurements.humidity': 'نمی',
    
    // Navigation
    'nav.schedule': 'شیڈول',
    'nav.soil': 'مٹی',
    'nav.billing': 'بلنگ',
    'nav.alerts': 'الرٹس',
    'nav.settings': 'ترتیبات',
    
    // Logout
    'logout': 'لاگ آؤٹ',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};