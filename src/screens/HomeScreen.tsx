// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useEffect } from 'react'; 
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
// 1. CHANGE IMPORT
import firestore from '@react-native-firebase/firestore'; 
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNavBar from '../components/BottomNavBar';
import { styles } from './styles/HomeScreen.styles';
import { useTheme } from '../contexts/ThemeContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const HomeScreen: React.FC = () => {
  const user = auth().currentUser;
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme(); 
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [motorOn, setMotorOn] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  

  // Mock data
  const voltage = 220;
  const current = 5.2;
  const temperature = 28;
  const humidity = 65;

  // Back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          t('common.exitApp'),
          t('common.exitConfirm'),
          [
            {
              text: t('common.cancel'),
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: t('common.exit'),
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, [t]);

const onSignOut = () => {
  Alert.alert(
    t('common.logout'),
    t('common.logoutConfirm'),
    [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.logout'),
        onPress: async () => {
          try {
            console.log('Logging out...');
            await auth().signOut();
            console.log('Logout successful');
            
            // Navigation to Login
            navigation.navigate('Login' as never);
            
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to sign out');
          }
        },
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
};

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  // ---- Firestore Sync for Motor State ----
  useEffect(() => {
    // 2. CHANGE LISTENER LOGIC
    // We listen to collection 'iot_data', document 'relay'
    const unsubscribe = firestore()
      .collection('iot_data') 
      .doc('relay')
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          // Assuming the field name is 'state'
          const value = data?.state; 
          console.log('Firestore value received:', value); 
          setMotorOn(value === 'on');
        } else {
            console.log("Document does not exist yet");
        }
      }, error => {
          console.error("Firestore Read Error:", error);
      });

    // Unsubscribe on unmount
    return () => unsubscribe(); 
  }, []);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} /> 
      
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}> 
        <View style={styles.headerLeft}>
          <Text style={[styles.title, isDark && styles.titleDark]}> 
            {t('header.title')}
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}> 
            {t('header.subtitle')}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {/* Language Toggle */}
          <TouchableOpacity
            style={[styles.headerButton, isDark && styles.headerButtonDark]} 
            onPress={toggleLanguage}
          >
            <Text style={[styles.headerButtonText, isDark && styles.headerButtonTextDark]}> 
              {language === 'en' ? 'اردو' : 'English'}
            </Text>
          </TouchableOpacity>

          {/* Dark Mode Toggle */}
          <TouchableOpacity
            style={[styles.headerButton, isDark && styles.headerButtonDark]} 
            onPress={toggleTheme}
          >
            <Text style={styles.headerButtonText}>
              {isDark ? '🌙' : '☀️'} 
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, isDark && styles.logoutButtonDark]} 
            onPress={onSignOut}
          >
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Motor Control Card */}
        <View style={[styles.card, isDark && styles.cardDark]}> 
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}> 
            {t('motor.status')}
          </Text>

          {/* Auto/Manual Toggle */}
          <View style={styles.modeToggleContainer}>
            {/* ... (Toggle UI remains same) ... */}
            <View style={[styles.modeToggle, darkMode && styles.modeToggleDark]}>
                <Text style={[styles.modeText, !autoMode && styles.modeTextActive, darkMode && styles.modeTextDark]}>{t('motor.manual')}</Text>
                <Switch value={autoMode} onValueChange={setAutoMode} trackColor={{ false: '#d1d5db', true: '#10b981' }} thumbColor={darkMode ? '#f3f4f6' : '#ffffff'} />
                <Text style={[styles.modeText, autoMode && styles.modeTextActive, darkMode && styles.modeTextDark]}>{t('motor.auto')}</Text>
            </View>
          </View>

          {/* Large Power Button */}
          <View style={styles.powerContainer}>
            <TouchableOpacity
              style={[
                styles.powerButton,
                motorOn && styles.powerButtonOn,
                isDark && styles.powerButtonDark, 
                autoMode && styles.powerButtonDisabled
              ]}
              onPress={() => {
                if (!autoMode) {
                  const newMotorState = !motorOn;
                  // Optimistic update (optional, but makes UI feel faster)
                  setMotorOn(newMotorState);

                  // 3. CHANGE WRITE LOGIC
                  const newValue = newMotorState ? 'on' : 'off';
                  console.log('Sending to Firestore:', newValue);

                  firestore()
                    .collection('iot_data')
                    .doc('relay')
                    .set({
                      state: newValue
                    })
                    .then(() => console.log('Firestore write OK'))
                    .catch(err => {
                        console.log('Firestore write ERR', err);
                        // Revert state if error
                        setMotorOn(!newMotorState);
                    });
                }
              }}
              disabled={autoMode}
            >
              <LinearGradient
                colors={motorOn ? (darkMode ? ['#059669', '#047857'] : ['#10b981', '#059669']) : (darkMode ? ['#4b5563', '#374151'] : ['#d1d5db', '#9ca3af'])}
                style={styles.powerGradient}
              >
                <Text style={styles.powerIcon}>⚡</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.powerStatus, darkMode && styles.powerStatusDark, motorOn && styles.powerStatusOn]}>
              {motorOn ? t('motor.on') : t('motor.off')}
            </Text>

            {autoMode && (
              <View style={styles.autoModeIndicator}>
                <Text style={styles.autoModeText}>🤖 {t('motor.autoActive')}</Text>
                <Text style={[styles.autoModeDescription, darkMode && styles.autoModeDescriptionDark]}>{t('motor.autoDescription')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ... (Rest of the UI: Voltage, Weather, Actions remains exactly the same) ... */}
        <View style={styles.statusRow}>
             <View style={[styles.statusCard, darkMode && styles.statusCardDark]}>
                 <LinearGradient colors={darkMode ? ['#1e40af', '#1d4ed8'] : ['#3b82f6', '#2563eb']} style={styles.statusIconContainer}><Text style={styles.statusIcon}>⚡</Text></LinearGradient>
                 <Text style={[styles.statusLabel, darkMode && styles.statusLabelDark]}>{t('measurements.voltage')}</Text>
                 <Text style={[styles.statusValue, darkMode && styles.statusValueDark]}>{voltage}V</Text>
             </View>
             <View style={[styles.statusCard, darkMode && styles.statusCardDark]}>
                 <LinearGradient colors={darkMode ? ['#ea580c', '#dc2626'] : ['#f97316', '#ea580c']} style={styles.statusIconContainer}><Text style={styles.statusIcon}>🔌</Text></LinearGradient>
                 <Text style={[styles.statusLabel, darkMode && styles.statusLabelDark]}>{t('measurements.current')}</Text>
                 <Text style={[styles.statusValue, darkMode && styles.statusValueDark]}>{current}A</Text>
             </View>
        </View>

        <View style={[styles.weatherCard, darkMode && styles.weatherCardDark]}>
             <View style={styles.weatherHeader}>
                 <Text style={styles.weatherIcon}>☀️</Text>
                 <View><Text style={[styles.weatherTitle, darkMode && styles.weatherTitleDark]}>{t('measurements.weather')}</Text><Text style={[styles.weatherSubtitle, darkMode && styles.weatherSubtitleDark]}>{t('measurements.temperature')}</Text></View>
             </View>
             <View style={styles.weatherInfo}>
                 <Text style={[styles.temperature, darkMode && styles.temperatureDark]}>{temperature}°C</Text>
                 <View style={styles.humidityContainer}><Text style={styles.humidityIcon}>💧</Text><Text style={[styles.humidity, darkMode && styles.humidityDark]}>{humidity}%</Text></View>
             </View>
        </View>

        <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionButton, darkMode && styles.actionButtonDark]} onPress={() => handleTabPress('schedule')}>
                <Text style={styles.actionIcon}>⏰</Text><Text style={[styles.actionLabel, darkMode && styles.actionLabelDark]}>{t('nav.schedule')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, darkMode && styles.actionButtonDark]} onPress={() => handleTabPress('soil')}>
                <Text style={styles.actionIcon}>🌱</Text><Text style={[styles.actionLabel, darkMode && styles.actionLabelDark]}>{t('nav.soil')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, darkMode && styles.actionButtonDark]} onPress={() => handleTabPress('billing')}>
                <Text style={styles.actionIcon}>💰</Text><Text style={[styles.actionLabel, darkMode && styles.actionLabelDark]}>{t('nav.billing')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, darkMode && styles.actionButtonDark]} onPress={() => handleTabPress('alerts')}>
                <Text style={styles.actionIcon}>⚠️</Text><Text style={[styles.actionLabel, darkMode && styles.actionLabelDark]}>{t('nav.alerts')}</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default HomeScreen;