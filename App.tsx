import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { Alert } from 'react-native';

// Firebase Imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Screen Imports
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import CropSoilScreen from './src/screens/CropSoilScreen';
import BillingScreen from './src/screens/BillingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SettingsAlertsScreen from './src/screens/SettingsAlertsScreen';
import SettingsActivityLogScreen from './src/screens/SettingsActivityLogScreen';
import SettingsMotorSafetyScreen from './src/screens/SettingsMotorSafetyScreen';
import SettingsAppearanceScreen from './src/screens/SettingsAppearanceScreen';
import UserDetailScreen from './src/screens/UserDetailScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

// Contexts
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserProvider } from './src/contexts/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

enableScreens();

// Global Variables
let activeSessionId: number | null = null;
let safetyTriggered = false; // ✅ 1. Flag to prevent double logs

export type RootStackParamList = {
  Login: undefined; Signup: undefined; Home: undefined; Schedule: undefined;
  CropSoil: undefined; Billing: undefined; Alerts: undefined;
  UserDetail: { userName: string }; Analytics: undefined;
  SettingsAlerts: undefined; SettingsActivity: undefined;
  SettingsSafety: undefined; SettingsAppearance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const liveSensorsRef = useRef({ voltage: 0, current: 0 });
  const sessionRef = useRef<{ startTime: number; userName: string; mode: string; } | null>(null);
  const safetySettingsRef = useRef({ minV: 0, maxV: 250, maxA: 20 });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🛡️ 1. SAFETY SETTINGS LISTENER
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubSafety = firestore()
      .collection('settings')
      .doc('safety_config')
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          safetySettingsRef.current = {
            minV: data?.minV ?? 0,
            maxV: data?.maxV ?? 250,
            maxA: data?.maxA ?? 20
          };
        }
      });
    return () => unsubSafety();
  }, [isAuthenticated]);

  // 📡 2. SENSORS LISTENER (Safety Logic)
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubSensors = firestore()
      .collection('iot_data')
      .doc('sensors')
      .onSnapshot(async (doc) => {
        if (!doc.exists) return;

        const sData = doc.data();
        const liveV = sData?.voltage ?? 0;
        const liveA = sData?.current ?? 0;
        liveSensorsRef.current = { voltage: liveV, current: liveA };

        if (activeSessionId !== null) {
          const { minV, maxV, maxA } = safetySettingsRef.current;
          const secondsRunning = (Date.now() - activeSessionId) / 1000;

          // Check for voltage/current safety
          if (secondsRunning > 10 && liveV > 0.5) {
            let reason = "";
            if (liveV < minV) reason = `Low Voltage (${liveV}V)`;
            else if (liveV > maxV) reason = `High Voltage (${liveV}V)`;
            else if (liveA > maxA) reason = `Overload Current (${liveA}A)`;

            if (reason !== "") {
              safetyTriggered = true; // ✅ Mark safety as triggered

              // Turn off motor
              await firestore().collection('iot_data').doc('relay').update({ command: 'off' });

              // Save Safety Event Log
              await firestore().collection('events').add({
                type: 'MOTOR_OFF',
                message: `Safety Shutdown: ${reason}`,
                timestamp: firestore.FieldValue.serverTimestamp(),
                userName: sessionRef.current?.userName || 'System'
              });

              // Show Safety Alert
              Alert.alert(
                "⚠️ MOTOR STOPPED",
                `Reason: ${reason}`,
                [{ text: "OK" }],
                { cancelable: false }
              );
            }
          }
        }
      });
    return () => unsubSensors();
  }, [isAuthenticated]);

  // 💧 3. RELAY LISTENER (Motor Status & Billing)
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubRelay = firestore()
      .collection('iot_data')
      .doc('relay')
      .onSnapshot(async (doc) => {
        if (!doc.exists()) return;

        const data = doc.data();
        const status = data?.status;
        const activeUser = data?.activeUser || 'Manual User';

        // MOTOR ON LOGIC
        if (status === 'on' && activeSessionId === null) {
          activeSessionId = Date.now();
          sessionRef.current = { startTime: activeSessionId, userName: activeUser, mode: data?.mode || 'manual' };
          safetyTriggered = false; // Reset flag on start

          await firestore().collection('events').add({
            type: 'MOTOR_ON',
            message: `Motor started by ${activeUser}`,
            timestamp: firestore.FieldValue.serverTimestamp(),
            userName: activeUser
          });
        }

        // MOTOR OFF LOGIC
        if (status === 'off' && activeSessionId !== null) {
          const sessionData = { ...sessionRef.current };
          const duration = (Date.now() - (sessionData.startTime || Date.now())) / (1000 * 60);

          activeSessionId = null;
          sessionRef.current = null;

          // ✅ 2. Prevent Double Log: Skip if already logged by Safety
          if (!safetyTriggered) {
            await firestore().collection('events').add({
              type: 'MOTOR_OFF',
              message: `Motor turned off. Duration: ${duration.toFixed(2)} mins`,
              timestamp: firestore.FieldValue.serverTimestamp(),
              userName: sessionData.userName || 'System'
            });
          }

          // BILLING LOGIC
          if (duration > 0.05) {
            try {
              const rateDoc = await firestore().collection('settings').doc('billing_config').get();
              const currentRate = rateDoc.data()?.currentRate || 2000;
              const bill = (duration / 60) * currentRate;

              await firestore().collection('billing_history').add({
                userName: sessionData.userName,
                duration: duration.toFixed(2),
                billAmount: bill.toFixed(2),
                startTime: firestore.Timestamp.fromMillis(sessionData.startTime!),
                endTime: firestore.Timestamp.now(),
                status: 'pending',
                timestamp: firestore.FieldValue.serverTimestamp()
              });

              // ✅ 3. Delay Billing Pop-up: Taake Safety Alert ke baad aaye
              setTimeout(() => {
                Alert.alert(
                  "💰 BILL GENERATED",
                  `User: ${sessionData.userName}\nDuration: ${duration.toFixed(2)} mins\nBill: Rs. ${bill.toFixed(2)}`,
                  [{ text: "OK", onPress: () => { safetyTriggered = false; } }],
                  { cancelable: false }
                );
              }, 3500);

            } catch (err) { 
              console.error("Billing Error:", err); 
              safetyTriggered = false;
            }
          } else {
            safetyTriggered = false;
          }
        }
      });
    return () => unsubRelay();
  }, [isAuthenticated]);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={isAuthenticated ? 'Home' : 'Login'}
                screenOptions={{ headerShown: false, gestureEnabled: false }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Schedule" component={ScheduleScreen} />
                <Stack.Screen name="CropSoil" component={CropSoilScreen} />
                <Stack.Screen name="Billing" component={BillingScreen} />
                <Stack.Screen name="Alerts" component={SettingsScreen} />
                <Stack.Screen name="UserDetail" component={UserDetailScreen as any} />
                <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                <Stack.Screen name="SettingsAlerts" component={SettingsAlertsScreen} />
                <Stack.Screen name="SettingsActivity" component={SettingsActivityLogScreen} />
                <Stack.Screen name="SettingsSafety" component={SettingsMotorSafetyScreen} />
                <Stack.Screen name="SettingsAppearance" component={SettingsAppearanceScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;