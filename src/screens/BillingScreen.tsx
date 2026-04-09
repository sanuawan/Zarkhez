import React, { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { styles } from './styles/BillingScreen.styles';
import BottomNavBar from '../components/BottomNavBar';

const BillingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('billing');

  const [usersData, setUsersData] = useState<any[]>([]);
  const [globalRate, setGlobalRate] = useState<string>('');
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'paid' | 'all'>('pending');

  // 🔥 Session tracking refs
  const sessionRef = useRef<{
    startTime: number;
    userName: string;
  } | null>(null);
  const currentRateRef = useRef<number>(200);

  const formatDuration = (totalMinutes: number) => {
    if (totalMinutes === 0) return '0s';
    if (totalMinutes < 1) {
      const seconds = Math.round(totalMinutes * 60);
      return `${seconds}s`;
    }
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const s = Math.round((totalMinutes % 1) * 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
    return `${s}s`;
  };

  // 🔥 Rate sync
  useEffect(() => {
    const unsubRate = firestore()
      .collection('settings')
      .doc('billing_config')
      .onSnapshot(doc => {
        if (doc.exists) {
          const rate = doc.data()?.currentRate ?? 200;
          setGlobalRate(rate.toString());
          currentRateRef.current = rate;
        }
      });
    return () => unsubRate();
  }, []);

  // 🔥 Billing history listener — same as before
  useEffect(() => {
    const unsubHistory = firestore()
      .collection('billing_history')
      .onSnapshot(snap => {
        const grouped: any = {};
        snap.forEach(doc => {
          const data = doc.data();
          const name = data.userName || 'Unknown User';
          const status = data.status || 'pending';

          if (filterStatus !== 'all' && status !== filterStatus) return;

          if (!grouped[name]) {
            grouped[name] = {
              id: name,
              name,
              totalMinutes: 0,
              totalBill: 0,
              sessionCount: 0,
              status,
            };
          }
          grouped[name].totalMinutes += parseFloat(data.duration || 0);
          grouped[name].totalBill += parseFloat(data.billAmount || 0);
          grouped[name].sessionCount += 1;
        });
        setUsersData(Object.values(grouped));
      });
    return () => unsubHistory();
  }, [filterStatus]);

  // 🔥 BILKUL FIXED LISTENER (Auto aur Manual dono ke liye)
  // 🔥 FIXED: prevStatusRef se sirf actual change pe react karo

  const handleUpdateRate = () => {
    const rateNum = parseFloat(globalRate);
    if (isNaN(rateNum)) return Alert.alert('Error', 'Invalid Rate');
    firestore()
      .collection('settings')
      .doc('billing_config')
      .update({ currentRate: rateNum })
      .then(() => {
        setIsEditingRate(false);
        Alert.alert('Success', 'Rate Updated!');
      });
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    else if (tab === 'schedule') navigation.navigate('Schedule' as never);
    else if (tab === 'soil') navigation.navigate('CropSoil' as never);
    else if (tab === 'settings') navigation.navigate('Alerts' as never);
  };

  const totalRevenue = usersData.reduce((sum, u) => sum + u.totalBill, 0);
  const totalMin = usersData.reduce((sum, u) => sum + u.totalMinutes, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <LinearGradient colors={['#1F7A63', '#2a9d82']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}><Text style={styles.logoIconText}>💧</Text></View>
              <Text style={styles.logoText}>Zarkhez</Text>
            </View>
            <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics' as never)}>
              <Text style={styles.analyticsButtonText}>View Analytics</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.mainTitle}>Billing Dashboard</Text>
          <Text style={styles.subtitle}>Shared Tube-Well System</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={styles.summaryValue}>Rs {totalRevenue.toFixed(1)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Duration</Text>
              <Text style={styles.summaryValue}>{formatDuration(totalMin)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Users</Text>
              <Text style={styles.summaryValue}>{usersData.length}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Rate Card */}
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2, borderWidth: 1, borderColor: '#e0e0e0' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#666' }}>Default Rate (Per Hour)</Text>
              {isEditingRate ? (
                <TextInput
                  style={{ fontSize: 20, fontWeight: 'bold', color: '#1F7A63', padding: 0, borderBottomWidth: 1, borderBottomColor: '#1F7A63' }}
                  value={globalRate}
                  onChangeText={setGlobalRate}
                  keyboardType="numeric"
                  autoFocus
                />
              ) : (
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F7A63' }}>Rs {globalRate}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => isEditingRate ? handleUpdateRate() : setIsEditingRate(true)}
              style={{ backgroundColor: '#1F7A63', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isEditingRate ? 'SAVE' : 'EDIT'}</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={{ flexDirection: 'row', marginBottom: 20, backgroundColor: '#EDF2F1', borderRadius: 12, padding: 5, elevation: 1 }}>
            {['pending', 'paid', 'all'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilterStatus(tab as any)}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: filterStatus === tab ? '#1F7A63' : 'transparent', borderRadius: 10 }}
              >
                <Text style={{ color: filterStatus === tab ? '#fff' : '#666', fontWeight: 'bold', textTransform: 'capitalize' }}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Multi-User Billing</Text>
            <Text style={styles.sectionDate}>March 2026</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Name</Text>
            <Text style={[styles.tableHeaderCell, { textAlign: 'center', flex: 0.8 }]}>Sessions</Text>
            <Text style={[styles.tableHeaderCell, { textAlign: 'center', flex: 1 }]}>Time</Text>
            <Text style={[styles.tableHeaderCell, { textAlign: 'right', flex: 1 }]}>Bill</Text>
          </View>

          {usersData.map((user) => (
            <View key={user.id} style={styles.userRowContainer}>
              <View style={{ position: 'absolute', right: 12, top: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: user.status === 'paid' ? '#E8F5E9' : '#F5F5F5', zIndex: 5 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: user.status === 'paid' ? '#1F7A63' : '#9E9E9E' }}>
                  {user.status ? user.status.toUpperCase() : 'PENDING'}
                </Text>
              </View>
              <View style={styles.userRow}>
                <View style={[styles.userInfo, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>{user.name[0]}</Text></View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.userName, { fontSize: 13 }]} numberOfLines={2}>{user.name}</Text>
                  </View>
                </View>
                <Text style={[styles.userRate, { textAlign: 'center', flex: 0.8, fontSize: 12 }]}>{user.sessionCount}</Text>
                <Text style={[styles.userHours, { textAlign: 'center', flex: 1, fontSize: 12 }]}>{formatDuration(user.totalMinutes)}</Text>
                <Text style={[styles.userBill, { textAlign: 'right', flex: 1, fontSize: 12, fontWeight: 'bold' }]}>Rs {user.totalBill.toFixed(0)}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => (navigation as any).navigate('UserDetail', { userName: user.name })}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default BillingScreen;