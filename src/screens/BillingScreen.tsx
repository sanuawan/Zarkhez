import React, { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { styles } from './styles/BillingScreen.styles';
import BottomNavBar from '../components/BottomNavBar';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const BillingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('billing');
  const { t } = useLanguage();
  const { isDark } = useTheme();
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
        if (doc.exists()) {
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
    if (isNaN(rateNum)) return Alert.alert(t('billing.error'), t('billing.invalidRate'));
    firestore()
      .collection('settings')
      .doc('billing_config')
      .update({ currentRate: rateNum })
      .then(() => {
        setIsEditingRate(false);
        Alert.alert(t('billing.success'), t('billing.rateUpdated'));
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
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <LinearGradient colors={['#1F7A63', '#2a9d82']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}><Text style={styles.logoIconText}>💧</Text></View>
              <Text style={styles.logoText}>Zarkhez</Text>
            </View>
            <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics' as never)}>
              <Text style={styles.analyticsButtonText}>{t('billing.viewAnalytics')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.mainTitle}>{t('billing.dashboardTitle')}</Text>
          <Text style={styles.subtitle}>{t('billing.subtitle')}</Text>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, isDark && styles.cardDark]}>
              <Text style={[styles.summaryLabel, isDark && styles.textMutedDark]}>{t('billing.totalRevenue')}</Text>
              <Text style={[styles.summaryValue, isDark && styles.textDark]}>Rs {totalRevenue.toFixed(1)}</Text>
            </View>
            <View style={[styles.summaryCard, isDark && styles.cardDark]}>
              <Text style={[styles.summaryLabel, isDark && styles.textMutedDark]}>{t('billing.totalDuration')}</Text>
              <Text style={[styles.summaryValue, isDark && styles.textDark]}>{formatDuration(totalMin)}</Text>
            </View>
            <View style={[styles.summaryCard, isDark && styles.cardDark]}>
              <Text style={[styles.summaryLabel, isDark && styles.textMutedDark]}>{t('billing.users')}</Text>
              <Text style={[styles.summaryValue, isDark && styles.textDark]}>{usersData.length}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Rate Card */}
          <View style={[styles.rateCard, isDark && styles.rateCardDark]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: isDark ? '#9ca3af' : '#666' }}>{t('billing.defaultRate')}</Text>
              {isEditingRate ? (
                <TextInput
                  style={[styles.rateInput, isDark && styles.rateInputDark]}
                  value={globalRate}
                  onChangeText={setGlobalRate}
                  keyboardType="numeric"
                  autoFocus
                />
              ) : (
                <Text style={[styles.rateValue, isDark && styles.rateValueDark]}>Rs {globalRate}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => isEditingRate ? handleUpdateRate() : setIsEditingRate(true)}
              style={{ backgroundColor: '#1F7A63', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isEditingRate ? t('billing.save') : t('billing.edit')}</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={[styles.tabContainer, isDark && styles.tabContainerDark]}>
            {['pending', 'paid', 'all'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilterStatus(tab as any)}
                style={[
                  styles.tabButton,
                  filterStatus === tab && styles.tabButtonActive,
                  filterStatus === tab && isDark && styles.tabButtonActiveDark
                ]}
              >
                <Text style={[
                  styles.tabText,
                  filterStatus === tab ? styles.tabTextActive : (isDark ? styles.tabTextInactiveDark : styles.tabTextInactive)
                ]}>
                  {t(`billing.tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>{t('billing.multiUserBilling')}</Text>
            <Text style={[styles.sectionDate, isDark && styles.textMutedDark]}>March 2026</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, isDark && styles.textMutedDark, { flex: 1.5 }]}>{t('billing.tableName')}</Text>
            <Text style={[styles.tableHeaderCell, isDark && styles.textMutedDark, { textAlign: 'center', flex: 0.8 }]}>{t('billing.tableSessions')}</Text>
            <Text style={[styles.tableHeaderCell, isDark && styles.textMutedDark, { textAlign: 'center', flex: 1 }]}>{t('billing.tableTime')}</Text>
            <Text style={[styles.tableHeaderCell, isDark && styles.textMutedDark, { textAlign: 'right', flex: 1 }]}>{t('billing.tableBill')}</Text>
          </View>

          {usersData.map((user) => (
            <View key={user.id} style={[styles.userRowContainer, isDark && styles.userRowContainerDark]}>
              <View style={[
                styles.statusBadge,
                user.status === 'paid'
                  ? (isDark ? styles.badgePaidDark : styles.badgePaidLight)
                  : (isDark ? styles.badgePendingDark : styles.badgePendingLight)
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  user.status === 'paid'
                    ? (isDark ? styles.badgePaidTextDark : styles.badgePaidTextLight)
                    : (isDark ? styles.badgePendingTextDark : styles.badgePendingTextLight)
                ]}>
                  {user.status ? user.status.toUpperCase() : 'PENDING'}
                </Text>
              </View>
              <View style={styles.userRow}>
                <View style={[styles.userInfo, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={[styles.avatar, isDark && styles.avatarDark]}><Text style={[styles.avatarText, isDark && styles.textDark]}>{user.name[0]}</Text></View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.userName, { fontSize: 13 }, isDark && styles.textDark]} numberOfLines={2}>{user.name}</Text>
                  </View>
                </View>
                <Text style={[styles.userRate, { textAlign: 'center', flex: 0.8, fontSize: 12 }, isDark && styles.textMutedDark]}>{user.sessionCount}</Text>
                <Text style={[styles.userHours, { textAlign: 'center', flex: 1, fontSize: 12 }, isDark && styles.textMutedDark]}>{formatDuration(user.totalMinutes)}</Text>
                <Text style={[styles.userBill, { textAlign: 'right', flex: 1, fontSize: 12, fontWeight: 'bold' }, isDark && styles.textDark]}>Rs {user.totalBill.toFixed(0)}</Text>
              </View>
              <TouchableOpacity
                style={[styles.detailsButton, isDark && styles.detailsButtonDark]}
                onPress={() => (navigation as any).navigate('UserDetail', { userName: user.name })}
              >

                <Text style={[styles.detailsButtonText, isDark && { color: '#6ED3B5' }]}>{t('billing.viewDetails')}</Text>
                <Text style={[styles.chevron, isDark && styles.textMutedDark]}>›</Text>
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