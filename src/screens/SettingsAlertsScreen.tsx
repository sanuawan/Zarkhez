// src/screens/SettingsAlertsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/SettingsAlertsScreen.styles';

const alerts = [
  { id: 1, type: 'warning', title: 'Low Voltage Warning', description: 'Input voltage dropped to 195V — below safe threshold.', time: 'Today, 08:14 AM', icon: '⚡', iconBg: '#FFF8E6', iconColor: '#FFD166', active: true },
  { id: 2, type: 'critical', title: 'High Voltage Warning', description: 'Voltage spike detected at 248V — motor paused.', time: 'Yesterday, 11:52 PM', icon: '⚡', iconBg: '#FFF0F0', iconColor: '#e05353', active: false },
  { id: 3, type: 'critical', title: 'Motor Overcurrent', description: 'Current exceeded 12A. Motor automatically stopped.', time: '12 Mar, 02:30 PM', icon: '📊', iconBg: '#FFF0F0', iconColor: '#e05353', active: false },
  { id: 4, type: 'critical', title: 'Motor Failure', description: 'Motor failed to respond after 3 restart attempts.', time: '11 Mar, 08:10 AM', icon: '⚠️', iconBg: '#FFF0F0', iconColor: '#e05353', active: false },
  { id: 5, type: 'warning', title: 'Dry Soil Alert', description: 'Soil moisture sensor 3 reading below minimum level.', time: '10 Mar, 09:45 AM', icon: '💧', iconBg: '#FFF8E6', iconColor: '#FFD166', active: false },
];

const SettingsAlertsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const activeCount = alerts.filter(a => a.active).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Alerts</Text>
          <Text style={styles.subtitle}>{activeCount > 0 ? `${activeCount} active alert${activeCount > 1 ? 's' : ''}` : 'All systems normal'}</Text>
          {activeCount > 0 && (
            <View style={styles.attentionBanner}>
              <Text style={styles.attentionIcon}>⚠️</Text>
              <Text style={styles.attentionText}>{activeCount} alert requires attention</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.content}>
          {alerts.map(alert => (
            <View key={alert.id} style={[styles.alertCard, alert.active && styles.activeAlertCard]}>
              <View style={styles.alertRow}>
                <View style={[styles.alertIcon, { backgroundColor: alert.iconBg }]}>
                  <Text style={[styles.alertIconText, { color: alert.iconColor }]}>{alert.icon}</Text>
                </View>
                <View style={styles.alertContent}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    {alert.active && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Active</Text></View>}
                  </View>
                  <Text style={styles.alertDescription}>{alert.description}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsAlertsScreen;