// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary - PURANE FORMAT MEIN
const translations: Record<Language, Record<string, string>> = {
  en: {
    'header.title': 'Zarkhez',
    'header.subtitle': 'Smart Farming',

    'motor.status': 'Motor Status',
    'motor.manual': 'Manual',
    'motor.auto': 'Auto',
    'motor.on': 'ON',
    'motor.off': 'OFF',
    'motor.autoActive': 'Auto Mode Active',
    'motor.autoDescription': 'Motor controlled by AI based on soil & weather',

    'measurements.voltage': 'Voltage',
    'measurements.current': 'Current',
    'measurements.weather': 'Weather',
    'measurements.temperature': 'Temperature',
    'measurements.humidity': 'Humidity',

    'nav.home': 'Home',
    'nav.schedule': 'Schedule',
    'nav.soil': 'Soil',
    'nav.billing': 'Billing',
    'nav.alerts': 'Alerts',

    'schedule.waterSchedule': 'Water Schedule',
    'schedule.scheduleType': 'Schedule Type',
    'schedule.once': 'Once', 
    'schedule.weekly': 'Weekly',
    'schedule.monthly': 'Monthly',
    'schedule.selectTime': 'Select Time',
    'schedule.startTime': 'Start Time', 
    'schedule.endTime': 'End Time', 
    'schedule.am': 'AM',
    'schedule.pm': 'PM',
    'schedule.selectedSchedule': 'Selected Schedule',
    'schedule.saveSchedule': 'Save Schedule',
    'schedule.totalDuration': 'Total Duration', 
    'schedule.scheduleHistory': 'Schedule History', 
    'schedule.noHistory': 'No schedule history available', 
    'schedule.completed': 'Completed', 
    'schedule.active': 'Active', 
    'schedule.pending': 'Pending', 
    'schedule.cancelled': 'Cancelled', 
    'schedule.irrigationComplete': 'Irrigation Complete', 
    'schedule.completeMessage': 'Irrigation schedule has been completed',

  
    'soil.title': 'Crop & Soil Analysis',
    'soil.cropSoilInfo': 'Crop & Soil Information',
    'soil.cropType': 'Crop Type',
    'soil.soilType': 'Soil Type',
    
    
    'soil.wheat': 'Wheat',
    'soil.rice': 'Rice',
    'soil.cotton': 'Cotton',
    'soil.maize': 'Maize',
    'soil.sugarcane': 'Sugarcane',
    'soil.potato': 'Potato',
    'soil.gram': 'Gram',
    
    
    'soil.sandy': 'Sandy',
    'soil.clay': 'Clay',
    'soil.loam': 'Loam',
    'soil.sandy loam': 'Sandy Loam',
    'soil.clay loam': 'Clay Loam',
    
    'soil.moisture': 'Soil Moisture',
    'soil.moistureLevel': 'Moisture Level',
    'soil.aiRecommendation': 'AI Recommendation',
    'soil.aiDescription': 'Based on crop, soil & weather data',
    'soil.irrigateToday': 'Irrigate today',
    'soil.noIrrigation': 'No irrigation needed',
    'soil.soilSensor': 'Real-time Soil Data',
    'soil.weatherData': 'Weather Forecast',
    'soil.forecast': 'Weather Forecast',
    'soil.liveMoisture': 'Live moisture',
    'soil.rainForecast': 'Rain forecast',
    
    'soil.district': 'District',
    'soil.fieldArea': 'Field Area',
    'soil.motorPower': 'Tube Well Motor Power',
    'soil.generateRecommendation': 'Generate Recommendation',
    'soil.waterRequirement': 'Water Requirement',
    'soil.dailyRequirement': 'Daily Requirement',
    'soil.irrigationMethod': 'Irrigation Method',
    'soil.duration': 'Duration',
    'soil.sessions': 'Sessions',
    'soil.efficiencyScore': 'Efficiency Score',
    'soil.efficiencyTips': 'Efficiency Tips',
    'soil.currentWeather': 'Current Weather',
    'soil.temperature': 'Temperature',
    'soil.humidity': 'Humidity',
    'soil.rainfall': 'Rainfall',
    'soil.condition': 'Condition',
    'soil.farmDetails': 'Farm Details',
    'soil.smartIrrigation': 'Smart Irrigation System',
    'soil.flowRate': 'Flow Rate',
    'soil.priceRange': 'Price Range',
    
    'soil.refresh': 'Refresh',
    'soil.feelsLike': 'Feels like',
    'soil.windSpeed': 'Wind Speed',
    'soil.next5Days': 'Next 5 Days',
    'soil.lastUpdated': 'Last updated',
    'soil.weatherImpact': 'Weather impact',
    'soil.normal': 'Normal',
    'soil.reducedRain': 'Reduced due to rain',
    'soil.increasedHeat': 'Increased due to heat',
    'soil.increasedDryAir': 'Increased due to dry air',
    'soil.loadingWeather': 'Loading weather data...',
    
    'soil.fillAllFields': 'Please fill all fields',
    'soil.success': 'Success',
    'soil.recommendationGenerated': 'Recommendation generated successfully!',
    'soil.generationFailed': 'Failed to generate recommendation',
    'soil.fetchWeatherFailed': 'Failed to fetch weather data',

    'billing.title': 'Billing',
    'billing.current': 'Current Bill',
    'billing.history': 'Billing History',
    'billing.rupees': 'Rs.',

    'alerts.title': 'Safety Alerts',
    'alerts.overload': 'Motor Overload',
    'alerts.shutdown': 'Emergency Stop',
    'alerts.service': 'Service Due',
    'alerts.safe': 'All Systems Safe',
    'alerts.check': 'Check Required',

    'common.exitApp': 'Exit App',
    'common.exitConfirm': 'Are you sure you want to exit?',
    'common.exit': 'Exit',
    'common.cancel': 'Cancel',

    'common.logout': 'Logout',
    'common.logoutConfirm': 'Are you sure you want to logout?',
    'common.error': 'Error',
    'common.ok': 'OK',
    'common.loading': 'Loading...',
    'common.refresh': 'Refresh',
  },
  ur: {
    'header.title': 'زرخیز',
    'header.subtitle': 'ذہین کاشتکاری',

    'motor.status': 'موٹر کی حالت',
    'motor.manual': 'دستی',
    'motor.auto': 'خودکار',
    'motor.on': 'آن',
    'motor.off': 'آف',
    'motor.autoActive': 'خودکار موڈ فعال',
    'motor.autoDescription': 'موٹر مٹی اور موسم کی بنیاد پر AI کے ذریعے کنٹرول ہوتی ہے',

    'measurements.voltage': 'وولٹیج',
    'measurements.current': 'کرنٹ',
    'measurements.weather': 'موسم',
    'measurements.temperature': 'درجہ حرارت',
    'measurements.humidity': 'نمی',

    'nav.home': 'ہوم',
    'nav.schedule': 'شیڈول',
    'nav.soil': 'مٹی',
    'nav.billing': 'بلنگ',
    'nav.alerts': 'الرٹس',

    'schedule.waterSchedule': 'پانی کا شیڈول',
    'schedule.scheduleType': 'شیڈول کی قسم',
    'schedule.once': 'ایک بار',
    'schedule.weekly': 'ہفتہ وار',
    'schedule.monthly': 'ماہانہ',
    'schedule.selectTime': 'وقت منتخب کریں',
    'schedule.startTime': 'شروع کا وقت', 
    'schedule.endTime': 'اختتام کا وقت', 
    'schedule.am': 'AM',
    'schedule.pm': 'PM',
    'schedule.selectedSchedule': 'منتخب شیڈول',
    'schedule.saveSchedule': 'شیڈول محفوظ کریں',
    'schedule.totalDuration': 'کل مدت', 
    'schedule.scheduleHistory': 'شیڈول تاریخ', 
    'schedule.noHistory': 'کوئی شیڈول تاریخ موجود نہیں', 
    'schedule.completed': 'مکمل', 
    'schedule.active': 'جاری', 
    'schedule.pending': 'زیر التوا', 
    'schedule.cancelled': 'منسوخ', 
    'schedule.irrigationComplete': 'آبپاشی مکمل', 
    'schedule.completeMessage': 'آبپاشی کا شیڈول مکمل ہو گیا ہے', 

    'soil.title': 'فصل اور مٹی کا تجزیہ',
    'soil.cropSoilInfo': 'فصل اور مٹی کی معلومات',
    'soil.cropType': 'فصل کی قسم',
    'soil.soilType': 'مٹی کی قسم',
    
    'soil.wheat': 'گندم',
    'soil.rice': 'چاول',
    'soil.cotton': 'کپاس',
    'soil.maize': 'مکئی',
    'soil.sugarcane': 'گنا',
    'soil.potato': 'آلو',
    'soil.gram': 'چنا',
    
    'soil.sandy': 'ریتیلی',
    'soil.clay': 'چکنی',
    'soil.loam': 'لوئم',
    'soil.sandy loam': 'ریتلی لوئم',
    'soil.clay loam': 'چکنی لوئم',
    
    'soil.moisture': 'مٹی کی نمی',
    'soil.moistureLevel': 'نمی کی سطح',
    'soil.aiRecommendation': 'AI سفارش',
    'soil.aiDescription': 'فصل، مٹی اور موسم کے ڈیٹا کی بنیاد پر',
    'soil.irrigateToday': 'آج آبپاشی کریں',
    'soil.noIrrigation': 'آبپاشی کی ضرورت نہیں',
    'soil.soilSensor': 'ریل ٹائم مٹی کا ڈیٹا',
    'soil.weatherData': 'موسم کی پیشن گوئی',
    'soil.forecast': 'موسم کی پیشن گوئی',
    'soil.liveMoisture': 'براہ راست نمی',
    'soil.rainForecast': 'بارش کی پیشن گوئی',

    'soil.district': 'ضلع',
    'soil.fieldArea': 'کھیت کا رقبہ',
    'soil.motorPower': 'ٹیوب ویل موٹر پاور',
    'soil.generateRecommendation': 'سفارش تیار کریں',
    'soil.waterRequirement': 'پانی کی ضرورت',
    'soil.dailyRequirement': 'روزانہ ضرورت',
    'soil.irrigationMethod': 'آبپاشی کا طریقہ',
    'soil.duration': 'مدت',
    'soil.sessions': 'نشستیں',
    'soil.efficiencyScore': 'کارکردگی اسکور',
    'soil.efficiencyTips': 'کارکردگی کے نکات',
    'soil.currentWeather': 'موجودہ موسم',
    'soil.temperature': 'درجہ حرارت',
    'soil.humidity': 'نمی',
    'soil.rainfall': 'بارش',
    'soil.condition': 'کیفیت',
    'soil.farmDetails': 'کھیتی کی تفصیلات',
    'soil.smartIrrigation': 'ذہین آبپاشی نظام',
    'soil.flowRate': 'پانی کی رفتار',
    'soil.priceRange': 'قیمت کا دائرہ',
    

    'soil.refresh': 'تازہ کریں',
    'soil.feelsLike': 'محسوس ہوتا ہے',
    'soil.windSpeed': 'ہوا کی رفتار',
    'soil.next5Days': 'اگلے 5 دن',
    'soil.lastUpdated': 'آخری اپ ڈیٹ',
    'soil.weatherImpact': 'موسم کا اثر',
    'soil.normal': 'معمول',
    'soil.reducedRain': 'بارش کی وجہ سے کم',
    'soil.increasedHeat': 'گرمی کی وجہ سے زیادہ',
    'soil.increasedDryAir': 'خشک ہوا کی وجہ سے زیادہ',
    'soil.loadingWeather': 'موسم کی معلومات لوڈ ہو رہی ہے...',

    'soil.fillAllFields': 'براہ کرم تمام فیلڈز بھریں',
    'soil.success': 'کامیابی',
    'soil.recommendationGenerated': 'سفارش کامیابی سے بن گئی!',
    'soil.generationFailed': 'سفارش بنانے میں ناکامی',
    'soil.fetchWeatherFailed': 'موسم کی معلومات حاصل کرنے میں خرابی',

    'billing.title': 'بلنگ',
    'billing.current': 'موجودہ بل',
    'billing.history': 'بلنگ کی تاریخ',
    'billing.rupees': 'روپے',

    'alerts.title': 'سیفٹی الرٹس',
    'alerts.overload': 'موٹر اوورلوڈ',
    'alerts.shutdown': 'ایمرجنسی اسٹاپ',
    'alerts.service': 'سروس ڈیو',
    'alerts.safe': 'تمام سسٹمز محفوظ',
    'alerts.check': 'چیک درکار',

    'common.exitApp': 'ایپ سے باہر جائیں',
    'common.exitConfirm': 'کیا آپ واقعی ایپ سے باہر نکلنا چاہتے ہیں؟',
    'common.exit': 'باہر جائیں',
    'common.cancel': 'منسوخ کریں',

    'common.logout': 'لاگ آؤٹ',
    'common.logoutConfirm': 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟',
    'common.error': 'خرابی',
    'common.ok': 'ٹھیک ہے',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.refresh': 'تازہ کریں',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};