// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
  BackHandler,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNavBar from '../components/BottomNavBar';
import { styles } from './styles/HomeScreen.styles';
import { useTheme } from '../contexts/ThemeContext';
import Geolocation from '@react-native-community/geolocation';
import weatherService from '../services/weatherService';
import { PermissionsAndroid, Platform } from 'react-native';

const HomeScreen: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('home');
  const [autoMode, setAutoMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [enteredName, setEnteredName] = useState('');
  const [inputError, setInputError] = useState(false);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [currentRate, setCurrentRate] = useState<number>(200);
  const [voltage, setVoltage] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);

  // 🔥 Command (UI ne bheja) aur Status (ESP32 ne confirm kiya)
  const [motorCommand, setMotorCommand] = useState<'on' | 'off'>('off');
  const [motorStatus, setMotorStatus] = useState<'on' | 'off'>('off');

  // 🔥 Timeout ref
  const commandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // motorStatus ka latest value timeout ke andar use karne ke liye
  const motorStatusRef = useRef<'on' | 'off'>('off');

  const [temperature, setTemperature] = useState<number | string>('--');
  const [humidity, setHumidity] = useState<number | string>('--');
  const [weatherCondition, setWeatherCondition] = useState<string>('Clear');

  // Derived states
  const isTransitioning = motorCommand !== motorStatus;
  const motorOn = motorStatus === 'on';

  // motorStatus update hone par ref bhi update karo
  useEffect(() => {
    motorStatusRef.current = motorStatus;
  }, [motorStatus]);

  // 🔥 Jab ESP32 respond kare — timeout clear karo
  useEffect(() => {
    if (motorCommand === motorStatus) {
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    }
  }, [motorStatus, motorCommand]);

  // 🔥 Live Location se Weather Fetch karna (With Permission Prompt)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Pehle check karega ke Android hai toh permission maango
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Zarkhez Location Permission',
              message: 'Live mausam dekhne ke liye location ki ijazat dein.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission denied');
            return; // Agar user ne mana kar diya toh aagay nahi jayega
          }
        }

        // Agar permission mil gayi toh location uthao
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log("Location mili:", latitude, longitude); // Terminal mein check karne ke liye

              const liveWeather = await weatherService.getCurrentWeatherByCoords(latitude, longitude);

              setTemperature(liveWeather.temp);
              setHumidity(liveWeather.humidity);
              // setWeatherCondition(liveWeather.condition); // Agar zarurat ho toh
            } catch (error) {
              console.log("API Error:", error);
            }
          },
          (error) => console.log("GPS Error:", error.message),
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.warn(err);
      }
    };

    fetchWeather();
  }, []);

  // 🔥 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
    };
  }, []);

  // Back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        t('common.exitApp'), t('common.exitConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.exit'), onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    });
    return () => backHandler.remove();
  }, [t]);

  const onSignOut = () => {
    Alert.alert(
      t('common.logout'), t('common.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.logout'),
          onPress: async () => {
            await auth().signOut();
            navigation.navigate('Login' as never);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'schedule') navigation.navigate('Schedule' as never);
    if (tab === 'soil') navigation.navigate('CropSoil' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'settings') navigation.navigate('Alerts' as never);
  };

  // 🔥 Firestore Sync — command aur status dono
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('iot_data')
      .doc('relay')
      .onSnapshot(doc => {
        if (doc.exists()) {
          const data = doc.data();
          setMotorCommand(data?.command === 'on' ? 'on' : 'off');
          setMotorStatus(data?.status === 'on' ? 'on' : 'off');
          setActiveUser(data?.activeUser ?? null);
          setAutoMode(data?.mode === 'auto');
        }
      });
    return () => unsubscribe();
  }, []);

  // Billing rate sync
  useEffect(() => {
    const unsubscribeConfig = firestore()
      .collection('settings')
      .doc('billing_config')
      .onSnapshot(doc => {
        if (doc.exists) {
          setCurrentRate(doc.data()?.currentRate ?? 200);
        }
      });
    return () => unsubscribeConfig();
  }, []);

  // Live Sensor Sync
  useEffect(() => {
    const unsubscribeSensors = firestore()
      .collection('iot_data')
      .doc('sensors')
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          setVoltage(data?.voltage ?? 0);
          setCurrent(data?.current ?? 0);
        }
      });
    return () => unsubscribeSensors();
  }, []);

  // 🔥 Command bhejne ka central function — timeout bhi handle karta hai
  const sendCommand = (cmd: 'on' | 'off', userName?: string) => {
    // Pehla timeout clear karo agar chal raha ho
    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
      commandTimeoutRef.current = null;
    }

    // Firebase mein command likho
    firestore()
      .collection('iot_data')
      .doc('relay')
      .set(
        {
          command: cmd,
          activeUser: userName ?? null,
          mode: 'manual',
        },
        { merge: true }
      );

    // 30 sec ka timeout — ESP32 respond na kare to rollback
    commandTimeoutRef.current = setTimeout(() => {
      const lastConfirmedStatus = motorStatusRef.current;

      // 🔥 activeUser bhi preserve karo rollback mein
      firestore()
        .collection('iot_data')
        .doc('relay')
        .set(
          {
            command: lastConfirmedStatus,
            activeUser: lastConfirmedStatus === 'on' ? activeUser : null, // 🔥 YE LINE
          },
          { merge: true }
        );

      Alert.alert(
        '⚠️ No Response',
        'Device did not respond in 30 seconds. Please check your device and try again.',
        [{ text: 'OK' }]
      );
    }, 30000);
  };

  // 🔥 Motor ON confirm
  const confirmStartMotor = () => {
    if (!enteredName.trim()) {
      setInputError(true);
      return;
    }
    const userName = enteredName.trim();
    setInputError(false);
    setModalVisible(false);
    setActiveUser(userName);
    sendCommand('on', userName);
    setEnteredName('');
  };

  // 🔥 Motor OFF
  const handleMotorOff = () => {
    sendCommand('off');
  };

  // 🔥 Status text
  const getStatusText = () => {
    if (isTransitioning) {
      return motorCommand === 'on' ? 'Turning ON...' : 'Turning OFF...';
    }
    return motorOn ? t('motor.on') : t('motor.off');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />


      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Stylish Header - Bilkul Settings Screen Jaisa */}
        <LinearGradient
          colors={['#1F7A63', '#2a9d82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.homeHeader, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.homeHeaderTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>💧</Text>
              </View>
              {/* Zarkhez chota aur green font mein */}
              <Text style={styles.logoText}>{t('header.title')}</Text>
            </View>
          </View>

          {/* Main Title (Smart Farming) aur Subtitle (Automated irrigation) */}
          <Text style={styles.homeMainTitle}>
            {language === 'en' ? 'Smart Farming' : 'ذہین کاشتکاری'}
          </Text>
          <Text style={styles.homeSubtitle}>
            {language === 'en' ? 'Automated irrigation' : 'خودکار آبپاشی'}
          </Text>
        </LinearGradient>

        {/* Motor Control Card */}
        {/* Motor Control Card */}
        <View style={[
          styles.card,
          isDark && styles.cardDark,
          {
            marginTop: 20, // Header aur card mein gap
            marginHorizontal: 16 // Card ko sides se push karne ke liye
          }
        ]}>

          <View style={styles.modeToggleContainer}>
            <View style={[styles.modeToggle, isDark && styles.modeToggleDark]}>
              <Text style={[styles.modeText]}>{t('motor.manual')}</Text>
              <Switch
                value={autoMode}
                onValueChange={(val) => {
                  firestore()
                    .collection('iot_data')
                    .doc('relay')
                    .set({ mode: val ? 'auto' : 'manual' }, { merge: true });
                }}
              />
              <Text style={[styles.modeText]}>{t('motor.auto')}</Text>
            </View>
          </View>

          <View style={styles.powerContainer}>
            <TouchableOpacity
              style={[
                styles.powerButton,
                motorOn && styles.powerButtonOn,
                (autoMode || isTransitioning) && styles.powerButtonDisabled,
              ]}
              onPress={() => {
                if (!autoMode && !isTransitioning) {
                  if (!motorOn) {
                    setModalVisible(true);
                  } else {
                    handleMotorOff();
                  }
                }
              }}
              disabled={autoMode || isTransitioning}>
              <LinearGradient
                colors={
                  isTransitioning
                    ? ['#f59e0b', '#d97706'] // Orange for transition (dono modes mein same)
                    : motorOn
                      ? ['#10b981', '#059669'] // Green for ON (dono modes mein same)
                      : isDark
                        ? ['#2a3b36', '#1a211f'] // 🔥 Dark mode mein: Dark Charcoal OFF button
                        : ['#f3f4f6', '#e5e7eb'] // 🔥 Light mode mein: Soft Light Grey OFF button
                }
                style={styles.powerGradient}>
                <Text style={[
                  styles.powerIcon,
                  { color: motorOn ? '#FFFFFF' : (isDark ? '#9ca3af' : '#636466') }
                  
                ]}>
                  ⚡
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 🔥 Spinner jab transitioning ho */}
            {isTransitioning && (
              <ActivityIndicator
                size="small"
                color="#f59e0b"
                style={{ marginTop: 10 }}
              />
            )}

            {/* 🔥 Dynamic Status Text */}
            <Text style={[
              styles.powerStatus,
              isTransitioning && { color: '#f59e0b' },
              motorOn && !isTransitioning && { color: '#10b981' },
            ]}>
              {getStatusText()}
            </Text>

            {motorOn && activeUser && !isTransitioning && (
              <Text style={{ marginTop: 8, fontSize: 14, color: '#10b981' }}>
                Motor is running for {activeUser}
              </Text>
            )}

            {autoMode && (
              <View style={styles.autoModeIndicator}>
                <Text style={styles.autoModeText}>🤖 {t('motor.autoActive')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Voltage & Current */}
        <View style={[styles.statusRow, { marginHorizontal: 16 }]}>
          <View style={[styles.statusCard, isDark && styles.statusCardDark]}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>⚡</Text>
            </LinearGradient>
            <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>{t('measurements.voltage')}</Text>
            {/* 🔥 Inline style hata kar statusValue laga diya taake size 22 ho jaye */}
            <Text style={[styles.statusValue, isDark && styles.statusValueDark]}>
              {voltage.toFixed(2)}V
            </Text>
          </View>
          <View style={[styles.statusCard, isDark && styles.statusCardDark]}>
            <LinearGradient colors={['#f97316', '#ea580c']} style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>🔌</Text>
            </LinearGradient>
            <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>{t('measurements.current')}</Text>
            {/* 🔥 Yahan bhi dark mode ka tag laga diya */}
            <Text style={[styles.statusValue, isDark && styles.statusValueDark]}>
              {current.toFixed(2)}A
            </Text>
          </View>
        </View>

        {/* Weather */}
        <View style={[styles.weatherCard, isDark && styles.weatherCardDark, { marginHorizontal: 16 }]}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherIcon}>☀️</Text>
            <View>
              <Text style={[styles.weatherTitle, isDark && styles.weatherTitleDark]}>{t('measurements.weather')}</Text>
              <Text style={[styles.weatherSubtitle, isDark && styles.weatherSubtitleDark]}>{t('measurements.temperature')}</Text>
            </View>
          </View>
          <View style={styles.weatherInfo}>
            <Text style={[styles.temperature, isDark && styles.temperatureDark]}>{temperature}°C</Text>
            <View style={styles.humidityContainer}>
              <Text style={styles.humidityIcon}>💧</Text>
              <Text style={[styles.humidity, isDark && styles.humidityDark]}>{humidity}%</Text>
            </View>
          </View>
        </View>

        {/* Actions Grid */}
        <View style={[styles.actionsGrid, { marginHorizontal: 16 }]}>
          <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('schedule')}>
            <Text style={styles.actionIcon}>⏰</Text>
            <Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.schedule')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('soil')}>
            <Text style={styles.actionIcon}>🌱</Text>
            <Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.soil')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('billing')}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.billing')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('settings')}>
            <Text style={styles.actionIcon}>⚠️</Text>
            <Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.settings')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15 }}>Enter User Name</Text>
              <TextInput
                placeholder="Enter name..."
                value={enteredName}
                onChangeText={(text) => { setEnteredName(text); setInputError(false); }}
                style={{ borderWidth: 1, borderColor: inputError ? 'red' : '#ccc', borderRadius: 10, padding: 10, marginBottom: 10 }}
              />
              {inputError && (
                <Text style={{ color: 'red', marginBottom: 10 }}>Name is required</Text>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#e5e7eb', padding: 10, borderRadius: 10, flex: 1, marginRight: 10 }}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{ textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#10b981', padding: 10, borderRadius: 10, flex: 1 }}
                  onPress={confirmStartMotor}>
                  <Text style={{ textAlign: 'center', color: '#fff' }}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};

export default HomeScreen;