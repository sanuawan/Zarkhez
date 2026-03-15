import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import auth from '@react-native-firebase/auth';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import CropSoilScreen from './src/screens/CropSoilScreen';
import BillingScreen from './src/screens/BillingScreen';
// AlertsScreen ki jagah ab SettingsScreen import karo
import SettingsScreen from './src/screens/SettingsScreen';
// Naye settings sub‑screens
import SettingsAlertsScreen from './src/screens/SettingsAlertsScreen';
import SettingsActivityLogScreen from './src/screens/SettingsActivityLogScreen';
import SettingsMotorSafetyScreen from './src/screens/SettingsMotorSafetyScreen';
import SettingsAppearanceScreen from './src/screens/SettingsAppearanceScreen';

// Already existing screens
import UserDetailScreen from './src/screens/UserDetailScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

import { LanguageProvider } from './src/contexts/LanguageContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserProvider } from './src/contexts/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

enableScreens();

// Updated RootStackParamList with all settings screens
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Schedule: undefined;
  CropSoil: undefined;
  Billing: undefined;
  // 'Alerts' ab SettingsScreen hai (main settings list)
  Alerts: undefined;               // ← ye main Settings screen hai
  UserDetail: { userId: number };
  Analytics: undefined;
  // New settings sub‑screens
  SettingsAlerts: undefined;
  SettingsActivity: undefined;
  SettingsSafety: undefined;
  SettingsAppearance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth().currentUser;
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkAuth();
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

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
                {/* Main Settings screen (old Alerts replaced) */}
                <Stack.Screen name="Alerts" component={SettingsScreen} />
                <Stack.Screen name="UserDetail" component={UserDetailScreen} />
                <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                {/* New Settings sub‑screens */}
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