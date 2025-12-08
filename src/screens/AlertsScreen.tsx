// src/screens/AlertsScreen.tsx
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
import { styles } from './styles/AlertsScreen.styles';

const AlertsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('alerts');

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

  // Mock alert data
  const alerts = [
    {
      id: 1,
      type: 'warning',
      icon: '⚠️',
      title: language === 'ur' ? 'موٹر اوورلوڈ' : 'Motor Overload',
      description: language === 'ur' ? 'وولٹیج: 245V (محفوظ: 220V ± 10%)' : 'Voltage: 245V (Safe: 220V ± 10%)',
      status: 'active',
      time: language === 'ur' ? '2 منٹ پہلے' : '2 min ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'error',
      icon: '🔴',
      title: language === 'ur' ? 'ایمرجنسی اسٹاپ' : 'Emergency Stop',
      description: language === 'ur' ? 'اوور ہیٹنگ کی وجہ سے موٹر بند' : 'Motor stopped due to overheating',
      status: 'resolved',
      time: language === 'ur' ? '1 گھنٹہ پہلے' : '1 hour ago',
      severity: 'critical'
    },
    {
      id: 3,
      type: 'maintenance',
      icon: '🔧',
      title: language === 'ur' ? 'سروس ڈیو' : 'Service Due',
      description: language === 'ur' ? 'موٹر سروس 5 دنوں میں ڈیو' : 'Motor service due in 5 days',
      status: 'pending',
      time: language === 'ur' ? '1 دن پہلے' : '1 day ago',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'info',
      icon: '✅',
      title: language === 'ur' ? 'تمام سسٹمز محفوظ' : 'All Systems Safe',
      description: language === 'ur' ? 'تمام سسٹمز معمول کے مطابق کام کر رہے ہیں' : 'All systems operating normally',
      status: 'active',
      time: language === 'ur' ? 'ابھی' : 'Now',
      severity: 'low'
    }
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
    if (tab === 'billing') {
      navigation.navigate('Billing' as never);
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active' && alert.severity !== 'low');

  const getAlertColor = (severity: string, status: string) => {
    if (status === 'resolved') return isDark ? '#374151' : '#f3f4f6';
    
    switch (severity) {
      case 'critical': return isDark ? '#7f1d1d' : '#fef2f2';
      case 'high': return isDark ? '#7c2d12' : '#fffbeb';
      case 'medium': return isDark ? '#713f12' : '#fefce8';
      case 'low': return isDark ? '#14532d' : '#f0fdf4';
      default: return isDark ? '#374151' : '#f3f4f6';
    }
  };

  const getAlertBorderColor = (severity: string, status: string) => {
    if (status === 'resolved') return isDark ? '#4b5563' : '#d1d5db';
    
    switch (severity) {
      case 'critical': return isDark ? '#991b1b' : '#fecaca';
      case 'high': return isDark ? '#9a3412' : '#fed7aa';
      case 'medium': return isDark ? '#854d0e' : '#fef08a';
      case 'low': return isDark ? '#166534' : '#bbf7d0';
      default: return isDark ? '#4b5563' : '#d1d5db';
    }
  };

  const getStatusBadge = (status: string, severity: string) => {
    if (status === 'resolved') {
      return { 
        text: language === 'ur' ? 'حل شدہ' : 'Resolved', 
        bg: isDark ? '#4b5563' : '#e5e7eb',
        color: isDark ? '#d1d5db' : '#374151'
      };
    }
    if (status === 'pending') {
      return { 
        text: language === 'ur' ? 'زیر التواء' : 'Pending', 
        bg: isDark ? '#1e3a8a' : '#dbeafe',
        color: isDark ? '#93c5fd' : '#1e40af'
      };
    }
    
    switch (severity) {
      case 'critical':
        return { 
          text: language === 'ur' ? 'تشویشناک' : 'Critical', 
          bg: isDark ? '#7f1d1d' : '#fecaca',
          color: isDark ? '#fca5a5' : '#dc2626'
        };
      case 'high':
        return { 
          text: language === 'ur' ? 'انتباہ' : 'Warning', 
          bg: isDark ? '#7c2d12' : '#fed7aa',
          color: isDark ? '#fdba74' : '#ea580c'
        };
      case 'medium':
        return { 
          text: language === 'ur' ? 'نوٹس' : 'Notice', 
          bg: isDark ? '#713f12' : '#fef08a',
          color: isDark ? '#fcd34d' : '#ca8a04'
        };
      case 'low':
        return { 
          text: language === 'ur' ? 'نارمل' : 'Normal', 
          bg: isDark ? '#14532d' : '#bbf7d0',
          color: isDark ? '#86efac' : '#16a34a'
        };
      default:
        return { 
          text: language === 'ur' ? 'نامعلوم' : 'Unknown', 
          bg: isDark ? '#374151' : '#e5e7eb',
          color: isDark ? '#d1d5db' : '#374151'
        };
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
            <Text style={styles.titleIconText}>🛡️</Text>
          </View>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {language === 'ur' ? 'سیفٹی الرٹس' : 'Safety Alerts'}
          </Text>
          {activeAlerts.length > 0 && (
            <View style={styles.activeAlertsBadge}>
              <Text style={styles.activeAlertsText}>
                {activeAlerts.length} {language === 'ur' ? 'ایکٹو الرٹ' : 'Active Alert'}{activeAlerts.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Status Cards */}
        <View style={styles.statusGrid}>
          {/* Motor Status */}
          <View style={[styles.statusCard, { backgroundColor: isDark ? '#064e3b' : '#d1fae5' }]}>
            <View style={[styles.statusIcon, { backgroundColor: isDark ? '#059669' : '#10b981' }]}>
              <Text style={styles.statusIconText}>⚡</Text>
            </View>
            <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>
              {language === 'ur' ? 'موٹر کی حالت' : 'Motor Status'}
            </Text>
            <Text style={[styles.statusValue, isDark && styles.statusValueDark]}>
              {language === 'ur' ? 'چل رہی ہے' : 'Running'}
            </Text>
          </View>

          {/* System Health */}
          <View style={[styles.statusCard, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
            <View style={[styles.statusIcon, { backgroundColor: isDark ? '#3b82f6' : '#2563eb' }]}>
              <Text style={styles.statusIconText}>🛡️</Text>
            </View>
            <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>
              {language === 'ur' ? 'سسٹم صحت' : 'System Health'}
            </Text>
            <Text style={[styles.statusValue, isDark && styles.statusValueDark]}>
              85%
            </Text>
          </View>
        </View>

        {/* Alert List */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            🚨 {language === 'ur' ? 'حالیہ الرٹس' : 'Recent Alerts'}
          </Text>
          
          <View style={styles.alertsList}>
            {alerts.map((alert) => {
              const statusBadge = getStatusBadge(alert.status, alert.severity);
              return (
                <View 
                  key={alert.id}
                  style={[
                    styles.alertItem,
                    { 
                      backgroundColor: getAlertColor(alert.severity, alert.status),
                      borderColor: getAlertBorderColor(alert.severity, alert.status)
                    }
                  ]}
                >
                  <View style={styles.alertHeader}>
                    <View style={styles.alertLeft}>
                      <Text style={styles.alertIcon}>{alert.icon}</Text>
                      <View style={styles.alertTextContainer}>
                        <Text style={[styles.alertTitle, isDark && styles.alertTitleDark]}>
                          {alert.title}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                          <Text style={[styles.statusText, { color: statusBadge.color }]}>
                            {statusBadge.text}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.alertTime, isDark && styles.alertTimeDark]}>
                      {alert.time}
                    </Text>
                  </View>
                  
                  <Text style={[styles.alertDescription, isDark && styles.alertDescriptionDark]}>
                    {alert.description}
                  </Text>
                  
                  {alert.status === 'active' && alert.severity !== 'low' && (
                    <View style={styles.alertActions}>
                      <TouchableOpacity style={[styles.actionButton, { borderColor: isDark ? '#6b7280' : '#9ca3af' }]}>
                        <Text style={[styles.actionButtonText, isDark && styles.actionButtonTextDark]}>
                          {language === 'ur' ? 'چیک کریں' : 'Check Required'}
                        </Text>
                      </TouchableOpacity>
                      {alert.severity === 'critical' && (
                        <TouchableOpacity style={[styles.emergencyButton, { backgroundColor: isDark ? '#dc2626' : '#ef4444' }]}>
                          <Text style={styles.emergencyButtonText}>
                            {language === 'ur' ? 'ایمرجنسی اسٹاپ' : 'Emergency Stop'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Emergency Controls */}
        <View style={styles.emergencyControls}>
          <TouchableOpacity style={[styles.emergencyStopButton, { backgroundColor: isDark ? '#dc2626' : '#ef4444' }]}>
            <Text style={styles.emergencyStopText}>⛔ {language === 'ur' ? 'ایمرجنسی موٹر اسٹاپ' : 'Emergency Motor Stop'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.serviceButton, { borderColor: isDark ? '#d97706' : '#f59e0b' }]}>
            <Text style={[styles.serviceButtonText, { color: isDark ? '#f59e0b' : '#d97706' }]}>
              🔧 {language === 'ur' ? 'سروس کال کی درخواست کریں' : 'Request Service Call'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default AlertsScreen;