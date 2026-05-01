import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { styles } from '../screens/styles/UserDetailScreen.styles';
import { useTheme } from '../contexts/ThemeContext';

const TimelineItem = ({ session }: any) => {
  const isPaid = session.status === 'paid';
  const { isDark } = useTheme();

  const markPaid = () => {
    Alert.alert("Confirm", `Do you want to confirm the payment of Rs ${session.bill} for this specific session?`, [
      { text: "Cancel" },
      { text: "Confirm Paid", onPress: () => firestore().collection('billing_history').doc(session.id).update({ status: 'paid' }) }
    ]);
  };

  return (
    <View style={[styles.timelineItem, { marginBottom: 15 }]}>
      {/* Dot wahi rahega styling k liye but line nahi hai */}
      <View style={styles.timelineDot}><Text style={styles.clockIcon}>⏱️</Text></View>

      <View style={[styles.timelineCard, isDark && styles.timelineCardDark, { flex: 1, borderLeftWidth: 0 }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.dateBadge, isDark && styles.dateBadgeDark]}>
            <Text style={[styles.dateText, isDark && styles.dateTextDark]}>{session.date}</Text>
          </View>
        </View>

        <View style={[styles.timeRow, { alignItems: 'center', marginTop: 10 }]}>
          <View style={styles.timeBlock}>
            <Text style={[styles.timeLabel, isDark && styles.timeLabelDark]}>Start</Text>
            <Text style={[styles.timeValue, isDark && styles.timeValueDark]}>{session.start}</Text>
          </View>
          <View style={[styles.timeSeparator, { backgroundColor: isPaid ? (isDark ? '#2a9d82' : '#1F7A63') : (isDark ? '#444' : '#ddd') }]} />
          <View style={styles.timeBlock}>
            <Text style={[styles.timeLabel, isDark && styles.timeLabelDark]}>Stop</Text>
            <Text style={[styles.timeValue, isDark && styles.timeValueDark]}>{session.stop}</Text>
          </View>

          <View style={[styles.durationBadge, isDark && styles.durationBadgeDark]}>
            <Text style={styles.durationIcon}>⚡</Text>
            <Text style={[styles.durationText, isDark && { color: '#fbbf24' }]}>{session.duration}</Text> 
          </View>
        </View>

        {/* Individual Button */}
        {!isPaid ? (
          <TouchableOpacity 
            onPress={markPaid}
            // Button ka color dark mode mein thora deep kar diya
            style={{ backgroundColor: isDark ? '#2a9d82' : '#38A38B', marginTop: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>MARK AS PAID</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ marginTop: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: isDark ? '#064e3b' : '#E8F5E9' }}>
            <Text style={{ color: isDark ? '#34d399' : '#1F7A63', fontWeight: 'bold', fontSize: 11 }}>PAID ✓</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TimelineItem;