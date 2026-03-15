// src/screens/SettingsActivityLogScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/SettingsActivityLogScreen.styles';

const events = [
  { id: 1, type: 'motor_on', title: 'Motor ON', description: 'Motor started successfully.', date: '14 Mar 2026', time: '09:00 AM', icon: '⚡', iconBg: '#E8F3F0', iconColor: '#1F7A63' },
  { id: 2, type: 'motor_off', title: 'Motor OFF', description: 'Motor stopped after scheduled session.', date: '14 Mar 2026', time: '10:15 AM', icon: '⏹️', iconBg: '#FFF0F0', iconColor: '#e05353' },
  { id: 3, type: 'schedule_started', title: 'Schedule Started', description: "Irrigation schedule 'Morning Cycle' activated.", date: '13 Mar 2026', time: '07:30 AM', icon: '📅', iconBg: '#E8F3F0', iconColor: '#6ED3B5' },
  { id: 4, type: 'manual_override', title: 'Manual Override', description: 'User manually stopped active irrigation session.', date: '13 Mar 2026', time: '08:45 AM', icon: '🔧', iconBg: '#FFF8E6', iconColor: '#FFD166' },
  { id: 5, type: 'motor_on', title: 'Motor ON', description: 'Motor started by user: user_ali_01.', date: '12 Mar 2026', time: '10:05 AM', icon: '⚡', iconBg: '#E8F3F0', iconColor: '#1F7A63' },
  { id: 6, type: 'motor_off', title: 'Motor OFF', description: 'Motor stopped — session complete.', date: '12 Mar 2026', time: '11:20 AM', icon: '⏹️', iconBg: '#FFF0F0', iconColor: '#e05353' },
];

const SettingsActivityLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Events / Activity Log</Text>
          <Text style={styles.subtitle}>{events.length} events recorded</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.timeline}>
            <View style={styles.timelineLine} />
            {events.map(event => (
              <View key={event.id} style={styles.timelineItem}>
                <View style={[styles.eventIcon, { backgroundColor: event.iconBg }]}>
                  <Text style={[styles.eventIconText, { color: event.iconColor }]}>{event.icon}</Text>
                </View>
                <View style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsActivityLogScreen;