import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { styles } from '../screens/styles/UserDetailScreen.styles';

const TimelineItem = ({ session }: any) => {
  const isPaid = session.status === 'paid';

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
      
      <View style={[styles.timelineCard, { flex: 1, borderLeftWidth: 0 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.dateBadge}><Text style={styles.dateText}>{session.date}</Text></View>
          <Text style={[styles.billAmount, { color: isPaid ? '#1F7A63' : '#333' }]}>Rs {session.bill}</Text>
        </View>

        <View style={[styles.timeRow, { alignItems: 'center', marginTop: 10 }]}> 
          <View style={styles.timeBlock}><Text style={styles.timeLabel}>Start</Text><Text style={styles.timeValue}>{session.start}</Text></View>
          <View style={[styles.timeSeparator, { backgroundColor: isPaid ? '#1F7A63' : '#ddd' }]} /> 
          <View style={styles.timeBlock}><Text style={styles.timeLabel}>Stop</Text><Text style={styles.timeValue}>{session.stop}</Text></View>
          
          <View style={styles.durationBadge}>
            <Text style={styles.durationIcon}>⚡</Text>
            <Text style={styles.durationText}>{session.duration}</Text> 
          </View>
        </View>

        {/* ✅ Individual Button - No Yellow, Proper Colors */}
        {!isPaid ? (
          <TouchableOpacity 
            onPress={markPaid}
            style={{ backgroundColor: '#38A38B', marginTop: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>MARK AS PAID</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ marginTop: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: '#E8F5E9' }}>
            <Text style={{ color: '#1F7A63', fontWeight: 'bold', fontSize: 11 }}>PAID ✓</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TimelineItem;