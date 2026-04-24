// src/components/Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { headerStyles } from './Header.styles';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

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
    </View>
  );
};

export default Header;