// src/screens/UserDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TimelineItem from '../components/TimelineItem';
import { styles } from './styles/UserDetailScreen.styles';

// Static data (from your web component)
const usageData: Record<number, any[]> = {
  1: [
    { date: '12 Mar', start: '10:05 AM', stop: '11:20 AM', duration: '1h 15m', bill: 250 },
    { date: '13 Mar', start: '08:40 AM', stop: '09:25 AM', duration: '45m', bill: 150 },
    { date: '14 Mar', start: '02:10 PM', stop: '02:40 PM', duration: '30m', bill: 100 },
  ],
  2: [
    { date: '11 Mar', start: '07:00 AM', stop: '07:45 AM', duration: '45m', bill: 150 },
    { date: '13 Mar', start: '11:30 AM', stop: '12:15 PM', duration: '45m', bill: 150 },
  ],
  3: [
    { date: '10 Mar', start: '06:00 AM', stop: '07:00 AM', duration: '1h', bill: 200 },
    { date: '12 Mar', start: '09:00 AM', stop: '10:00 AM', duration: '1h', bill: 200 },
    { date: '14 Mar', start: '03:30 PM', stop: '04:30 PM', duration: '1h', bill: 200 },
  ],
  4: [
    { date: '11 Mar', start: '05:45 AM', stop: '06:45 AM', duration: '1h', bill: 200 },
    { date: '13 Mar', start: '01:00 PM', stop: '02:00 PM', duration: '1h', bill: 200 },
  ],
  5: [
    { date: '10 Mar', start: '07:30 AM', stop: '09:30 AM', duration: '2h', bill: 400 },
    { date: '12 Mar', start: '04:00 PM', stop: '06:00 PM', duration: '2h', bill: 400 },
  ],
};

const userNames: Record<number, string> = {
  1: 'Ali', 2: 'Ahmed', 3: 'Usman', 4: 'Tariq', 5: 'Bilal',
};

const UserDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params as { userId: number };
  const sessions = usageData[userId] || [];
  const name = userNames[userId] || 'User';
  const totalBill = sessions.reduce((sum, s) => sum + s.bill, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1F7A63', '#2a9d82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back to Billing</Text>
          </TouchableOpacity>

          <View style={styles.userHeader}>
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>{name[0]}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.userSubtitle}>Usage History · March 2026</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Sessions</Text>
              <Text style={styles.summaryValue}>{sessions.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Bill</Text>
              <Text style={styles.summaryValue}>Rs {totalBill}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.timelineTitle}>Motor Usage Timeline</Text>
          <View style={styles.timeline}>
            {sessions.map((session, index) => (
              <TimelineItem key={index} session={session} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;