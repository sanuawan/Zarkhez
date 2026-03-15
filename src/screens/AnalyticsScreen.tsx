import React, { useState } from 'react';
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
import AreaChart from '../components/charts/AreaChart';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import { styles } from './styles/AnalyticsScreen.styles';

// Static data (from your web component)
const weeklyData = [
  { day: 'Mon', usage: 4.2 },
  { day: 'Tue', usage: 6.8 },
  { day: 'Wed', usage: 5.1 },
  { day: 'Thu', usage: 7.3 },
  { day: 'Fri', usage: 3.9 },
  { day: 'Sat', usage: 8.1 },
  { day: 'Sun', usage: 5.5 },
];

const monthlyData: Record<string, { week: string; energy: number }[]> = {
  'Mar 2026': [
    { week: 'W1', energy: 38 },
    { week: 'W2', energy: 45 },
    { week: 'W3', energy: 52 },
    { week: 'W4', energy: 41 },
  ],
  'Feb 2026': [
    { week: 'W1', energy: 33 },
    { week: 'W2', energy: 41 },
    { week: 'W3', energy: 47 },
    { week: 'W4', energy: 36 },
  ],
  'Jan 2026': [
    { week: 'W1', energy: 29 },
    { week: 'W2', energy: 38 },
    { week: 'W3', energy: 43 },
    { week: 'W4', energy: 31 },
  ],
  'Dec 2025': [
    { week: 'W1', energy: 44 },
    { week: 'W2', energy: 50 },
    { week: 'W3', energy: 55 },
    { week: 'W4', energy: 48 },
  ],
  'Nov 2025': [
    { week: 'W1', energy: 36 },
    { week: 'W2', energy: 42 },
    { week: 'W3', energy: 39 },
    { week: 'W4', energy: 35 },
  ],
  'Oct 2025': [
    { week: 'W1', energy: 31 },
    { week: 'W2', energy: 37 },
    { week: 'W3', energy: 34 },
    { week: 'W4', energy: 29 },
  ],
};

const monthOrder = [
  'Mar 2026', 'Feb 2026', 'Jan 2026',
  'Dec 2025', 'Nov 2025', 'Oct 2025',
];

const allMonthsScrollData = [
  { label: 'Oct', value: 131 },
  { label: 'Nov', value: 152 },
  { label: 'Dec', value: 197 },
  { label: 'Jan', value: 141 },
  { label: 'Feb', value: 157 },
  { label: 'Mar', value: 176 },
];

const yearlyData = [
  { label: '2024', value: 1640 },
  { label: '2025', value: 1890 },
  { label: '2026', value: 474 },
];

const monthlySummaries: Record<string, { label: string; value: string }[]> = {
  'Mar 2026': [
    { label: 'Peak Usage Day', value: 'Saturday' },
    { label: 'Avg Daily Usage', value: '5.8 kWh' },
    { label: 'Total Cost', value: 'Rs 2,600' },
    { label: 'Motor Runtime', value: '13 hrs' },
    { label: 'Efficiency Score', value: '87%' },
    { label: 'Savings vs Last Mo.', value: 'Rs 340' },
  ],
  'Feb 2026': [
    { label: 'Peak Usage Day', value: 'Thursday' },
    { label: 'Avg Daily Usage', value: '5.3 kWh' },
    { label: 'Total Cost', value: 'Rs 2,300' },
    { label: 'Motor Runtime', value: '11.5 hrs' },
    { label: 'Efficiency Score', value: '84%' },
    { label: 'Savings vs Last Mo.', value: 'Rs 180' },
  ],
  // ... add others if needed
};

const statsCards = [
  { label: 'Voltage', value: '220V', icon: '⚡', color: '#FFD166', bg: '#FFF8E6' },
  { label: 'Current', value: '8.5A', icon: '📊', color: '#6ED3B5', bg: '#E8F3F0' },
  { label: 'Power', value: '1.87 kW', icon: '📈', color: '#1F7A63', bg: '#E8F3F0' },
  { label: 'Energy', value: '176 kWh', icon: '🔋', color: '#FFD166', bg: '#FFF8E6' },
];

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // ← status bar height ke liye
  const [filter, setFilter] = useState<'weekly' | 'monthly'>('weekly');
  const [monthIdx, setMonthIdx] = useState(0);
  const selectedMonth = monthOrder[monthIdx];
  const monthlyChartData = monthlyData[selectedMonth]?.map(d => ({ label: d.week, value: d.energy })) || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1F7A63', '#2a9d82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]} // ← dynamic top padding
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Analytics</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Energy Usage</Text>
          <Text style={styles.subtitle}>Tube-Well Power Analytics · March 2026</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, filter === 'weekly' && styles.toggleActive]}
              onPress={() => setFilter('weekly')}
            >
              <Text style={[styles.toggleText, filter === 'weekly' && styles.toggleTextActive]}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, filter === 'monthly' && styles.toggleActive]}
              onPress={() => setFilter('monthly')}
            >
              <Text style={[styles.toggleText, filter === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            {statsCards.map((card, idx) => (
              <View key={idx} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statLabel}>{card.label}</Text>
                  <View style={[styles.statIcon, { backgroundColor: card.bg }]}>
                    <Text style={[styles.statIconText, { color: card.color }]}>{card.icon}</Text>
                  </View>
                </View>
                <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
              </View>
            ))}
          </View>

          {/* Current Period Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              {filter === 'weekly' ? 'Weekly Electricity Usage' : `Monthly Energy · ${selectedMonth}`}
            </Text>
            {filter === 'weekly' ? (
              <AreaChart data={weeklyData} />
            ) : (
              <>
                <View style={styles.monthNavigator}>
                  <TouchableOpacity
                    onPress={() => setMonthIdx(prev => Math.min(prev + 1, monthOrder.length - 1))}
                    disabled={monthIdx >= monthOrder.length - 1}
                  >
                    <Text style={[styles.navArrow, monthIdx >= monthOrder.length - 1 && styles.disabled]}>{'←'}</Text>
                  </TouchableOpacity>
                  <Text style={styles.currentMonth}>{selectedMonth}</Text>
                  <TouchableOpacity
                    onPress={() => setMonthIdx(prev => Math.max(prev - 1, 0))}
                    disabled={monthIdx === 0}
                  >
                    <Text style={[styles.navArrow, monthIdx === 0 && styles.disabled]}>{'→'}</Text>
                  </TouchableOpacity>
                </View>
                <BarChart data={monthlyChartData} color="#6ED3B5" />
              </>
            )}
          </View>

          {/* Historical All Months */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Historical — All Months</Text>
            <Text style={styles.chartSubtitle}>Total energy per month (kWh)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ width: 480 }}>
                <BarChart data={allMonthsScrollData} color="#1F7A63" gradient />
              </View>
            </ScrollView>
            <Text style={styles.scrollHint}>← scroll to explore →</Text>
          </View>

          {/* Yearly Summary */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Yearly Summary</Text>
            <Text style={styles.chartSubtitle}>Annual energy consumption (kWh)</Text>
            <LineChart data={yearlyData} />
          </View>

          {/* Summary Cards */}
          <Text style={styles.summarySectionTitle}>
            {filter === 'weekly' ? 'Monthly Analytics Summary' : `Summary · ${selectedMonth}`}
          </Text>
          {(filter === 'weekly' ? monthlySummaries['Mar 2026'] : monthlySummaries[selectedMonth] || []).map((item, idx) => (
            <View key={idx} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;