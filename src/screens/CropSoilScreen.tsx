// src/screens/CropSoilScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  BackHandler,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import weatherService, { WeatherData, ForecastData } from '../services/weatherService';
import { styles } from './styles/CropSoilScreen.styles';

const CropSoilScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  
  // State variables
  const [activeTab, setActiveTab] = useState('soil');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedSoil, setSelectedSoil] = useState('loam');
  const [selectedDistrict, setSelectedDistrict] = useState('Lahore');
  const [fieldArea, setFieldArea] = useState('5.0');
  const [motorPower, setMotorPower] = useState('5');
  
  // Dropdown states
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showSoilDropdown, setShowSoilDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showMotorDropdown, setShowMotorDropdown] = useState(false);
  
  // Data states
  const [districts] = useState<string[]>([
    "Lahore", "Faisalabad", "Karachi", "Islamabad", "Rawalpindi",
    "Multan", "Gujranwala", "Peshawar", "Quetta", "Sargodha",
    "Sialkot", "Bahawalpur", "Sukkur", "Jhang", "Sheikhupura",
    "Rahim Yar Khan", "Gujrat", "Kasur", "Okara", "Sahiwal"
  ]);

  const [crops] = useState<string[]>([
    'wheat', 'rice', 'cotton', 'maize', 'sugarcane',
    'potato', 'gram'
  ]);

  const [soilTypes] = useState<string[]>([
    'loam', 'clay', 'sandy', 'sandy loam', 'clay loam'
  ]);

  const [motorPowers] = useState<string[]>([
    '2', '3', '5', '7', '10', '20', '30', '40', '50'
  ]);
  
  const motorTypeNames: Record<string, string> = {
    '2': 'Very Small',
    '3': 'Small',
    '5': 'Medium',
    '7': 'Upper Medium',
    '10': 'Large',
    '20': 'Heavy',
    '30': 'Extra Heavy',
    '40': 'Mega',
    '50': 'Ultra'
  };
  
  // Recommendation states
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [soilMoisture] = useState(45);
  
  // Weather states
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Back handler setup
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home' as never);
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);


  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'schedule') navigation.navigate('Schedule' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'alerts') navigation.navigate('Alerts' as never);
  };

  // Fetch weather data when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchWeatherData(selectedDistrict);
    }
  }, [selectedDistrict]);

  // Fetch weather data function
  const fetchWeatherData = async (district: string) => {
    setWeatherLoading(true);
    try {
      const weather = await weatherService.getCurrentWeather(district);
      const forecast = await weatherService.getWeatherForecast(district);
      
      setWeatherData(weather);
      setForecastData(forecast);
      
      // Set last updated time
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString(language === 'ur' ? 'ur-PK' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert(
        t('common.error'),
        language === 'ur' ? 'موسم کی معلومات حاصل کرنے میں خرابی' : 'Failed to fetch weather data',
        [{ text: t('common.ok'), style: 'default' }]
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  // Refresh weather data
  const refreshWeather = () => {
    fetchWeatherData(selectedDistrict);
  };

  // Calculate flow rate based on motor power (HP)
  const calculateFlowRate = (hp: number): number => {
    const flowRates: Record<number, number> = {
      2: 40,   // Very Small
      3: 60,   // Small
      5: 120,  // Medium
      7: 200,  // Upper Medium
      10: 300, // Large
      20: 600, // Heavy
      30: 900, // Extra Heavy
      40: 1200, // Mega
      50: 1500  // Ultra
    };
    
    return flowRates[hp] || 120;
  };

  // Generate recommendation function
  const generateRecommendation = () => {
    if (!selectedCrop || !selectedSoil || !fieldArea || !motorPower) {
      Alert.alert(
        t('common.error'),
        t('soil.fillAllFields'),
        [{ text: t('common.ok'), style: 'default' }]
      );
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      try {
        const area = parseFloat(fieldArea) || 1;
        const motorHP = parseFloat(motorPower) || 5;
        
        // Calculate flow rate from dataset
        const flowRate = calculateFlowRate(motorHP);
        const motorType = motorTypeNames[motorHP.toString()] || 'Medium';
        
        // Calculate water requirement (consider weather factor)
        const waterNeeded = calculateWaterRequirement(
          selectedCrop, 
          selectedSoil, 
          area, 
          weatherData
        );
        
        // Calculate irrigation duration
        const durationHours = calculateIrrigationDuration(waterNeeded, flowRate);
        
        // Adjust based on weather conditions
        const adjustedDuration = adjustIrrigationForWeather(durationHours, weatherData);
        
        // Get motor price range
        const priceRange = getMotorPriceRange(motorHP);
        
        const result = {
          water_needed_liters: waterNeeded,
          flow_rate_lpm: flowRate,
          duration_hours: adjustedDuration,
          motor_power_hp: motorHP,
          motor_type: motorType,
          price_range: priceRange,
          area_hectares: area,
          crop_type: selectedCrop,
          soil_type: selectedSoil,
          district: selectedDistrict,
          weather_impact: getWeatherImpact(weatherData)
        };

        setRecommendation(result);
        
        // Show success message
        Alert.alert(
          t('soil.success'),
          language === 'ur' 
            ? `آبپاشی کی سفارش تیار کر لی گئی ہے۔ ${adjustedDuration} گھنٹے آبپاشی کریں۔`
            : `Irrigation recommendation generated. Irrigate for ${adjustedDuration} hours.`,
          [{ text: t('common.ok'), style: 'default' }]
        );
        
      } catch (error) {
        console.error(error);
        Alert.alert(
          t('common.error'),
          t('soil.generationFailed'),
          [{ text: t('common.ok'), style: 'default' }]
        );
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  // Calculate water requirement with weather factor
  const calculateWaterRequirement = (
    crop: string, 
    soil: string, 
    area: number, 
    weather: WeatherData | null
  ): number => {
    const cropWaterMap: Record<string, number> = {
      'wheat': 4.5,
      'rice': 6.8,
      'cotton': 5.2,
      'maize': 4.8,
      'sugarcane': 7.5,
      'potato': 4.0,
      'gram': 3.5
    };

    const baseWater = cropWaterMap[crop] || 4.0;
    
    // Weather factor (temperature and humidity based)
    let weatherFactor = 1.0;
    if (weather) {
      if (weather.temp > 35) weatherFactor *= 1.2; // Hot weather
      if (weather.temp < 20) weatherFactor *= 0.8; // Cool weather
      if (weather.humidity < 30) weatherFactor *= 1.1; // Dry air
      if (weather.humidity > 70) weatherFactor *= 0.9; // Humid air
      if (weather.rainfall > 10) weatherFactor *= 0.5; // Recent rain
    }
    
    const waterLiters = baseWater * 10 * 10000 * area * weatherFactor;
    
    return Math.round(waterLiters);
  };

  // Calculate irrigation duration
  const calculateIrrigationDuration = (waterNeeded: number, flowRate: number): number => {
    if (flowRate <= 0) return 0;
    
    const durationMinutes = waterNeeded / flowRate;
    const durationHours = durationMinutes / 60;
    
    return Math.max(0.5, Math.round(durationHours * 10) / 10);
  };

  // Adjust irrigation based on weather
  const adjustIrrigationForWeather = (
    duration: number, 
    weather: WeatherData | null
  ): number => {
    if (!weather) return duration;
    
    let adjusted = duration;
    
    // Reduce irrigation if it rained today
    if (weather.rainfall > 5) {
      adjusted *= 0.7;
    }
    
    // Increase if hot and dry
    if (weather.temp > 35 && weather.humidity < 40) {
      adjusted *= 1.3;
    }
    
    // Decrease if cool and humid
    if (weather.temp < 25 && weather.humidity > 60) {
      adjusted *= 0.8;
    }
    
    return Math.max(0.5, Math.round(adjusted * 10) / 10);
  };

  // Get weather impact description
  const getWeatherImpact = (weather: WeatherData | null): string => {
    if (!weather) return language === 'ur' ? 'معمول' : 'Normal';
    
    if (weather.rainfall > 10) return language === 'ur' ? 'بارش کی وجہ سے کم' : 'Reduced due to rain';
    if (weather.temp > 35) return language === 'ur' ? 'گرمی کی وجہ سے زیادہ' : 'Increased due to heat';
    if (weather.humidity < 30) return language === 'ur' ? 'خشک ہوا کی وجہ سے زیادہ' : 'Increased due to dry air';
    
    return language === 'ur' ? 'معمول' : 'Normal';
  };

  // Get motor price range
  const getMotorPriceRange = (hp: number): string => {
    const priceRanges: Record<number, string> = {
      2: "12,000-18,000 PKR",
      3: "15,000-25,000 PKR",
      5: "30,000-45,000 PKR",
      7: "45,000-65,000 PKR",
      10: "70,000-100,000 PKR",
      20: "100,000-150,000 PKR",
      30: "150,000-220,000 PKR",
      40: "220,000-300,000 PKR",
      50: "300,000-400,000 PKR"
    };
    
    return priceRanges[hp] || "30,000-45,000 PKR";
  };

  // Get moisture status
  const getMoistureStatus = (moisture: number) => {
    if (moisture < 30) return { 
      text: language === 'ur' ? 'کم' : 'Low', 
      color: '#ef4444', 
      bg: '#fef2f2' 
    };
    if (moisture < 60) return { 
      text: language === 'ur' ? 'درمیانی' : 'Medium', 
      color: '#f59e0b', 
      bg: '#fffbeb' 
    };
    return { 
      text: language === 'ur' ? 'اچھی' : 'Good', 
      color: '#10b981', 
      bg: '#f0fdf4' 
    };
  };

  // Get weather condition icon
  const getWeatherIcon = (condition: string): string => {
    const icons: Record<string, string> = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Smoke': '💨',
      'Haze': '😶‍🌫️',
      'Dust': '💨',
      'Fog': '🌫️',
      'Sand': '💨',
      'Ash': '🌋',
      'Squall': '💨',
      'Tornado': '🌪️'
    };
    
    return icons[condition] || '🌤️';
  };

  // Crop options for dropdown
  const cropOptions = crops.map(crop => ({
    id: crop,
    label: t(`soil.${crop}`) || crop.charAt(0).toUpperCase() + crop.slice(1)
  }));

  // Soil options for dropdown
  const soilOptions = soilTypes.map(soil => ({
    id: soil,
    label: t(`soil.${soil}`) || soil.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }));

  // District options
  const districtOptions = districts.map(district => ({
    id: district,
    label: district
  }));

  // Motor power options
  const motorOptions = motorPowers.map(power => ({
    id: power,
    label: `${power} HP (${motorTypeNames[power] || 'Medium'})`
  }));

  const status = getMoistureStatus(soilMoisture);

  // Render dropdown item
  const renderDropdownItem = ({ item, selected, onSelect }: any) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selected === item.id && styles.dropdownItemSelected,
        isDark && styles.dropdownItemDark,
        selected === item.id && isDark && styles.dropdownItemSelectedDark
      ]}
      onPress={() => onSelect(item.id)}
    >
      <Text style={[
        styles.dropdownItemText,
        isDark && styles.dropdownItemTextDark,
        selected === item.id && styles.dropdownItemTextSelected
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Header showLogout={false} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}>
            <Text style={styles.titleIconText}>🌱</Text>
          </View>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('soil.title')}
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            {t('soil.smartIrrigation')}
          </Text>
        </View>

        {/* Input Form */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            🌾 {t('soil.farmDetails')}
          </Text>
          
          <View style={styles.selectionContainer}>
            {/* District Selection */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>
                {t('soil.district')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  isDark && styles.dropdownButtonDark,
                  showDistrictDropdown && styles.dropdownButtonOpen
                ]}
                onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  isDark && styles.dropdownButtonTextDark
                ]}>
                  {selectedDistrict}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showDistrictDropdown ? '⌃' : '⌄'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Crop Selection */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>
                {t('soil.cropType')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  isDark && styles.dropdownButtonDark,
                  showCropDropdown && styles.dropdownButtonOpen
                ]}
                onPress={() => setShowCropDropdown(!showCropDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  isDark && styles.dropdownButtonTextDark
                ]}>
                  {cropOptions.find(c => c.id === selectedCrop)?.label}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showCropDropdown ? '⌃' : '⌄'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Soil Selection */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>
                {t('soil.soilType')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  isDark && styles.dropdownButtonDark,
                  showSoilDropdown && styles.dropdownButtonOpen
                ]}
                onPress={() => setShowSoilDropdown(!showSoilDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  isDark && styles.dropdownButtonTextDark
                ]}>
                  {soilOptions.find(s => s.id === selectedSoil)?.label}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showSoilDropdown ? '⌃' : '⌄'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Field Area Input */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>
                {t('soil.fieldArea')} (hectares)
              </Text>
              <View style={[
                styles.inputContainer,
                isDark && styles.inputContainerDark
              ]}>
                <Text style={styles.inputPrefix}>📏</Text>
                <TextInput
                  style={[
                    styles.input,
                    isDark && styles.inputDark
                  ]}
                  value={fieldArea}
                  onChangeText={setFieldArea}
                  placeholder={language === 'ur' ? 'رقبہ درج کریں' : 'Enter area'}
                  keyboardType="numeric"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
                <Text style={styles.inputSuffix}>ha</Text>
              </View>
            </View>

            {/* Motor Power Selection */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>
                {t('soil.motorPower')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  isDark && styles.dropdownButtonDark,
                  showMotorDropdown && styles.dropdownButtonOpen
                ]}
                onPress={() => setShowMotorDropdown(!showMotorDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  isDark && styles.dropdownButtonTextDark
                ]}>
                  {motorOptions.find(m => m.id === motorPower)?.label}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showMotorDropdown ? '⌃' : '⌄'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={generateRecommendation}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.generateButtonIcon}>🤖</Text>
                  <Text style={styles.generateButtonText}>
                    {t('soil.generateRecommendation')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Soil Moisture Card */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.moistureHeader}>
            <View style={styles.moistureIcon}>
              <Text style={styles.moistureIconText}>💧</Text>
            </View>
            <View>
              <Text style={[styles.moistureTitle, isDark && styles.moistureTitleDark]}>
                {t('soil.moisture')}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>
            </View>
          </View>

          {/* Moisture Progress */}
          <View style={styles.moistureContainer}>
            <View style={styles.moistureInfo}>
              <Text style={[styles.moistureLabel, isDark && styles.moistureLabelDark]}>
                {t('soil.moistureLevel')}
              </Text>
              <Text style={[styles.moistureValue, isDark && styles.moistureValueDark]}>
                {soilMoisture}%
              </Text>
            </View>
            <View style={[styles.progressBar, isDark && styles.progressBarDark]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${soilMoisture}%`,
                    backgroundColor: soilMoisture < 30 ? '#ef4444' : soilMoisture < 60 ? '#f59e0b' : '#10b981'
                  }
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, isDark && styles.progressLabelDark]}>0%</Text>
              <Text style={[styles.progressLabel, isDark && styles.progressLabelDark]}>50%</Text>
              <Text style={[styles.progressLabel, isDark && styles.progressLabelDark]}>100%</Text>
            </View>
          </View>
        </View>

        {/* Recommendations Display */}
        {recommendation && (
          <>
            {/* Main Recommendation Card */}
            <View style={[styles.card, isDark && styles.cardDark]}>
              <View style={styles.aiHeader}>
                <View style={styles.aiIcon}>
                  <Text style={styles.aiIconText}>💧</Text>
                </View>
                <View>
                  <Text style={[styles.aiTitle, isDark && styles.aiTitleDark]}>
                    {language === 'ur' ? 'آبپاشی کی سفارش' : 'Irrigation Recommendation'}
                  </Text>
                  <Text style={[styles.aiDescription, isDark && styles.aiDescriptionDark]}>
                    {language === 'ur' 
                      ? `موسم کا اثر: ${recommendation.weather_impact}`
                      : `Weather impact: ${recommendation.weather_impact}`
                    }
                  </Text>
                </View>
              </View>

              <View style={[styles.recommendationBox, { backgroundColor: '#d1fae5' }]}>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationIcon}>⏱️</Text>
                  <Text style={[styles.recommendationText, { color: '#065f46' }]}>
                    {language === 'ur' 
                      ? `دورانیہ: ${recommendation.duration_hours} گھنٹے`
                      : `Duration: ${recommendation.duration_hours} hours`
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.waterContainer}>
                <View style={styles.waterInfo}>
                  <Text style={[styles.waterLabel, isDark && styles.waterLabelDark]}>
                    {language === 'ur' ? 'پانی کی ضرورت' : 'Water Required'}
                  </Text>
                  <Text style={[styles.waterValue, isDark && styles.waterValueDark]}>
                    {recommendation.water_needed_liters.toLocaleString()} L
                  </Text>
                </View>
                
                <View style={styles.detailsGrid}>
                  <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
                    <Text style={styles.detailIcon}>⚡</Text>
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                        {language === 'ur' ? 'موٹر پاور' : 'Motor Power'}
                      </Text>
                      <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                        {recommendation.motor_power_hp} HP
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
                    <Text style={styles.detailIcon}>💧</Text>
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                        {language === 'ur' ? 'پانی کی رفتار' : 'Flow Rate'}
                      </Text>
                      <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                        {recommendation.flow_rate_lpm} L/min
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Live Weather Information */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.weatherHeader}>
            <View>
              <Text style={[styles.weatherTitle, isDark && styles.weatherTitleDark]}>
                🌤️ {t('soil.currentWeather')}
              </Text>
              {lastUpdated && (
                <Text style={[styles.lastUpdated, isDark && styles.lastUpdatedDark]}>
                  {language === 'ur' 
                    ? `آخری اپ ڈیٹ: ${lastUpdated}`
                    : `Last updated: ${lastUpdated}`
                  }
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={refreshWeather} disabled={weatherLoading}>
              {weatherLoading ? (
                <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#3b82f6'} />
              ) : (
                <Text style={[styles.refreshIcon, isDark && styles.refreshIconDark]}>
                  🔄
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          {weatherData ? (
            <>
              {/* Current Weather Summary */}
              <View style={styles.currentWeatherContainer}>
                <View style={styles.conditionContainer}>
                  <Text style={styles.weatherIconLarge}>
                    {getWeatherIcon(weatherData.condition)}
                  </Text>
                  <View>
                    <Text style={[styles.tempLarge, isDark && styles.tempLargeDark]}>
                      {weatherData.temp}°C
                    </Text>
                    <Text style={[styles.conditionText, isDark && styles.conditionTextDark]}>
                      {weatherData.condition}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.weatherDetails}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                      {language === 'ur' ? 'محسوس ہوتا ہے' : 'Feels like'}
                    </Text>
                    <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                      {weatherData.feelsLike}°C
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                      {t('soil.humidity')}
                    </Text>
                    <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                      {weatherData.humidity}%
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                      {t('soil.rainfall')}
                    </Text>
                    <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                      {weatherData.rainfall} mm
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                      {language === 'ur' ? 'ہوا کی رفتار' : 'Wind Speed'}
                    </Text>
                    <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                      {weatherData.windSpeed} km/h
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* 5-Day Forecast */}
              {forecastData.length > 0 && (
                <View style={styles.forecastContainer}>
                  <Text style={[styles.forecastTitle, isDark && styles.forecastTitleDark]}>
                    📅 {language === 'ur' ? 'اگلے 5 دن' : 'Next 5 Days'}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {forecastData.map((day, index) => (
                      <View key={index} style={[styles.forecastItem, isDark && styles.forecastItemDark]}>
                        <Text style={[styles.forecastDay, isDark && styles.forecastDayDark]}>
                          {day.date}
                        </Text>
                        <Text style={styles.forecastIcon}>
                          {getWeatherIcon(day.condition)}
                        </Text>
                        <Text style={[styles.forecastTemp, isDark && styles.forecastTempDark]}>
                          {day.temp}°C
                        </Text>
                        <Text style={[styles.forecastRain, isDark && styles.forecastRainDark]}>
                          {day.rainfall > 0 ? `🌧️ ${day.rainfall}mm` : '🌤️'}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#3b82f6'} />
              <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
                {weatherLoading ? t('common.loading') : language === 'ur' ? 'موسم کی معلومات لوڈ ہو رہی ہے' : 'Loading weather data...'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Dropdown Modals */}
      {showDistrictDropdown && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showDistrictDropdown}
          onRequestClose={() => setShowDistrictDropdown(false)}
        >
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowDistrictDropdown(false)}
          >
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList
                data={districtOptions}
                renderItem={({ item }) => renderDropdownItem({
                  item,
                  selected: selectedDistrict,
                  onSelect: (id: string) => {
                    setSelectedDistrict(id);
                    setShowDistrictDropdown(false);
                  }
                })}
                keyExtractor={(item) => item.id}
                style={styles.dropdownList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showCropDropdown && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showCropDropdown}
          onRequestClose={() => setShowCropDropdown(false)}
        >
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowCropDropdown(false)}
          >
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList
                data={cropOptions}
                renderItem={({ item }) => renderDropdownItem({
                  item,
                  selected: selectedCrop,
                  onSelect: (id: string) => {
                    setSelectedCrop(id);
                    setShowCropDropdown(false);
                  }
                })}
                keyExtractor={(item) => item.id}
                style={styles.dropdownList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showSoilDropdown && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showSoilDropdown}
          onRequestClose={() => setShowSoilDropdown(false)}
        >
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowSoilDropdown(false)}
          >
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList
                data={soilOptions}
                renderItem={({ item }) => renderDropdownItem({
                  item,
                  selected: selectedSoil,
                  onSelect: (id: string) => {
                    setSelectedSoil(id);
                    setShowSoilDropdown(false);
                  }
                })}
                keyExtractor={(item) => item.id}
                style={styles.dropdownList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showMotorDropdown && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showMotorDropdown}
          onRequestClose={() => setShowMotorDropdown(false)}
        >
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowMotorDropdown(false)}
          >
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList
                data={motorOptions}
                renderItem={({ item }) => renderDropdownItem({
                  item,
                  selected: motorPower,
                  onSelect: (id: string) => {
                    setMotorPower(id);
                    setShowMotorDropdown(false);
                  }
                })}
                keyExtractor={(item) => item.id}
                style={styles.dropdownList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default CropSoilScreen;