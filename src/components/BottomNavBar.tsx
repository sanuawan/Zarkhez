// src/components/BottomNavBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    { id: 'home', label: t('nav.home'), icon: '🏠' },
    { id: 'schedule', label: t('nav.schedule'), icon: '⏰' },
    { id: 'soil', label: t('nav.soil'), icon: '🌱' },
    { id: 'billing', label: t('nav.billing'), icon: '💰' },
    { id: 'alerts', label: t('nav.alerts'), icon: '⚠️' },
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
          <Text style={[styles.icon, isDark && styles.iconDark]}>{tab.icon}</Text>
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
    backgroundColor: '#10b981',
  },
  activeTabDark: {
    backgroundColor: '#059669',
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
    color: '#6b7280',
  },
  labelDark: {
    color: '#9ca3af',
  },
  activeLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeLabelDark: {
    color: '#ffffff',
  },
});

export default BottomNavBar;