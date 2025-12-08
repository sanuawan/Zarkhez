// src/components/Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { headerStyles } from './Header.styles';

interface HeaderProps {
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showLogout = true }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const onSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <View style={[headerStyles.header, isDark && headerStyles.headerDark]}>
      <View style={headerStyles.headerLeft}>
        <Text style={[headerStyles.title, isDark && headerStyles.titleDark]}>
          {t('header.title')}
        </Text>
        <Text style={[headerStyles.subtitle, isDark && headerStyles.subtitleDark]}>
          {t('header.subtitle')}
        </Text>
      </View>
      
      <View style={headerStyles.headerRight}>
        {/* Language Toggle */}
        <TouchableOpacity
          style={[headerStyles.headerButton, isDark && headerStyles.headerButtonDark]}
          onPress={toggleLanguage}
        >
          <Text style={[headerStyles.headerButtonText, isDark && headerStyles.headerButtonTextDark]}>
            {language === 'en' ? 'اردو' : 'English'}
          </Text>
        </TouchableOpacity>

        {/* Dark Mode Toggle */}
        <TouchableOpacity
          style={[headerStyles.headerButton, isDark && headerStyles.headerButtonDark]}
          onPress={toggleTheme}
        >
          <Text style={headerStyles.headerButtonText}>
            {isDark ? '🌙' : '☀️'}
          </Text>
        </TouchableOpacity>

        {/* Logout Button */}
        {showLogout && (
          <TouchableOpacity
            style={[headerStyles.logoutButton, isDark && headerStyles.logoutButtonDark]}
            onPress={onSignOut}
          >
            <Text style={headerStyles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;