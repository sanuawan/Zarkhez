// src/screens/SettingsAlertsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { styles } from './styles/SettingsAlertsScreen.styles';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsAlertsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const markAllAsRead = async (unreadList: any[]) => {
    if (unreadList.length === 0) return;
    const batch = firestore().batch();
    unreadList.forEach(alert => {
      const docRef = firestore().collection('notifications').doc(alert.id);
      batch.update(docRef, { read: true });
    });
    try {
      await batch.commit();
    } catch (err) {
      console.error("Batch Update Error:", err);
    }
  };

  useEffect(() => {
    let currentAlerts: any[] = [];

    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .limit(30)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot) return;
        const data = querySnapshot.docs.map(doc => {
          const alertData = doc.data();
          let icon = '⚠️';
          let iconBg = '#FFF0F0';
          let iconColor = '#e05353';

          if (alertData.message?.includes('Voltage')) {
            icon = '⚡'; iconBg = '#FFF8E6'; iconColor = '#FFD166';
          } else if (alertData.message?.includes('Current') || alertData.message?.includes('Overload')) {
            icon = '📊'; iconBg = '#E6F4FF'; iconColor = '#2196F3';
          } else if (alertData.type === 'soil') {
            icon = '💧'; iconBg = '#E0F2F1'; iconColor = '#00897B';
          }

          return {
            id: doc.id,
            ...alertData,
            icon, iconBg, iconColor,
            time: alertData.timestamp ? alertData.timestamp.toDate().toLocaleString() : 'Just now',
          };
        });

        setAlerts(data);
        currentAlerts = data;
        setLoading(false);
      });

    return () => {
      unsubscribe();
      const unread = currentAlerts.filter(a => a.read === false);
      markAllAsRead(unread);
    };
  }, []);

  const activeCount = alerts.filter(a => a.read === false).length;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#1F7A63' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔥 Header section wapas add kar diya */}
        <LinearGradient
          colors={['#1F7A63', '#2a9d82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>{t('alerts.settings')}</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>{t('alerts.pageTitle')}</Text>

          {/* Subtitle logic */}
          <Text style={styles.subtitle}>
            {activeCount > 0 ? `${activeCount} ${t('alerts.newAlerts')}` : t('alerts.allNormal')}
          </Text>

          {/* Attention Banner */}
          {activeCount > 0 && (
            <View style={styles.attentionBanner}>
              <Text style={styles.attentionIcon}>⚠️</Text>
              <Text style={styles.attentionText}>{activeCount} {t('alerts.requireAttention')}</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.content}>
          {alerts.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>{t('alerts.noHistory')}</Text>
          ) : (
            alerts.map(alert => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  !alert.read && {
                    backgroundColor: '#F0F7FF',
                    borderColor: '#2196F3',
                    borderWidth: 1
                  }
                ]}
              >
                <View style={styles.alertRow}>
                  <View style={[styles.alertIcon, { backgroundColor: alert.iconBg }]}>
                    <Text style={[styles.alertIconText, { color: alert.iconColor }]}>{alert.icon}</Text>
                  </View>
                  <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                      <Text style={[styles.alertTitle, !alert.read && { fontWeight: 'bold' }]}>
                        {alert.title}
                      </Text>
                      {!alert.read && (
                        <View style={[styles.activeBadge, { backgroundColor: '#2196F3' }]}>
                          <Text style={styles.activeBadgeText}>{t('alerts.new')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.alertDescription}>{alert.message}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsAlertsScreen;