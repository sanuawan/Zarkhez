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
  TextInput
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

  // --- 1. DATA STATES (Matches Python Model) ---
  const [districts] = useState<string[]>([
    "Faisalabad", "Multan", "Sargodha", "Bahawalpur",
    "Lahore", "Sukkur", "Hyderabad"
  ]);

  const [crops] = useState<string[]>([
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'
  ]);

  const [soilTypes] = useState<string[]>([
    'Loam', 'Clay', 'Sandy'
  ]);

  const [motorPowers] = useState<string[]>([
    '5', '7.5', '10', '15', '20', '25', '30', '40', '50'
  ]);

  // Motor Types Mapping
  const motorTypeNames: Record<string, string> = {
    '5': 'Medium',
    '7.5': 'Medium Plus',
    '10': 'Large',
    '15': 'Large Plus',
    '20': 'Heavy',
    '25': 'Heavy Plus',
    '30': 'Extra Heavy',
    '40': 'Mega',
    '50': 'Ultra'
  };

  // --- 2. USER SELECTION STATES ---
  const [activeTab, setActiveTab] = useState('soil');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedSoil, setSelectedSoil] = useState('Loam');
  const [selectedDistrict, setSelectedDistrict] = useState('Lahore');
  const [fieldArea, setFieldArea] = useState('5.0');
  const [motorPower, setMotorPower] = useState('5');

  // Dropdown Visibility States
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showSoilDropdown, setShowSoilDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showMotorDropdown, setShowMotorDropdown] = useState(false);

  // Result & Weather States
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [soilMoisture] = useState(45);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Back Handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home' as never);
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  // Navigation Handler
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'schedule') navigation.navigate('Schedule' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'alerts') navigation.navigate('Alerts' as never);
  };

  // Fetch Weather on District Change
  useEffect(() => {
    if (selectedDistrict) {
      fetchWeatherData(selectedDistrict);
    }
  }, [selectedDistrict]);

  const fetchWeatherData = async (district: string) => {
    setWeatherLoading(true);
    try {
      const weather = await weatherService.getCurrentWeather(district);
      const forecast = await weatherService.getWeatherForecast(district);
      setWeatherData(weather);
      setForecastData(forecast);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString(language === 'ur' ? 'ur-PK' : 'en-US', {
        hour: '2-digit', minute: '2-digit'
      }));
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert(t('common.error'), language === 'ur' ? 'موسم کی معلومات حاصل کرنے میں خرابی' : 'Failed to fetch weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  const refreshWeather = () => {
    fetchWeatherData(selectedDistrict);
  };



  // Helper: Weather Impact Text
  const getWeatherImpact = (weather: WeatherData | null): string => {
    if (!weather) return language === 'ur' ? 'معمول' : 'Normal';
    if (weather.rainfall > 10) return language === 'ur' ? 'بارش کی وجہ سے کم' : 'Reduced due to rain';
    if (weather.temp > 35) return language === 'ur' ? 'گرمی کی وجہ سے زیادہ' : 'Increased due to heat';
    if (weather.humidity < 30) return language === 'ur' ? 'خشک ہوا کی وجہ سے زیادہ' : 'Increased due to dry air';
    return language === 'ur' ? 'معمول' : 'Normal';
  };

  // --- 3. MAIN RECOMMENDATION FUNCTION (API CALL) ---
  const generateRecommendation = async () => {
    // 1. Validation
    if (!selectedCrop || !selectedSoil || !fieldArea || !motorPower) {
      Alert.alert(t('common.error'), t('soil.fillAllFields'), [{ text: t('common.ok'), style: 'default' }]);
      return;
    }

    setLoading(true);

    try {
      // 2. API Call
      // Yahan apna Render wala Link lagayen
      const API_URL = 'https://irrigation-backend-9qtw.onrender.com/predict';

      // ✅ FIX: Keys ab bilkul waisi hain jaisi app.py main hain
      const requestBody = {
        District: selectedDistrict,
        Crop: selectedCrop,
        Soil: selectedSoil,
        Area_Hectares: parseFloat(fieldArea),
        Motor_HP: parseFloat(motorPower)
      };

      console.log("Sending Data to Server:", requestBody);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      // Agar server ne error bheja ho
      if (data.status === 'failed' || data.error) {
        throw new Error(data.error || "Unknown server error");
      }

      // 3. Result Processing
      // ✅ FIX: Ab hum wahi data utha rahay hain jo app.py bhej raha hai
      // Python code ne khud hi liters aur hours calculate kr k bheje hain
      const waterNeeded = data.water_liters;
      const durationHours = data.irrigation_hours;

      // Motor details for UI display
      const motorHP = parseFloat(motorPower);
      const motorLabel = motorTypeNames[motorPower] || 'Standard';

      // Flow Rate UI k liye dikhana ho to (Optional calculation)
      // Logic: Liters / (Hours * 60)
      const flowRateLPM = Math.round(waterNeeded / (durationHours * 60));

      // 4. Final Object for UI
      const result = {
        water_needed_liters: waterNeeded,
        flow_rate_lpm: flowRateLPM || 0, // Fallback
        duration_hours: durationHours,
        motor_power_hp: motorHP,
        motor_type: motorLabel,
        area_hectares: parseFloat(fieldArea),
        crop_type: selectedCrop,
        soil_type: selectedSoil,
        district: selectedDistrict,
        weather_impact: getWeatherImpact(weatherData)
      };

      setRecommendation(result);

      Alert.alert(
        t('soil.success'),
        language === 'ur'
          ? `پانی کی ضرورت: ${waterNeeded.toLocaleString()} لیٹر\nدورانیہ: ${durationHours} گھنٹے`
          : `Water Needed: ${waterNeeded.toLocaleString()} Liters\nDuration: ${durationHours} Hours`,
        [{ text: t('common.ok'), style: 'default' }]
      );

    } catch (error: any) {
      console.error("API Error Detailed:", error);
      Alert.alert(
        t('common.error'),
        "Connection Failed. Check Internet or Inputs.\n" + (error.message || ""),
        [{ text: t('common.ok'), style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // --- UI HELPERS ---
  const getMoistureStatus = (moisture: number) => {
    if (moisture < 30) return { text: language === 'ur' ? 'کم' : 'Low', color: '#ef4444', bg: '#fef2f2' };
    if (moisture < 60) return { text: language === 'ur' ? 'درمیانی' : 'Medium', color: '#f59e0b', bg: '#fffbeb' };
    return { text: language === 'ur' ? 'اچھی' : 'Good', color: '#10b981', bg: '#f0fdf4' };
  };

  const getWeatherIcon = (condition: string): string => {
    const icons: Record<string, string> = {
      'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
      'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Smoke': '💨',
      'Haze': '😶‍🌫️', 'Dust': '💨', 'Fog': '🌫️', 'Sand': '💨'
    };
    return icons[condition] || '🌤️';
  };

  // Dropdown Options Generation (REPLACE THIS BLOCK)
  const cropOptions = crops.map(c => ({ id: c, label: t(`soil.${c.toLowerCase()}`) }));
  const soilOptions = soilTypes.map(s => ({ id: s, label: t(`soil.${s.toLowerCase()}`) }));
  const districtOptions = districts.map(d => ({ id: d, label: t(`district.${d.toLowerCase()}`) }));

  const motorOptions = motorPowers.map(power => {
    const mType = motorTypeNames[power] || 'Standard';
    return {
      id: power,
      label: `${power} HP (${t(`motorType.${mType}`)})`
    };
  });

  const status = getMoistureStatus(soilMoisture);

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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 1. Title Section */}
        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}><Text style={styles.titleIconText}>🌱</Text></View>
          <Text style={[styles.title, isDark && styles.titleDark]}>{t('soil.title')}</Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{t('soil.smartIrrigation')}</Text>
        </View>

        {/* 2. Input Form Card */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>🌾 {t('soil.farmDetails')}</Text>

          <View style={styles.selectionContainer}>
            {/* District */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>{t('soil.district')}</Text>
              <TouchableOpacity style={[styles.dropdownButton, isDark && styles.dropdownButtonDark]} onPress={() => setShowDistrictDropdown(true)}>
                <Text style={[styles.dropdownButtonText, isDark && styles.dropdownButtonTextDark]}>
                  {t(`district.${selectedDistrict.toLowerCase()}`)}
                </Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Crop */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>{t('soil.cropType')}</Text>
              <TouchableOpacity style={[styles.dropdownButton, isDark && styles.dropdownButtonDark]} onPress={() => setShowCropDropdown(true)}>
                <Text style={[styles.dropdownButtonText, isDark && styles.dropdownButtonTextDark]}>
                  {t(`soil.${selectedCrop.toLowerCase()}`)}
                </Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Soil */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>{t('soil.soilType')}</Text>
              <TouchableOpacity style={[styles.dropdownButton, isDark && styles.dropdownButtonDark]} onPress={() => setShowSoilDropdown(true)}>
                <Text style={[styles.dropdownButtonText, isDark && styles.dropdownButtonTextDark]}>
                  {t(`soil.${selectedSoil.toLowerCase()}`)}
                </Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Area */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>{t('soil.fieldArea')} (ha)</Text>
              <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
                <Text style={styles.inputPrefix}>📏</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={fieldArea}
                  onChangeText={setFieldArea}
                  placeholder="Enter area"
                  keyboardType="numeric"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>
            </View>

            {/* Motor Power */}
            <View style={styles.selectionItem}>
              <Text style={[styles.label, isDark && styles.labelDark]}>{t('soil.motorPower')}</Text>
              <TouchableOpacity style={[styles.dropdownButton, isDark && styles.dropdownButtonDark]} onPress={() => setShowMotorDropdown(true)}>
                <Text style={[styles.dropdownButtonText, isDark && styles.dropdownButtonTextDark]}>
                  {motorOptions.find(m => m.id === motorPower)?.label || motorPower}
                </Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Generate Button */}
            <TouchableOpacity style={[styles.generateButton, loading && styles.generateButtonDisabled]} onPress={generateRecommendation} disabled={loading}>
              {loading ? <ActivityIndicator color="#ffffff" /> : (
                <>
                  <Text style={styles.generateButtonIcon}>🤖</Text>
                  <Text style={styles.generateButtonText}>{t('soil.generateRecommendation')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Recommendation Result (MOVED UP) */}
        {recommendation && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIcon}><Text style={styles.aiIconText}>💧</Text></View>
              <View>
                <Text style={[styles.aiTitle, isDark && styles.aiTitleDark]}>{language === 'ur' ? 'آبپاشی کی سفارش' : 'Recommendation'}</Text>
                <Text style={[styles.aiDescription, isDark && styles.aiDescriptionDark]}>{language === 'ur' ? `موسم کا اثر: ${recommendation.weather_impact}` : `Impact: ${recommendation.weather_impact}`}</Text>
              </View>
            </View>

            {/* Green Box with Water & Time */}
            <View style={[styles.recommendationBox, { backgroundColor: '#d1fae5', flexDirection: 'column', alignItems: 'flex-start', paddingVertical: 15 }]}>
              <View style={[styles.recommendationContent, { marginBottom: 8 }]}>
                <Text style={styles.recommendationIcon}>💧</Text>
                <Text style={[styles.recommendationText, { color: '#065f46' }]}>
                  {language === 'ur'
                    ? `پانی: ${recommendation.water_needed_liters.toLocaleString()} لیٹر`
                    : `Water: ${recommendation.water_needed_liters.toLocaleString()} Liters`}
                </Text>
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationIcon}>⏱️</Text>
                <Text style={[styles.recommendationText, { color: '#065f46' }]}>
                  {language === 'ur'
                    ? `دورانیہ: ${recommendation.duration_hours} گھنٹے`
                    : `Duration: ${recommendation.duration_hours} Hours`}
                </Text>
              </View>
            </View>

            <View style={styles.waterContainer}>
              <View style={styles.detailsGrid}>
                <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
                  <Text style={styles.detailIcon}>⚡</Text>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>Motor</Text>
                    <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>{recommendation.motor_power_hp} HP</Text>
                  </View>
                </View>
                <View style={[styles.detailItem, isDark && styles.detailItemDark]}>
                  <Text style={styles.detailIcon}>🌊</Text>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>Flow</Text>
                    <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>{recommendation.flow_rate_lpm} L/min</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 4. Soil Moisture (MOVED DOWN) */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.moistureHeader}>
            <View style={styles.moistureIcon}><Text style={styles.moistureIconText}>💧</Text></View>
            <View>
              <Text style={[styles.moistureTitle, isDark && styles.moistureTitleDark]}>{t('soil.moisture')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
              </View>
            </View>
          </View>
          <View style={styles.moistureContainer}>
            <View style={styles.moistureInfo}>
              <Text style={[styles.moistureLabel, isDark && styles.moistureLabelDark]}>{t('soil.moistureLevel')}</Text>
              <Text style={[styles.moistureValue, isDark && styles.moistureValueDark]}>{soilMoisture}%</Text>
            </View>
            <View style={[styles.progressBar, isDark && styles.progressBarDark]}>
              <View style={[styles.progressFill, { width: `${soilMoisture}%`, backgroundColor: status.color }]} />
            </View>
          </View>
        </View>

        {/* 5. Weather Section */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.weatherHeader}>
            <View>
              <Text style={[styles.weatherTitle, isDark && styles.weatherTitleDark]}>🌤️ {t('soil.currentWeather')}</Text>
              {lastUpdated && <Text style={[styles.lastUpdated, isDark && styles.lastUpdatedDark]}>Update: {lastUpdated}</Text>}
            </View>
            <TouchableOpacity onPress={refreshWeather} disabled={weatherLoading}>
              {weatherLoading ? <ActivityIndicator size="small" color="#3b82f6" /> : <Text style={styles.refreshIcon}>🔄</Text>}
            </TouchableOpacity>
          </View>
          {weatherData ? (
            <>
              <View style={styles.currentWeatherContainer}>
                <View style={styles.conditionContainer}>
                  <Text style={styles.weatherIconLarge}>{getWeatherIcon(weatherData.condition)}</Text>
                  <View>
                    <Text style={[styles.tempLarge, isDark && styles.tempLargeDark]}>{weatherData.temp}°C</Text>
                    <Text style={[styles.conditionText, isDark && styles.conditionTextDark]}>{weatherData.condition}</Text>
                  </View>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.detailRow}><Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>{t('soil.humidity')}</Text><Text style={[styles.detailValue, isDark && styles.detailValueDark]}>{weatherData.humidity}%</Text></View>
                  <View style={styles.detailRow}><Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>{t('soil.rainfall')}</Text><Text style={[styles.detailValue, isDark && styles.detailValueDark]}>{weatherData.rainfall}mm</Text></View>
                </View>
              </View>
              {forecastData.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastContainer}>
                  {forecastData.map((day, index) => (
                    <View key={index} style={[styles.forecastItem, isDark && styles.forecastItemDark]}>
                      <Text style={[styles.forecastDay, isDark && styles.forecastDayDark]}>{day.date}</Text>
                      <Text style={styles.forecastIcon}>{getWeatherIcon(day.condition)}</Text>
                      <Text style={[styles.forecastTemp, isDark && styles.forecastTempDark]}>{day.temp}°C</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </>
          ) : (
            <View style={styles.loadingContainer}><Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>Loading Weather...</Text></View>
          )}
        </View>

      </ScrollView>

      {/* Modals */}
      {showDistrictDropdown && (
        <Modal transparent visible={showDistrictDropdown} animationType="fade" onRequestClose={() => setShowDistrictDropdown(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowDistrictDropdown(false)}>
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList data={districtOptions} renderItem={({ item }) => renderDropdownItem({ item, selected: selectedDistrict, onSelect: (id: string) => { setSelectedDistrict(id); setShowDistrictDropdown(false); } })} keyExtractor={item => item.id} />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showCropDropdown && (
        <Modal transparent visible={showCropDropdown} animationType="fade" onRequestClose={() => setShowCropDropdown(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowCropDropdown(false)}>
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList data={cropOptions} renderItem={({ item }) => renderDropdownItem({ item, selected: selectedCrop, onSelect: (id: string) => { setSelectedCrop(id); setShowCropDropdown(false); } })} keyExtractor={item => item.id} />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showSoilDropdown && (
        <Modal transparent visible={showSoilDropdown} animationType="fade" onRequestClose={() => setShowSoilDropdown(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowSoilDropdown(false)}>
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList data={soilOptions} renderItem={({ item }) => renderDropdownItem({ item, selected: selectedSoil, onSelect: (id: string) => { setSelectedSoil(id); setShowSoilDropdown(false); } })} keyExtractor={item => item.id} />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showMotorDropdown && (
        <Modal transparent visible={showMotorDropdown} animationType="fade" onRequestClose={() => setShowMotorDropdown(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowMotorDropdown(false)}>
            <View style={[styles.dropdownModal, isDark && styles.dropdownModalDark]}>
              <FlatList data={motorOptions} renderItem={({ item }) => renderDropdownItem({ item, selected: motorPower, onSelect: (id: string) => { setMotorPower(id); setShowMotorDropdown(false); } })} keyExtractor={item => item.id} />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default CropSoilScreen;