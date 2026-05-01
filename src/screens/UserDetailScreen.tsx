import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore'; 
import TimelineItem from '../components/TimelineItem';
import { styles } from './styles/UserDetailScreen.styles';
import { useLanguage } from '../contexts/LanguageContext';

const UserDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params as { userName: string }; 
  const [sessions, setSessions] = useState<any[]>([]);
  const { t } = useLanguage();

  const formatDuration = (totalMinutes: number) => {
    if (totalMinutes === 0) return '0s';
    if (totalMinutes < 1) return `${Math.round(totalMinutes * 60)}s`;
    const m = Math.floor(totalMinutes);
    const s = Math.round((totalMinutes % 1) * 60);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('billing_history')
      .where('userName', '==', userName)
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => {
          const d = doc.data();
          const dateObj = d.timestamp?.toDate() || new Date();
          return {
            id: doc.id,
            date: dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            start: d.startTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stop: d.endTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: formatDuration(parseFloat(d.duration || 0)),
            bill: parseFloat(d.billAmount || 0).toFixed(1),
            status: d.status || 'pending',
            rawTime: dateObj.getTime() 
          };
        });
        setSessions(data.sort((a, b) => b.rawTime - a.rawTime));
      });
    return () => unsubscribe();
  }, [userName]);

  const totalBill = sessions.reduce((sum, s) => sum + (s.status === 'pending' ? parseFloat(s.bill) : 0), 0);

  const handlePayAll = () => {
    if (totalBill <= 0) return Alert.alert("No Dues", "Saara bill pehle hi paid hai.");

    Alert.alert(
      "Confirm Settlement", 
      `Are you sure you want to mark the total pending amount of Rs ${totalBill.toFixed(1)} as paid?`, 
      [
        { text: "Cancel" },
        { text: "Confirm Paid", onPress: async () => {
            const batch = firestore().batch();
            const snap = await firestore().collection('billing_history')
              .where('userName', '==', userName)
              .where('status', '==', 'pending').get();
            snap.forEach(doc => batch.update(doc.ref, { status: 'paid' }));
            await batch.commit();
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back to Billing</Text>
          </TouchableOpacity>

          <View style={styles.userHeader}>
            <View style={styles.largeAvatar}><Text style={styles.largeAvatarText}>{userName[0]}</Text></View>
            <View>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userSubtitle}>{t('userDetail.usageHistory')}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('userDetail.sessions')}</Text>
              <Text style={styles.summaryValue}>{sessions.length}</Text>
            </View>
            {/* Wapis Green Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('userDetail.totalBill')}</Text>
              <Text style={styles.summaryValue}>Rs {totalBill.toFixed(1)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* ✅ Naya Pay All Button - Dashboard ke niche */}
          <TouchableOpacity 
            onPress={handlePayAll}
            style={{ backgroundColor: '#38A38B', marginVertical: 15, padding: 12, borderRadius: 10, alignItems: 'center', elevation: 3 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('userDetail.settleBill')}</Text>
          </TouchableOpacity>

          <Text style={styles.timelineTitle}>{t('userDetail.timelineTitle')}</Text>
          <View style={[styles.timeline, { borderLeftWidth: 0 }]}> 
            {/* 👆 Grey Line hatane ke liye borderLeftWidth 0 kar di */}
            {sessions.map((session) => (
              <TimelineItem key={session.id} session={session} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;