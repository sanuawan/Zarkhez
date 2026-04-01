import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { styles } from './styles/SettingsActivityLogScreen.styles';

const SettingsActivityLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get Icon and Color based on type
  const getEventStyle = (type: string) => {
    // Trim aur Uppercase taake spelling/space ka masla na ho
    const eventType = type?.toUpperCase().trim();

    switch (eventType) {
      case 'MOTOR_ON':
      case 'MOTOR ON': // Dono cases handle ho jayen gy
        return { icon: '⚡', bg: '#E8F3F0', color: '#1F7A63', title: 'Motor ON' };

      case 'MOTOR_OFF':
      case 'MOTOR OFF':
      case 'SAFETY SHUTDOWN': // Safety band ko bhi red icon milay ga
        return { icon: '⏹️', bg: '#FFF0F0', color: '#e05353', title: 'Motor OFF' };

      case 'SCHEDULE_STARTED':
        return { icon: '📅', bg: '#E8F3F0', color: '#6ED3B5', title: 'Schedule Started' };

      case 'SCHEDULE_STOP':
        return { icon: '✅', bg: '#E8F3F0', color: '#1F7A63', title: 'Schedule Finished' };

      case 'SCHEDULE_CANCEL':
        return { icon: '❌', bg: '#FFF0F0', color: '#e05353', title: 'Schedule Cancelled' };

      default:
        return { icon: '📝', bg: '#F4F7F6', color: '#4a6b64', title: 'Activity' };
    }
  };
  useEffect(() => {
    setLoading(true);

    // 1. Listen to Events (Manual & Auto) - Limit set to 30
    const unsubEvents = firestore()
      .collection('events')
      .orderBy('timestamp', 'desc')
      .limit(30) // Teray kehne pe 30 hi rakha hai
      .onSnapshot(eventsSnap => {
        const eventLogs = eventsSnap?.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            rawTime: d.timestamp,
            date: d.timestamp?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            time: d.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }) || [];

        // 2. Listen to Cancelled Schedules
        const unsubSchedules = firestore()
          .collection('schedules')
          .where('status', '==', 'cancelled')
          .onSnapshot(schedulesSnap => {
            const cancelLogs = schedulesSnap?.docs.map(doc => {
              const d = doc.data();
              return {
                id: doc.id,
                type: 'SCHEDULE_CANCEL',
                message: `Schedule for ${d.assignedTo} was cancelled.`,
                userName: d.assignedTo,
                rawTime: d.updatedAt || d.createdAt,
                date: (d.updatedAt || d.createdAt)?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                time: (d.updatedAt || d.createdAt)?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
            }) || [];

            // 3. Mix and Sort
            const combined = [...eventLogs, ...cancelLogs].sort((a, b) => {
              const tA = a.rawTime?.toMillis() || 0;
              const tB = b.rawTime?.toMillis() || 0;
              return tB - tA;
            });

            setLogs(combined);
            setLoading(false);
          }, err => {
            console.error("Schedules Error:", err);
            setLoading(false);
          });

        return () => unsubSchedules();
      }, err => {
        console.error("Events Error:", err);
        setLoading(false);
      });

    return () => unsubEvents();
  }, []);

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
          <Text style={styles.subtitle}>{loading ? 'Loading...' : `${logs.length} events recorded`}</Text>
        </LinearGradient>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color="#1F7A63" size="large" style={{ marginTop: 50 }} />
          ) : (
            <View style={styles.timeline}>
              <View style={styles.timelineLine} />
              {logs.map(log => {
                const style = getEventStyle(log.type);
                return (
                  <View key={log.id} style={styles.timelineItem}>
                    <View style={[styles.eventIcon, { backgroundColor: style.bg }]}>
                      <Text style={[styles.eventIconText, { color: style.color }]}>{style.icon}</Text>
                    </View>
                    <View style={styles.eventCard}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventTitle}>{style.title}</Text>
                        <Text style={styles.eventTime}>{log.time}</Text>
                      </View>
                      <Text style={styles.eventDescription}>{log.message}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.eventDate}>{log.date}</Text>
                        <Text style={[styles.eventDate, { color: '#1F7A63', fontWeight: 'bold' }]}>{log.userName}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsActivityLogScreen;