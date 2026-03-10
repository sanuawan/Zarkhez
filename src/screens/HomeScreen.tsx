// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
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

  // 🔥 NEW STATES
  const [modalVisible, setModalVisible] = useState(false);
  const [enteredName, setEnteredName] = useState('');
  const [inputError, setInputError] = useState(false);
  const [activeUser, setActiveUser] = useState<string | null>(null);

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
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.exit'), onPress: () => BackHandler.exitApp() },
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
    if (tab === 'alerts') navigation.navigate('Alerts' as never);
  };

  // 🔥 Firestore Sync
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('iot_data')
      .doc('relay')
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          setMotorOn(data?.state === 'on');
          setActiveUser(data?.activeUser ?? null);
          setAutoMode(data?.mode === 'auto');
        }
      });
    return () => unsubscribe();
  }, []);

  // 🔥 Confirm Start
  const confirmStartMotor = () => {
    if (!enteredName.trim()) {
      setInputError(true);
      return;
    }

    setInputError(false);
    setModalVisible(false);

    firestore()
      .collection('iot_data')
      .doc('relay')
      .set({
        state: 'on',
        activeUser: enteredName.trim(),
        mode: 'manual'
      });

    setEnteredName('');
  };

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
          <TouchableOpacity
            style={[styles.headerButton, isDark && styles.headerButtonDark]}
            onPress={toggleLanguage}>
            <Text style={[styles.headerButtonText, isDark && styles.headerButtonTextDark]}>
              {language === 'en' ? 'اردو' : 'English'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, isDark && styles.headerButtonDark]}
            onPress={toggleTheme}>
            <Text>{isDark ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
            onPress={onSignOut}>
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Motor Control Card */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            {t('motor.status')}
          </Text>

          <View style={styles.modeToggleContainer}>
            <View style={[styles.modeToggle, isDark && styles.modeToggleDark]}>
              <Text style={[styles.modeText]}>{t('motor.manual')}</Text>
              <Switch 
                value={autoMode} 
                onValueChange={(val) => {
                  firestore()
                    .collection('iot_data')
                    .doc('relay')
                    .set({
                      mode: val ? 'auto' : 'manual'
                    }, { merge: true });
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
                autoMode && styles.powerButtonDisabled,
              ]}
              onPress={() => {
                if (!autoMode) {
                  if (!motorOn) {
                    setModalVisible(true);
                  } else {
                    firestore()
                      .collection('iot_data')
                      .doc('relay')
                      .set({
                        state: 'off',
                        activeUser: null,
                        mode: 'manual'
                      }, { merge: true });
                  }
                }
              }}
              disabled={autoMode}>
              <LinearGradient
                colors={
                  motorOn
                    ? ['#10b981', '#059669']
                    : ['#d1d5db', '#9ca3af']
                }
                style={styles.powerGradient}>
                <Text style={styles.powerIcon}>⚡</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.powerStatus]}>
              {motorOn ? t('motor.on') : t('motor.off')}
            </Text>

            {motorOn && activeUser && (
              <Text style={{ marginTop: 8, fontSize: 14, color: '#10b981' }}>
                Motor is running for {activeUser}
              </Text>
            )}

            {autoMode && (
              <View style={styles.autoModeIndicator}>
                <Text style={styles.autoModeText}>
                  🤖 {t('motor.autoActive')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* BAQI UI SAME — Voltage, Weather, Grid */}
        <View style={styles.statusRow}>
          <View style={[styles.statusCard]}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>⚡</Text>
            </LinearGradient>
            <Text style={styles.statusLabel}>{t('measurements.voltage')}</Text>
            <Text style={styles.statusValue}>{voltage}V</Text>
          </View>

          <View style={[styles.statusCard]}>
            <LinearGradient colors={['#f97316', '#ea580c']} style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>🔌</Text>
            </LinearGradient>
            <Text style={styles.statusLabel}>{t('measurements.current')}</Text>
            <Text style={styles.statusValue}>{current}A</Text>
          </View>
        </View>
                <View style={[styles.weatherCard, isDark && styles.weatherCardDark]}>
             <View style={styles.weatherHeader}>
                 <Text style={styles.weatherIcon}>☀️</Text>
                 <View><Text style={[styles.weatherTitle, isDark && styles.weatherTitleDark]}>{t('measurements.weather')}</Text><Text style={[styles.weatherSubtitle, isDark && styles.weatherSubtitleDark]}>{t('measurements.temperature')}</Text></View>
             </View>
             <View style={styles.weatherInfo}>
                 <Text style={[styles.temperature, isDark && styles.temperatureDark]}>{temperature}°C</Text>
                 <View style={styles.humidityContainer}><Text style={styles.humidityIcon}>💧</Text><Text style={[styles.humidity, isDark && styles.humidityDark]}>{humidity}%</Text></View>
             </View>
        </View>

        <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('schedule')}>
                <Text style={styles.actionIcon}>⏰</Text><Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.schedule')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('soil')}>
                <Text style={styles.actionIcon}>🌱</Text><Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.soil')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('billing')}>
                <Text style={styles.actionIcon}>💰</Text><Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.billing')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => handleTabPress('alerts')}>
                <Text style={styles.actionIcon}>⚠️</Text><Text style={[styles.actionLabel, isDark && styles.actionLabelDark]}>{t('nav.alerts')}</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />

      {/* 🔥 MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 25,
            }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15 }}>
                Enter User Name
              </Text>

              <TextInput
                placeholder="Enter name..."
                value={enteredName}
                onChangeText={(text) => {
                  setEnteredName(text);
                  setInputError(false);
                }}
                style={{
                  borderWidth: 1,
                  borderColor: inputError ? 'red' : '#ccc',
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}
              />

              {inputError && (
                <Text style={{ color: 'red', marginBottom: 10 }}>
                  Name is required
                </Text>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#e5e7eb',
                    padding: 10,
                    borderRadius: 10,
                    flex: 1,
                    marginRight: 10,
                  }}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{ textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#10b981',
                    padding: 10,
                    borderRadius: 10,
                    flex: 1,
                  }}
                  onPress={confirmStartMotor}>
                  <Text style={{ textAlign: 'center', color: '#fff' }}>
                    Start
                  </Text>
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
