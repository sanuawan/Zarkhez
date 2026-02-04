// App.tsx
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
import AlertsScreen from './src/screens/AlertsScreen';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

enableScreens();

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Schedule: undefined;
  CropSoil: undefined;
  Billing: undefined;
  Alerts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simple auth check
  useEffect(() => {
    const checkAuth = () => {
      const user = auth().currentUser;
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName={isAuthenticated ? "Home" : "Login"}
            screenOptions={{ 
              headerShown: false,
              gestureEnabled: false
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="CropSoil" component={CropSoilScreen} />
            <Stack.Screen name="Billing" component={BillingScreen} />
            <Stack.Screen name="Alerts" component={AlertsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;