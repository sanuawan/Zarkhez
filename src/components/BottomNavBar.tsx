// src/components/BottomNavBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';  // ← path sahi kiya
import { useTheme } from '../contexts/ThemeContext';        // ← path sahi kiya

// Agar direct import red dikhaye to require() use karo (yeh safely kaam karega)
const HomeIcon = require('../assets/icons/home.png');
const ScheduleIcon = require('../assets/icons/schedule.png');
const SoilIcon = require('../assets/icons/soil.png');
const BillingIcon = require('../assets/icons/billing.png');
const SettingsIcon = require('../assets/icons/settings.png');

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'home', label: t('nav.home') || 'Home', iconSource: HomeIcon },
    { id: 'schedule', label: t('nav.schedule') || 'Schedule', iconSource: ScheduleIcon },
    { id: 'soil', label: t('nav.soil') || 'Soil', iconSource: SoilIcon },
    { id: 'billing', label: t('nav.billing') || 'Billing', iconSource: BillingIcon },
    { id: 'settings', label: t('nav.settings') || 'Settings', iconSource: SettingsIcon },
  ];

  return (
    <View style={[
      styles.container,
      isDark && styles.containerDark,
      { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }
    ]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isActive && [styles.activeTab, isDark && styles.activeTabDark]
            ]}
            onPress={() => onTabPress(tab.id)}
          >
            <Image 
              source={tab.iconSource}
              style={[
                styles.iconImage,
                tab.id === 'billing' && { width: 28, height: 28 }, // billing thoda bada
                { tintColor: isActive ? (isDark ? '#34d399' : '#00a676') : (isDark ? '#9ca3af' : '#6b7280') }
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.label,
              isDark && styles.labelDark,
              isActive && [styles.activeLabel, isDark && styles.activeLabelDark]
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#ebfcf5',
  },
  activeTabDark: {
    backgroundColor: '#064e3b',
  },
  iconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  labelDark: {
    color: '#9ca3af',
  },
  activeLabel: {
    color: '#00a676',
    fontWeight: '600',
  },
  activeLabelDark: {
    color: '#34d399',
  },
});

export default BottomNavBar;