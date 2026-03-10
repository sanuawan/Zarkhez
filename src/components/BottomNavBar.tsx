// src/components/BottomNavBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const tabs = [
    { id: 'home', label: t('nav.home'), iconSource: require('../assets/icons/home.png') },
    { id: 'schedule', label: t('nav.schedule'), iconSource: require('../assets/icons/schedule.png') },
    { id: 'soil', label: t('nav.soil'), icon: '🌱' }, // Soil icon untouched
    { id: 'billing', label: t('nav.billing'), iconSource: require('../assets/icons/billing.png') },
    { id: 'alerts', label: t('nav.alerts'), icon: '🔔' },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && [styles.activeTab, isDark && styles.activeTabDark]
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          {tab.iconSource ? (
            <Image 
              source={tab.iconSource}
              style={[
                styles.iconImage,
                // Tint color se image ka color active (green) aur inactive (grey) hoga
                { tintColor: activeTab === tab.id ? (isDark ? '#34d399' : '#00a676') : (isDark ? '#9ca3af' : '#6b7280') }
              ]}
              resizeMode="contain"
            />
          ) : (
            <Text style={[styles.icon, isDark && styles.iconDark]}>{tab.icon}</Text>
          )}
          <Text style={[
            styles.label,
            isDark && styles.labelDark,
            activeTab === tab.id && [styles.activeLabel, isDark && styles.activeLabelDark]
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingVertical: 8,
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
    backgroundColor: '#ebfcf5', // Light green background (reference image jaisa)
  },
  activeTabDark: {
    backgroundColor: '#064e3b', // Dark mode ke liye active background
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  iconDark: {
    color: '#fff',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280', // Inactive text ka color grey
  },
  labelDark: {
    color: '#9ca3af',
  },
  activeLabel: {
    color: '#00a676', // Active text ka color green
    fontWeight: '600',
  },
  activeLabelDark: {
    color: '#34d399',
  },
  iconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
});

export default BottomNavBar;