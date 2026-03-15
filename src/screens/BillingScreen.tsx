// src/screens/BillingScreen.tsx
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { styles } from './styles/BillingScreen.styles';
import BottomNavBar from '../components/BottomNavBar';

// Static data (from your web component)
const users = [
  { id: 1, name: 'Ali', hours: 2.5, rate: 200, total: 500 },
  { id: 2, name: 'Ahmed', hours: 1.5, rate: 200, total: 300 },
  { id: 3, name: 'Usman', hours: 3, rate: 200, total: 600 },
  { id: 4, name: 'Tariq', hours: 2, rate: 200, total: 400 },
  { id: 5, name: 'Bilal', hours: 4, rate: 200, total: 800 },
];

const BillingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('billing');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'schedule') navigation.navigate('Schedule' as never);
    if (tab === 'soil') navigation.navigate('CropSoil' as never);
    if (tab === 'settings') navigation.navigate('Alerts' as never);
    // Billing is current screen – no navigation needed for 'billing'
  };

  const totalRevenue = users.reduce((sum, u) => sum + u.total, 0);
  const totalHours = users.reduce((sum, u) => sum + u.hours, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#1F7A63', '#2a9d82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.header,
            { paddingTop: insets.top + 20 } // ← status bar height + extra spacing
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>💧</Text>
              </View>
              <Text style={styles.logoText}>Zarkhez</Text>
            </View>
            <TouchableOpacity
              style={styles.analyticsButton}
              onPress={() => (navigation as any).navigate('Analytics')}
            >
              <Text style={styles.analyticsButtonText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.mainTitle}>Billing Dashboard</Text>
          <Text style={styles.subtitle}>Shared Tube-Well System</Text>

          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={styles.summaryValue}>Rs {totalRevenue}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Hours</Text>
              <Text style={styles.summaryValue}>{totalHours} hrs</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Users</Text>
              <Text style={styles.summaryValue}>{users.length}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Multi-User Billing Section */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Multi-User Billing</Text>
            <Text style={styles.sectionDate}>March 2026</Text>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Name</Text>
            <Text style={[styles.tableHeaderCell, styles.textCenter]}>Hours</Text>
            <Text style={[styles.tableHeaderCell, styles.textCenter]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.textRight]}>Bill</Text>
          </View>

          {/* User Rows */}
          {users.map((user) => (
            <View key={user.id} style={styles.userRowContainer}>
              <View style={styles.userRow}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name[0]}</Text>
                  </View>
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
                <Text style={[styles.userHours, styles.textCenter]}>{user.hours}h</Text>
                <Text style={[styles.userRate, styles.textCenter]}>Rs {user.rate}</Text>
                <Text style={[styles.userBill, styles.textRight]}>Rs {user.total}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => (navigation as any).navigate('UserDetail', { userId: user.id })}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default BillingScreen;