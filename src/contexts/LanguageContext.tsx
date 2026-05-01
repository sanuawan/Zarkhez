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

// Translations dictionary
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
    'nav.settings': 'Settings',

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

     // Districts
    'district.faisalabad': 'Faisalabad',
    'district.multan': 'Multan',
    'district.sargodha': 'Sargodha',
    'district.bahawalpur': 'Bahawalpur',
    'district.lahore': 'Lahore',
    'district.sukkur': 'Sukkur',
    'district.hyderabad': 'Hyderabad',

    // Motor Types
    'motorType.Medium': 'Medium',
    'motorType.Medium Plus': 'Medium Plus',
    'motorType.Large': 'Large',
    'motorType.Large Plus': 'Large Plus',
    'motorType.Heavy': 'Heavy',
    'motorType.Heavy Plus': 'Heavy Plus',
    'motorType.Extra Heavy': 'Extra Heavy',
    'motorType.Mega': 'Mega',
    'motorType.Ultra': 'Ultra',
    'motorType.Standard': 'Standard',
    
    
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


    // Analytics Screen
    'analytics.title': 'Analytics Dashboard',
    'analytics.backBilling': '← Billing',
    'analytics.weeklyFlow': 'Weekly Flow',
    'analytics.monthlyFlow': 'Monthly Flow',
    'analytics.recoveryStatus': 'Bill Recovery Status',
    'analytics.weeklyUnits': 'Weekly Units (kWh)',
    'analytics.yearlyUnits': 'Yearly Units (kWh)',
    'analytics.totalConsumption': 'Total Estimated Consumption',
    'analytics.motorConfig': 'Motor Configuration',
    'analytics.enterHP': 'Enter Motor Power (HP):',
    'analytics.hpPlaceholder': 'e.g. 15',
    'analytics.totalPending': 'Total Pending Collection',
    'analytics.paid': 'Paid',
    'analytics.pending': 'Pending',

    // Billing Screen
    'billing.dashboardTitle': 'Billing Dashboard',
    'billing.viewAnalytics': 'View Analytics',
    'billing.subtitle': 'Shared Tube-Well System',
    'billing.totalRevenue': 'Total Revenue',
    'billing.totalDuration': 'Total Duration',
    'billing.users': 'Users',
    'billing.defaultRate': 'Default Rate (Per Hour)',
    'billing.save': 'SAVE',
    'billing.edit': 'EDIT',
    'billing.tabPending': 'pending',
    'billing.tabPaid': 'paid',
    'billing.tabAll': 'all',
    'billing.multiUserBilling': 'Multi-User Billing',
    'billing.tableName': 'Name',
    'billing.tableSessions': 'Sessions',
    'billing.tableTime': 'Time',
    'billing.tableBill': 'Bill',
    'billing.viewDetails': 'View Details',

    // Activity Log
    'activity.settings': 'Settings',
    'activity.title': 'Events / Activity Log',
    'activity.eventsRecorded': 'events recorded',
    'activity.motorOn': 'Motor ON',
    'activity.motorOff': 'Motor OFF',
    'activity.scheduleStarted': 'Schedule Started',
    'activity.scheduleFinished': 'Schedule Finished',
    'activity.scheduleCancelled': 'Schedule Cancelled',
    'activity.activity': 'Activity',

    // Alerts
    'alerts.settings': 'Settings',
    'alerts.pageTitle': 'Alerts',
    'alerts.allNormal': 'All systems normal',
    'alerts.newAlerts': 'new alert(s)',
    'alerts.requireAttention': 'alerts require attention',
    'alerts.noHistory': 'No alert history found.',
    'alerts.new': 'New',

    // Appearance
    'appearance.settings': 'Settings',
    'appearance.title': 'Appearance',
    'appearance.subtitle': 'Choose your preferred theme',
    'appearance.themeLabel': 'THEME',
    'appearance.lightMode': 'Light Mode',
    'appearance.lightDesc': 'Soft cream background',
    'appearance.darkMode': 'Dark Mode',
    'appearance.darkDesc': 'Deep forest palette',
    'appearance.note': 'Theme applies to the entire Zarkhez app. Changes take effect immediately.',

    // Safety Screen
    'safety.settings': 'Settings',
    'safety.title': 'Safety Guard',
    'safety.subtitle': 'Protect your motor with smart monitoring',
    'safety.smartControl': 'SMART MOTOR CONTROL',
    'safety.controlMode': 'CONTROL MODE',
    'safety.autoMode': 'Auto Mode',
    'safety.manualMode': 'Manual Mode',
    'safety.autoDesc': 'Motor stops automatically when limits are exceeded.',
    'safety.manualDesc': 'You receive up to 3 notifications before motor auto-stops.',
    'safety.limits': 'VOLTAGE & CURRENT LIMITS',
    'safety.minVol': 'Minimum Voltage',
    'safety.maxVol': 'Maximum Voltage',
    'safety.maxCurr': 'Maximum Current',
    'safety.motorService': '🔧 MOTOR SERVICE',
    'safety.serviceStatus': 'Service Status',
    'safety.serviceRequired': 'Service Required',
    'safety.normal': 'Normal',
    'safety.motorGood': 'Motor is in good condition.',
    'safety.remaining': 'remaining',
    'safety.runningTime': 'Running Time',
    'safety.serviceLimit': 'Service Limit',
    'safety.customLimit': 'Custom Service Limit',
    'safety.hours': 'hours',
    'safety.hrs': 'hrs',
    'safety.mins': 'mins',
    'safety.resetConfirm': 'Reset service counter?',
    'safety.willBeReset': 'will be reset to 0',
    'safety.reset': 'Reset',
    'safety.resetCounter': '⟳ Reset Service Counter',
    'safety.applyChanges': 'Apply Changes',

    // Settings Screen
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your preferences',
    'settings.farmer': 'Farmer',
    'settings.loggedIn': 'Logged in',
    'settings.guest': 'Guest',
    'settings.general': 'GENERAL',
    'settings.menu.alerts.title': 'Alerts',
    'settings.menu.alerts.desc': 'System warnings & notifications',
    'settings.menu.activity.title': 'Events / Activity Log',
    'settings.menu.activity.desc': 'Motor events & system history',
    'settings.menu.safety.title': 'Motor Safety Config',
    'settings.menu.safety.desc': 'Set voltage & current thresholds',
    'settings.menu.language.title': 'Language',
    'settings.menu.language.desc': 'English / اردو',
    'settings.menu.appearance.title': 'Appearance',
    'settings.menu.appearance.desc': 'Light / Dark mode',

    

    // User Detail
    'userDetail.backBilling': '← Back to Billing',
    'userDetail.usageHistory': 'Usage History · Zarkhez',
    'userDetail.sessions': 'Sessions',
    'userDetail.totalBill': 'Total Bill',
    'userDetail.settleBill': 'Settle Total Bill (Mark All Paid)',
    'userDetail.timelineTitle': 'Motor Usage Timeline',
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
    'nav.settings': 'ترتیبات',

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


    // Districts
    'district.faisalabad': 'فیصل آباد',
    'district.multan': 'ملتان',
    'district.sargodha': 'سرگودھا',
    'district.bahawalpur': 'بہاولپور',
    'district.lahore': 'لاہور',
    'district.sukkur': 'سکھر',
    'district.hyderabad': 'حیدرآباد',

    // Motor Types
    'motorType.Medium': 'درمیانی',
    'motorType.Medium Plus': 'درمیانی پلس',
    'motorType.Large': 'بڑی',
    'motorType.Large Plus': 'بڑی پلس',
    'motorType.Heavy': 'بھاری',
    'motorType.Heavy Plus': 'بھاری پلس',
    'motorType.Extra Heavy': 'اضافی بھاری',
    'motorType.Mega': 'میگا',
    'motorType.Ultra': 'الٹرا',
    'motorType.Standard': 'معیاری',

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


    // Analytics Screen
    'analytics.title': 'تجزیاتی ڈیش بورڈ',
    'analytics.backBilling': '← بلنگ',
    'analytics.weeklyFlow': 'ہفتہ وار بہاؤ',
    'analytics.monthlyFlow': 'ماہانہ بہاؤ',
    'analytics.recoveryStatus': 'بل کی وصولی کی صورتحال',
    'analytics.weeklyUnits': 'ہفتہ وار یونٹس (kWh)',
    'analytics.yearlyUnits': 'سالانہ یونٹس (kWh)',
    'analytics.totalConsumption': 'کل تخمینہ شدہ استعمال',
    'analytics.motorConfig': 'موٹر کی ترتیبات',
    'analytics.enterHP': 'موٹر کی پاور (HP) درج کریں:',
    'analytics.hpPlaceholder': 'مثال: 15',
    'analytics.totalPending': 'کل بقایا جات',
    'analytics.paid': 'ادا شدہ',
    'analytics.pending': 'زیر التوا',

    // Billing Screen
    'billing.dashboardTitle': 'بلنگ ڈیش بورڈ',
    'billing.viewAnalytics': 'اینیلیٹکس',
    'billing.subtitle': 'مشترکہ ٹیوب ویل سسٹم',
    'billing.totalRevenue': 'کل آمدنی',
    'billing.totalDuration': 'کل دورانیہ',
    'billing.users': 'صارفین',
    'billing.defaultRate': 'طے شدہ ریٹ (فی گھنٹہ)',
    'billing.save': 'محفوظ کریں',
    'billing.edit': 'ترمیم کریں',
    'billing.tabPending': 'زیر التوا',
    'billing.tabPaid': 'ادا شدہ',
    'billing.tabAll': 'تمام',
    'billing.multiUserBilling': 'ملٹی یوزر بلنگ',
    'billing.tableName': 'نام',
    'billing.tableSessions': 'نشستیں',
    'billing.tableTime': 'وقت',
    'billing.tableBill': 'بل',
    'billing.viewDetails': 'تفصیلات دیکھیں',

    // Activity Log
    'activity.settings': 'ترتیبات',
    'activity.title': 'واقعات / سرگرمی کی تاریخ',
    'activity.eventsRecorded': 'واقعات ریکارڈ کیے گئے',
    'activity.motorOn': 'موٹر آن',
    'activity.motorOff': 'موٹر آف',
    'activity.scheduleStarted': 'شیڈول شروع ہوا',
    'activity.scheduleFinished': 'شیڈول مکمل ہوا',
    'activity.scheduleCancelled': 'شیڈول منسوخ ہوا',
    'activity.activity': 'سرگرمی',

    // Alerts
    'alerts.settings': 'ترتیبات',
    'alerts.pageTitle': 'الرٹس',
    'alerts.allNormal': 'تمام سسٹمز نارمل ہیں',
    'alerts.newAlerts': 'نئے الرٹس',
    'alerts.requireAttention': 'الرٹس توجہ طلب ہیں',
    'alerts.noHistory': 'الرٹس کی کوئی تاریخ نہیں ملی۔',
    'alerts.new': 'نیا',

    // Appearance
    'appearance.settings': 'ترتیبات',
    'appearance.title': 'ظاہری شکل',
    'appearance.subtitle': 'اپنی پسندیدہ تھیم کا انتخاب کریں',
    'appearance.themeLabel': 'تھیم',
    'appearance.lightMode': 'لائٹ موڈ',
    'appearance.lightDesc': 'نرم کریم پس منظر',
    'appearance.darkMode': 'ڈارک موڈ',
    'appearance.darkDesc': 'گہرا جنگلاتی رنگ',
    'appearance.note': 'تھیم پوری زرخیز ایپ پر لاگو ہوتی ہے۔ تبدیلیاں فوری طور پر نافذ ہو جائیں گی۔',

    // Safety Screen
    'safety.settings': 'ترتیبات',
    'safety.title': 'حفاظتی گارڈ',
    'safety.subtitle': 'اسمارٹ مانیٹرنگ کے ساتھ موٹر کی حفاظت کریں',
    'safety.smartControl': 'اسمارٹ موٹر کنٹرول',
    'safety.controlMode': 'کنٹرول موڈ',
    'safety.autoMode': 'آٹو موڈ',
    'safety.manualMode': 'دستی موڈ',
    'safety.autoDesc': 'حدود سے تجاوز کرنے پر موٹر خود بخود بند ہو جاتی ہے۔',
    'safety.manualDesc': 'موٹر آٹو اسٹاپ ہونے سے پہلے آپ کو 3 الرٹ ملیں گے۔',
    'safety.limits': 'وولٹیج اور کرنٹ کی حدود',
    'safety.minVol': 'کم از کم وولٹیج',
    'safety.maxVol': 'زیادہ سے زیادہ وولٹیج',
    'safety.maxCurr': 'زیادہ سے زیادہ کرنٹ',
    'safety.motorService': '🔧 موٹر سروس',
    'safety.serviceStatus': 'سروس کی حالت',
    'safety.serviceRequired': 'سروس درکار ہے',
    'safety.normal': 'نارمل',
    'safety.motorGood': 'موٹر اچھی حالت میں ہے۔',
    'safety.remaining': 'باقی ہے',
    'safety.runningTime': 'چلنے کا وقت',
    'safety.serviceLimit': 'سروس کی حد',
    'safety.customLimit': 'اپنی مرضی کی سروس حد',
    'safety.hours': 'گھنٹے',
    'safety.hrs': 'گھنٹے',
    'safety.mins': 'منٹ',
    'safety.resetConfirm': 'سروس کاؤنٹر ری سیٹ کریں؟',
    'safety.willBeReset': '0 پر ری سیٹ ہو جائے گا',
    'safety.reset': 'ری سیٹ کریں',
    'safety.resetCounter': '⟳ سروس کاؤنٹر ری سیٹ کریں',
    'safety.applyChanges': 'تبدیلیاں محفوظ کریں',

    // Settings Screen
    'settings.title': 'ترتیبات',
    'settings.subtitle': 'اپنی ترجیحات کا نظم کریں',
    'settings.farmer': 'کسان',
    'settings.loggedIn': 'لاگ ان',
    'settings.guest': 'مہمان',
    'settings.general': 'عام ترتیبات',
    'settings.menu.alerts.title': 'الرٹس',
    'settings.menu.alerts.desc': 'سسٹم وارننگز اور اطلاعات',
    'settings.menu.activity.title': 'واقعات / سرگرمی',
    'settings.menu.activity.desc': 'موٹر کے واقعات اور تاریخ',
    'settings.menu.safety.title': 'موٹر سیفٹی کنفیگریشن',
    'settings.menu.safety.desc': 'وولٹیج اور کرنٹ کی حد مقرر کریں',
    'settings.menu.language.title': 'زبان',
    'settings.menu.language.desc': 'انگریزی / اردو',
    'settings.menu.appearance.title': 'ظاہری شکل',
    'settings.menu.appearance.desc': 'لائٹ / ڈارک موڈ',

    // User Detail
    'userDetail.backBilling': '← واپس بلنگ پر',
    'userDetail.usageHistory': 'استعمال کی تاریخ · زرخیز',
    'userDetail.sessions': 'نشستیں',
    'userDetail.totalBill': 'کل بل',
    'userDetail.settleBill': 'کل بل ادا کریں (سب کو ادا شدہ کریں)',
    'userDetail.timelineTitle': 'موٹر کے استعمال کی ٹائم لائن',
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