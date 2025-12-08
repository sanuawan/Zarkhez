// src/screens/BillingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { styles } from './styles/BillingScreen.styles';

const BillingScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('billing');

  // Back handler - Go back to Home
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home' as never);
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Mock data
  const currentBill = 2850;
  const waterUsage = 1250; // liters
  const powerUsage = 145; // kWh

  const usageData = [
    { day: language === 'ur' ? 'سوموار' : 'Mon', voltage: 220, current: 5.2, water: 180 },
    { day: language === 'ur' ? 'منگل' : 'Tue', voltage: 225, current: 5.8, water: 210 },
    { day: language === 'ur' ? 'بدھ' : 'Wed', voltage: 218, current: 4.9, water: 165 },
    { day: language === 'ur' ? 'جمعرات' : 'Thu', voltage: 222, current: 5.5, water: 195 },
    { day: language === 'ur' ? 'جمعہ' : 'Fri', voltage: 220, current: 5.3, water: 188 },
    { day: language === 'ur' ? 'ہفتہ' : 'Sat', voltage: 224, current: 5.7, water: 205 },
    { day: language === 'ur' ? 'اتوار' : 'Sun', voltage: 219, current: 5.1, water: 177 }
  ];

  const billingHistory = [
    { month: language === 'ur' ? 'اکتوبر 2024' : 'Oct 2024', amount: 2850, water: 1250, status: 'current' },
    { month: language === 'ur' ? 'ستمبر 2024' : 'Sep 2024', amount: 2650, water: 1180, status: 'paid' },
    { month: language === 'ur' ? 'اگست 2024' : 'Aug 2024', amount: 2920, water: 1340, status: 'paid' },
    { month: language === 'ur' ? 'جولائی 2024' : 'Jul 2024', amount: 3150, water: 1450, status: 'paid' }
  ];

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Home' as never);
    }
    if (tab === 'schedule') {
      navigation.navigate('Schedule' as never);
    }
    if (tab === 'soil') {
      navigation.navigate('CropSoil' as never);
    }

    if (tab === 'alerts') {
      navigation.navigate('Alerts' as never);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header Component without logout */}
      <Header showLogout={false} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}>
            <Text style={styles.titleIconText}>💰</Text>
          </View>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('nav.billing')}
          </Text>
        </View>

        {/* Current Bill */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.currentBillHeader}>
            <Text style={[styles.currentBillTitle, isDark && styles.currentBillTitleDark]}>
              💰 {language === 'ur' ? 'موجودہ بل' : 'Current Bill'}
            </Text>
            <Text style={[styles.currentBillAmount, isDark && styles.currentBillAmountDark]}>
              {language === 'ur' ? 'روپے' : 'Rs.'} {currentBill.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.usageGrid}>
            <View style={[styles.usageItem, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
              <View style={styles.usageIconContainer}>
                <Text style={styles.usageIcon}>💧</Text>
              </View>
              <Text style={[styles.usageLabel, isDark && styles.usageLabelDark]}>
                {language === 'ur' ? 'پانی' : 'Water'}
              </Text>
              <Text style={[styles.usageValue, isDark && styles.usageValueDark]}>
                {waterUsage}L
              </Text>
            </View>
            
            <View style={[styles.usageItem, { backgroundColor: isDark ? '#854d0e' : '#fef3c7' }]}>
              <View style={styles.usageIconContainer}>
                <Text style={styles.usageIcon}>⚡</Text>
              </View>
              <Text style={[styles.usageLabel, isDark && styles.usageLabelDark]}>
                {language === 'ur' ? 'بجلی' : 'Power'}
              </Text>
              <Text style={[styles.usageValue, isDark && styles.usageValueDark]}>
                {powerUsage} kWh
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Usage */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            📊 {language === 'ur' ? 'ہفتہ وار استعمال' : 'Weekly Usage'}
          </Text>
          
          {/* Water Usage */}
          <View style={styles.usageSection}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageSectionIcon}>💧</Text>
              <Text style={[styles.usageSectionTitle, isDark && styles.usageSectionTitleDark]}>
                {language === 'ur' ? 'پانی کا استعمال (لیٹر)' : 'Water Usage (Liters)'}
              </Text>
            </View>
            
            <View style={styles.barChart}>
              {usageData.map((day, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: (day.water / 250) * 60,
                          backgroundColor: '#3b82f6'
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isDark && styles.barLabelDark]}>
                    {day.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Voltage */}
          <View style={styles.usageSection}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageSectionIcon}>⚡</Text>
              <Text style={[styles.usageSectionTitle, isDark && styles.usageSectionTitleDark]}>
                {language === 'ur' ? 'وولٹیج (V)' : 'Voltage (V)'}
              </Text>
            </View>
            
            <View style={styles.lineChart}>
              {usageData.map((day, index) => (
                <View key={index} style={styles.linePointContainer}>
                  <View 
                    style={[
                      styles.linePoint,
                      { 
                        bottom: ((day.voltage - 210) / 20) * 60,
                        backgroundColor: '#f59e0b'
                      }
                    ]}
                  />
                  <Text style={[styles.lineLabel, isDark && styles.lineLabelDark]}>
                    {day.day}
                  </Text>
                </View>
              ))}
              <View style={[styles.line, isDark && styles.lineDark]} />
            </View>
          </View>
        </View>

        {/* Billing History */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            📋 {language === 'ur' ? 'بلنگ کی تاریخ' : 'Billing History'}
          </Text>
          
          <View style={styles.historyList}>
            {billingHistory.map((bill, index) => (
              <View 
                key={index} 
                style={[
                  styles.historyItem,
                  isDark && styles.historyItemDark,
                  bill.status === 'current' && [styles.currentBillItem, isDark && styles.currentBillItemDark]
                ]}
              >
                <View style={styles.historyLeft}>
                  <View style={styles.statusIndicator}>
                    <View 
                      style={[
                        styles.statusDot,
                        { 
                          backgroundColor: bill.status === 'current' ? 
                            (isDark ? '#8b5cf6' : '#8b5cf6') : 
                            (isDark ? '#10b981' : '#10b981')
                        }
                      ]} 
                    />
                  </View>
                  <View>
                    <Text style={[styles.historyMonth, isDark && styles.historyMonthDark]}>
                      {bill.month}
                    </Text>
                    <View style={styles.waterUsage}>
                      <Text style={styles.waterIcon}>💧</Text>
                      <Text style={[styles.waterAmount, isDark && styles.waterAmountDark]}>
                        {bill.water}L
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.historyRight}>
                  <Text style={[styles.historyAmount, isDark && styles.historyAmountDark]}>
                    {language === 'ur' ? 'روپے' : 'Rs.'} {bill.amount.toLocaleString()}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: bill.status === 'current' ? 
                        (isDark ? '#4c1d95' : '#ede9fe') : 
                        (isDark ? '#064e3b' : '#d1fae5')
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { 
                        color: bill.status === 'current' ? 
                          (isDark ? '#c4b5fd' : '#7c3aed') : 
                          (isDark ? '#6ee7b7' : '#065f46')
                      }
                    ]}>
                      {bill.status === 'current' ? 
                        (language === 'ur' ? 'موجودہ' : 'Current') : 
                        (language === 'ur' ? 'ادا شدہ' : 'Paid')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default BillingScreen;