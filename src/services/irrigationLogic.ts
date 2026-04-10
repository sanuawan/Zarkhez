// src/services/irrigationLogic.ts

export interface IrrigationDecision {
  shouldIrrigate: boolean;
  reason: string;           // Urdu
  reasonEnglish: string;    // English
  priority: 'high' | 'medium' | 'low';
  soilStatus: string;       // Urdu
  soilStatusEnglish: string; // English
  weatherStatus: string;     // Urdu
  weatherStatusEnglish: string; // English
}

class IrrigationLogicService {
  
  decide(
    soilMoisture: number,
    currentTemp: number,
    currentCondition: string,
    currentRainfall: number,
    forecastRainNext2Days: boolean,
    humidity: number = 0,
    windSpeed: number = 0
  ): IrrigationDecision {
    
    // --- SOIL STATUS ---
    let soilStatus = '';
    let soilStatusEnglish = '';
    let soilLevel = '';
    
    if (soilMoisture < 20) {
      soilStatus = 'بہت خشک';
      soilStatusEnglish = 'Very Dry';
      soilLevel = 'critical';
    } else if (soilMoisture < 35) {
      soilStatus = 'خشک ہو رہی ہے';
      soilStatusEnglish = 'Drying';
      soilLevel = 'dry';
    } else if (soilMoisture <= 65) {
      soilStatus = 'مناسب';
      soilStatusEnglish = 'Optimal';
      soilLevel = 'optimal';
    } else {
      soilStatus = 'گیلی';
      soilStatusEnglish = 'Wet';
      soilLevel = 'wet';
    }
    
    // --- WEATHER STATUS ---
    let weatherStatus = '';
    let weatherStatusEnglish = '';
    let weatherLevel = '';
    
    // Check rain first
    if (currentRainfall > 10) {
      weatherStatus = `تیز بارش (${currentRainfall}mm)`;
      weatherStatusEnglish = `Heavy Rain (${currentRainfall}mm)`;
      weatherLevel = 'heavy_rain';
    } else if (currentRainfall > 3) {
      weatherStatus = `ہلکی بارش (${currentRainfall}mm)`;
      weatherStatusEnglish = `Light Rain (${currentRainfall}mm)`;
      weatherLevel = 'light_rain';
    }
    // Check extreme heat
    else if (currentTemp > 42) {
      weatherStatus = `شدید گرمی کی لہر (${currentTemp}°C)`;
      weatherStatusEnglish = `Extreme Heat Wave (${currentTemp}°C)`;
      weatherLevel = 'extreme_heat';
    } else if (currentTemp > 38) {
      weatherStatus = `انتہائی گرمی (${currentTemp}°C)`;
      weatherStatusEnglish = `Severe Heat (${currentTemp}°C)`;
      weatherLevel = 'severe_heat';
    } else if (currentTemp > 32) {
      weatherStatus = `گرم موسم (${currentTemp}°C)`;
      weatherStatusEnglish = `Hot Weather (${currentTemp}°C)`;
      weatherLevel = 'hot';
    }
    // Check humidity
    else if (humidity > 75) {
      weatherStatus = `زیادہ نمی (${humidity}%)`;
      weatherStatusEnglish = `High Humidity (${humidity}%)`;
      weatherLevel = 'humid';
    } else if (humidity < 30) {
      weatherStatus = `خشک ہوا (${humidity}%)`;
      weatherStatusEnglish = `Dry Air (${humidity}%)`;
      weatherLevel = 'dry_air';
    }
    // Check condition
    else if (currentCondition === 'Clouds') {
      weatherStatus = 'ابر آلود موسم';
      weatherStatusEnglish = 'Cloudy Weather';
      weatherLevel = 'cloudy';
    } else if (currentCondition === 'Clear') {
      weatherStatus = 'صاف موسم';
      weatherStatusEnglish = 'Clear Weather';
      weatherLevel = 'clear';
    }
    // Forecast rain
    else if (forecastRainNext2Days) {
      weatherStatus = 'اگلے 2 دن بارش کا امکان';
      weatherStatusEnglish = 'Rain Expected Next 2 Days';
      weatherLevel = 'forecast_rain';
    }
    else {
      weatherStatus = 'معمول موسم';
      weatherStatusEnglish = 'Normal Weather';
      weatherLevel = 'normal';
    }
    
    // ========== DECISION LOGIC (Soil + Weather Combination) ==========
    
    // CASE 1: Soil CRITICAL (<20%) - Ignore weather, MUST irrigate
    if (soilLevel === 'critical') {
      return {
        shouldIrrigate: true,
        reason: `⚠️ مٹی ${soilStatus} ہے (${soilMoisture}%)۔ ${weatherStatus} کے باوجود فوری آبپاشی ضروری ہے۔`,
        reasonEnglish: `⚠️ Soil is ${soilStatusEnglish} (${soilMoisture}%). Despite ${weatherStatusEnglish}, immediate irrigation is necessary.`,
        priority: 'high',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 2: Currently HEAVY RAIN (>10mm)
    if (weatherLevel === 'heavy_rain') {
      return {
        shouldIrrigate: false,
        reason: `🌧️ ${weatherStatus} ہو رہی ہے۔ مٹی ${soilStatus} ہے (${soilMoisture}%)، بارش سے قدرتی آبپاشی کافی ہے۔`,
        reasonEnglish: `🌧️ ${weatherStatusEnglish} falling. Soil is ${soilStatusEnglish} (${soilMoisture}%), natural irrigation from rain is sufficient.`,
        priority: 'low',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 3: Light Rain + Soil not dry
    if (weatherLevel === 'light_rain' && soilLevel !== 'dry') {
      return {
        shouldIrrigate: false,
        reason: `🌦️ ${weatherStatus} ہو رہی ہے۔ مٹی ${soilStatus} ہے (${soilMoisture}%)، ہلکی بارش سے نمی بڑھ جائے گی۔`,
        reasonEnglish: `🌦️ ${weatherStatusEnglish} falling. Soil is ${soilStatusEnglish} (${soilMoisture}%), light rain will increase moisture.`,
        priority: 'low',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 4: EXTREME HEAT (>42°C)
    if (weatherLevel === 'extreme_heat') {
      return {
        shouldIrrigate: true,
        reason: `🥵 ${weatherStatus} ہے۔ مٹی ${soilStatus} ہے (${soilMoisture}%)، شدید گرمی میں پانی کی مقدار 30% بڑھا دیں۔`,
        reasonEnglish: `🥵 ${weatherStatusEnglish}. Soil is ${soilStatusEnglish} (${soilMoisture}%), increase water by 30% in extreme heat.`,
        priority: 'high',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 5: SEVERE HEAT (38-42°C) + Soil Dry or Low
    if (weatherLevel === 'severe_heat' && (soilLevel === 'dry' || soilLevel === 'critical')) {
      return {
        shouldIrrigate: true,
        reason: `🔥 ${weatherStatus} ہے اور مٹی ${soilStatus} ہے (${soilMoisture}%)۔ گرمی اور خشک مٹی کی وجہ سے فوری آبپاشی کریں۔`,
        reasonEnglish: `🔥 ${weatherStatusEnglish} and soil is ${soilStatusEnglish} (${soilMoisture}%). Irrigate immediately due to heat and dry soil.`,
        priority: 'high',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 6: Hot Weather (32-38°C) + Soil Dry
    if (weatherLevel === 'hot' && soilLevel === 'dry') {
      return {
        shouldIrrigate: true,
        reason: `☀️ ${weatherStatus} ہے اور مٹی ${soilStatus} ہے (${soilMoisture}%)۔ گرم موسم میں مٹی تیزی سے خشک ہو رہی ہے، آج آبپاشی کریں۔`,
        reasonEnglish: `☀️ ${weatherStatusEnglish} and soil is ${soilStatusEnglish} (${soilMoisture}%). Soil is drying quickly in hot weather, irrigate today.`,
        priority: 'medium',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 7: Hot Weather but Soil is Optimal
    if (weatherLevel === 'hot' && soilLevel === 'optimal') {
      return {
        shouldIrrigate: false,
        reason: `☀️ ${weatherStatus} ہے لیکن مٹی ${soilStatus} ہے (${soilMoisture}%)۔ گرمی کے باوجود موجودہ نمی کافی ہے۔ کل دوبارہ چیک کریں۔`,
        reasonEnglish: `☀️ ${weatherStatusEnglish} but soil is ${soilStatusEnglish} (${soilMoisture}%). Despite heat, current moisture is sufficient. Check again tomorrow.`,
        priority: 'low',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 8: Dry Air / Low Humidity + Soil Drying
    if (weatherLevel === 'dry_air' && soilLevel === 'dry') {
      return {
        shouldIrrigate: true,
        reason: `💨 ${weatherStatus} ہے اور مٹی ${soilStatus} ہے (${soilMoisture}%)۔ خشک ہوا مٹی کو مزید خشک کر رہی ہے، آبپاشی ضروری ہے۔`,
        reasonEnglish: `💨 ${weatherStatusEnglish} and soil is ${soilStatusEnglish} (${soilMoisture}%). Dry air is drying the soil further, irrigation needed.`,
        priority: 'medium',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 9: Forecast Rain in 2 days + Soil not dry
    if (weatherLevel === 'forecast_rain' && soilLevel !== 'dry' && soilLevel !== 'critical') {
      return {
        shouldIrrigate: false,
        reason: `📅 ${weatherStatus}۔ مٹی ${soilStatus} ہے (${soilMoisture}%)۔ بارش کا انتظار کریں، پانی کی بچت ہوگی۔`,
        reasonEnglish: `📅 ${weatherStatusEnglish}. Soil is ${soilStatusEnglish} (${soilMoisture}%). Wait for rain, it will save water.`,
        priority: 'medium',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 10: Forecast Rain but Soil is Dry
    if (weatherLevel === 'forecast_rain' && soilLevel === 'dry') {
      return {
        shouldIrrigate: true,
        reason: `📅 ${weatherStatus} لیکن مٹی ${soilStatus} ہے (${soilMoisture}%)۔ بارش سے پہلے مٹی بہت خشک ہے، فوری ہلکی آبپاشی کریں۔`,
        reasonEnglish: `📅 ${weatherStatusEnglish} but soil is ${soilStatusEnglish} (${soilMoisture}%). Soil is very dry before rain, do light irrigation immediately.`,
        priority: 'high',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 11: Soil WET (>65%)
    if (soilLevel === 'wet') {
      return {
        shouldIrrigate: false,
        reason: `💧 مٹی ${soilStatus} ہے (${soilMoisture}%)۔ ${weatherStatus} کی وجہ سے پانی پہلے سے زیادہ ہے، آبپاشی سے گریز کریں۔`,
        reasonEnglish: `💧 Soil is ${soilStatusEnglish} (${soilMoisture}%). Due to ${weatherStatusEnglish}, soil is already too wet, avoid irrigation.`,
        priority: 'high',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 12: Soil OPTIMAL (40-65%) + Normal Weather
    if (soilLevel === 'optimal') {
      return {
        shouldIrrigate: false,
        reason: `✅ مٹی ${soilStatus} ہے (${soilMoisture}%) اور ${weatherStatus} ہے۔ موجودہ حالات میں آبپاشی کی ضرورت نہیں۔`,
        reasonEnglish: `✅ Soil is ${soilStatusEnglish} (${soilMoisture}%) and ${weatherStatusEnglish}. No irrigation needed in current conditions.`,
        priority: 'low',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // CASE 13: Soil DRY (35-40%) + Normal Weather
    if (soilLevel === 'dry') {
      return {
        shouldIrrigate: true,
        reason: `🌱 مٹی ${soilStatus} ہے (${soilMoisture}%) اور ${weatherStatus} ہے۔ مٹی خشک ہو رہی ہے، آج یا کل آبپاشی کر لیں۔`,
        reasonEnglish: `🌱 Soil is ${soilStatusEnglish} (${soilMoisture}%) and ${weatherStatusEnglish}. Soil is drying, irrigate today or tomorrow.`,
        priority: 'medium',
        soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
        soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
        weatherStatus: `موسم: ${weatherStatus}`,
        weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
      };
    }
    
    // DEFAULT CASE
    return {
      shouldIrrigate: false,
      reason: `ℹ️ مٹی ${soilStatus} ہے (${soilMoisture}%) اور ${weatherStatus} ہے۔ معمول کے مطابق کوئی فوری کارروائی ضروری نہیں۔`,
      reasonEnglish: `ℹ️ Soil is ${soilStatusEnglish} (${soilMoisture}%) and ${weatherStatusEnglish}. No immediate action needed under normal conditions.`,
      priority: 'low',
      soilStatus: `مٹی: ${soilStatus} (${soilMoisture}%)`,
      soilStatusEnglish: `Soil: ${soilStatusEnglish} (${soilMoisture}%)`,
      weatherStatus: `موسم: ${weatherStatus}`,
      weatherStatusEnglish: `Weather: ${weatherStatusEnglish}`
    };
  }
}

export default new IrrigationLogicService();