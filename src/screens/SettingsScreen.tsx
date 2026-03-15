// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/SettingsScreen.styles';
import BottomNavBar from '../components/BottomNavBar';

const settingsItems = [
  {
    key: 'alerts',
    label: 'Alerts',
    description: 'System warnings & notifications',
    icon: '🔔',
    iconBg: '#FFF8E6',
    iconColor: '#FFD166',
  },
  {
    key: 'activity',
    label: 'Events / Activity Log',
    description: 'Motor events & system history',
    icon: '📋',
    iconBg: '#E8F3F0',
    iconColor: '#1F7A63',
  },
  {
    key: 'safety',
    label: 'Motor Safety Config',
    description: 'Set voltage & current thresholds',
    icon: '⚠️',
    iconBg: '#FFF0F0',
    iconColor: '#e05353',
  },
  {
    key: 'appearance',
    label: 'Appearance',
    description: 'Light / Dark mode',
    icon: '🎨',
    iconBg: '#F0EEFF',
    iconColor: '#8b6ef5',
  },
];

const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('settings');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'schedule') navigation.navigate('Schedule' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'soil') navigation.navigate('CropSoil' as never);
    // settings tab is current screen, do nothing
  };

  const navigateToSubScreen = (key: string) => {
    switch (key) {
      case 'alerts':
        navigation.navigate('SettingsAlerts' as never);
        break;
      case 'activity':
        navigation.navigate('SettingsActivity' as never);
        break;
      case 'safety':
        navigation.navigate('SettingsSafety' as never);
        break;
      case 'appearance':
        navigation.navigate('SettingsAppearance' as never);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#1F7A63', '#2a9d82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>💧</Text>
              </View>
              <Text style={styles.logoText}>Zarkhez</Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* User card */}
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>user_ali_01</Text>
              <View style={styles.userBadgeRow}>
                <View style={styles.farmerBadge}>
                  <Text style={styles.farmerBadgeText}>Farmer</Text>
                </View>
                <Text style={styles.loggedInText}>Logged in</Text>
              </View>
            </View>
            <View style={styles.onlineDot} />
          </View>

          {/* Settings list */}
          <Text style={styles.sectionLabel}>GENERAL</Text>
          <View style={styles.settingsList}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.settingsItem,
                  index > 0 && styles.settingsItemBorder,
                ]}
                onPress={() => navigateToSubScreen(item.key)}
              >
                <View style={[styles.itemIcon, { backgroundColor: item.iconBg }]}>
                  <Text style={[styles.itemIconText, { color: item.iconColor }]}>
                    {item.icon}
                  </Text>
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout button */}
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default SettingsScreen;