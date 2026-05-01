// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
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
import { useLanguage } from '../contexts/LanguageContext';

const settingsItems = [
  { key: 'alerts', titleKey: 'settings.menu.alerts.title', descKey: 'settings.menu.alerts.desc', icon: '🔔', iconBg: '#FFF8E6', iconColor: '#FFD166' },
  { key: 'activity', titleKey: 'settings.menu.activity.title', descKey: 'settings.menu.activity.desc', icon: '📋', iconBg: '#E8F3F0', iconColor: '#1F7A63' },
  { key: 'safety', titleKey: 'settings.menu.safety.title', descKey: 'settings.menu.safety.desc', icon: '⚠️', iconBg: '#FFF0F0', iconColor: '#e05353' },
  { key: 'language', titleKey: 'settings.menu.language.title', descKey: 'settings.menu.language.desc', icon: '🌐', iconBg: '#E6F7FF', iconColor: '#1890FF' },
  { key: 'appearance', titleKey: 'settings.menu.appearance.title', descKey: 'settings.menu.appearance.desc', icon: '🎨', iconBg: '#F0EEFF', iconColor: '#8b6ef5' },
];

const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('settings');
  const { t } = useLanguage();

  // 🔥 Firebase se current user nikalein
  const user = auth().currentUser;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'No email found';

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'schedule') navigation.navigate('Schedule' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'soil') navigation.navigate('CropSoil' as never);
    // settings tab is current screen, do nothing
  };
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              // Logout hote hi foran Login par bhej do
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            } catch (error) {
              // Agar koi error aaye bhi (jaise no user found), tab bhi login par bhej do
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            }
          }
        },
      ]
    );
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
      case 'language':
        navigation.navigate('SettingsLanguage' as never);
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
          <Text style={styles.mainTitle}>{t('settings.title')}</Text>
          <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* User card */}
          {/* User card */}
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              {/* Agar user ki photo hai to wo bhi dikha sakte hain, abhi icon hi rehne dete hain */}
              <Text style={styles.userAvatarText}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              {/* 🔥 Yahan dynamic naam aayega */}
              <Text style={styles.userName}>{displayName}</Text>
              <View style={styles.userBadgeRow}>
                <View style={styles.farmerBadge}>
                  <Text style={styles.farmerBadgeText}>{t('settings.farmer')}</Text>
                </View>
                {/* Email choti si niche dikhani ho to dikha sakte hain */}
                <Text style={styles.loggedInText}>{user?.email ? t('settings.loggedIn') : t('settings.guest')}</Text>
              </View>
            </View>
            <View style={styles.onlineDot} />
          </View>

          {/* Settings list */}
          <Text style={styles.sectionLabel}>{t('settings.general')}</Text>
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
                  <Text style={styles.itemLabel}>{t(item.titleKey)}</Text>
                  <Text style={styles.itemDescription}>{t(item.descKey)}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>{t('common.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default SettingsScreen;