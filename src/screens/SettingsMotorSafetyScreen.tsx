import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import Slider from '@react-native-community/slider';
import { styles } from './styles/SettingsMotorSafetyScreen.styles';
import motorRuntimeService, { MotorRuntimeData } from '../services/motorRuntimeService';
import { useRef } from 'react';

const SettingsMotorSafetyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // States
  const [controlMode, setControlMode] = useState<'auto' | 'manual'>('auto');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [minV, setMinV] = useState(190.0);
  const [maxV, setMaxV] = useState(240.0);
  const [maxA, setMaxA] = useState(12.0);
  const notificationSentRef = useRef(false);

  // Motor Service States
  const [runningHours, setRunningHours] = useState(0);
  const [serviceLimitInput, setServiceLimitInput] = useState("500");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [serviceExceeded, setServiceExceeded] = useState(false);
  const [serviceProgress, setServiceProgress] = useState(0);

  const formatDuration = (totalHours: number) => {
    const totalMinutes = Math.round(totalHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m} mins`;
    return `${h} hrs ${m} mins`;
  };

  // Load data
  const loadData = async () => {
    try {
      const safetyDoc = await firestore().collection('settings').doc('safety_config').get();
      if (safetyDoc.exists()) {
        const d = safetyDoc.data();
        if (d) {
          setMinV(d.minV ?? 190.0);
          setMaxV(d.maxV ?? 240.0);
          setMaxA(d.maxA ?? 12.0);
          if (d.serviceLimit) {
            setServiceLimitInput(d.serviceLimit.toString());
          }
          if (d.controlMode) {
            setControlMode(d.controlMode);
          }
        }
      }

      const runtimeData = await motorRuntimeService.getRuntimeData();
      setRunningHours(runtimeData.totalHours);

      const limit = parseInt(serviceLimitInput);
      const exceeded = runtimeData.totalHours >= limit;
      setServiceExceeded(exceeded);
      setServiceProgress(Math.min((runtimeData.totalHours / limit) * 100, 100));

      motorRuntimeService.startAutoSync();

    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

// Real-time listener: Sirf aik dafa notification jayega jab tak RESET na ho
useEffect(() => {
  const unsubscribe = motorRuntimeService.subscribe(async (data: MotorRuntimeData) => {
    const currentHours = data.totalHours;
    const limit = parseInt(serviceLimitInput);
    
    setRunningHours(currentHours);
    const exceeded = currentHours >= limit;
    setServiceExceeded(exceeded);
    setServiceProgress(Math.min((currentHours / limit) * 100, 100));

    // 🚀 THE ULTIMATE FIX:
    // Hum check kar rahe hain ke kya is session mein AIK BHI DAFA notification gaya?
    // Agar gaya hai (ref.current true hai), to limit barhane par bhi ye IF nahi chalega.
    if (exceeded && !notificationSentRef.current && currentHours > 0) {
      notificationSentRef.current = true; // Lock laga diya (Ye refresh nahi hoga)

      try {
        await firestore().collection('notifications').add({
          title: "🔧 SERVICE REQUIRED",
          message: `Motor service due at ${limit} hours. Current: ${formatDuration(currentHours)}`,
          type: "service",
          read: false,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        console.log("✅ One-time notification sent!");
      } catch (err) {
        console.error("❌ Error:", err);
        notificationSentRef.current = false; 
      }
    }

    // Sirf tab lock kholna jab user waqai RESET button dabaye (hours 0 ho jayein)
    if (currentHours === 0) {
      notificationSentRef.current = false;
    }
  });

  return () => unsubscribe();
}, [serviceLimitInput]);
  // Reset service counter
  const handleResetService = async () => {
    try {
      await motorRuntimeService.resetServiceCounter();
      setShowResetConfirm(false);
      await motorRuntimeService.forceRefreshFromBilling();
      await loadData();
      Alert.alert("Success", "Service counter reset successfully!");
    } catch (error) {
      console.error('Reset error:', error);
      Alert.alert("Error", "Could not reset service counter.");
    }
  };

  // Manual refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await motorRuntimeService.forceRefreshFromBilling();
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await firestore().collection('settings').doc('safety_config').set({
        minV: parseFloat(minV.toString()),
        maxV: parseFloat(maxV.toString()),
        maxA: parseFloat(maxA.toString()),
        controlMode: controlMode,
        serviceLimit: parseInt(serviceLimitInput),
        updatedAt: firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      await firestore().collection('notifications').add({
        message: `Motor safety settings updated. Service limit: ${serviceLimitInput} hours`,
        read: false,
        timestamp: firestore.FieldValue.serverTimestamp(),
        title: "⚙️ SETTINGS UPDATED",
        type: "settings"
      });

      await motorRuntimeService.forceRefreshFromBilling();
      await loadData();

      Alert.alert("Success", "Safety settings updated!");
    } catch (e) {
      Alert.alert("Error", "Could not save settings.");
    }
    setSaving(false);
  };

  // MERGED CARD - Smart Control Mode + Slider UI for Voltage & Current
  const MergedCard = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SMART MOTOR CONTROL</Text>

      {/* Smart Control Mode */}
      <Text style={styles.mergedSubLabel}>CONTROL MODE</Text>
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, controlMode === 'auto' && styles.modeButtonActive]}
          onPress={() => setControlMode('auto')}>
          <View style={styles.modeIconCircle}><Text>⚡</Text></View>
          <Text style={[styles.modeButtonText, controlMode === 'auto' && { color: '#fff' }]}>Auto Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, controlMode === 'manual' && styles.modeButtonActive]}
          onPress={() => setControlMode('manual')}>
          <View style={styles.modeIconCircle}><Text>📈</Text></View>
          <Text style={[styles.modeButtonText, controlMode === 'manual' && { color: '#fff' }]}>Manual Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modeDescriptionBanner}>
        <Text style={styles.modeDescriptionText}>
          🛡️ {controlMode === 'auto' ? "Motor stops automatically when limits are exceeded." : "You receive up to 3 notifications before motor auto-stops."}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Voltage & Current Limits with Slider UI */}
      <Text style={styles.mergedSubLabel}>VOLTAGE & CURRENT LIMITS</Text>

      {/* Minimum Voltage */}
      <View style={styles.mergedRow}>
        <View style={styles.sliderHeader}>
          <Text style={styles.mergedLabel}>Minimum Voltage</Text>
          <View style={styles.valueBox}>
            <TextInput
              style={styles.valueText}
              defaultValue={minV.toString()} // 'value' ki jagah 'defaultValue'
              maxLength={3}
              keyboardType="numeric"
              onEndEditing={(e) => setMinV(parseFloat(e.nativeEvent.text) || 0)}
            />
            <Text style={styles.unitText}>V</Text>
          </View>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={220}
          step={0.5}
          value={minV}
          // isko khatam kr dein: onValueChange={(val) => setMinV(parseFloat(val.toFixed(1)))}
          onSlidingComplete={(val) => setMinV(parseFloat(val.toFixed(1)))} // Sirf ye add karein
          minimumTrackTintColor="#FFD066"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#FFD066"
        />

        <View style={styles.rangeLabels}>
          <Text style={styles.labelSmall}>0 V</Text>
          <Text style={styles.labelSmall}>220 V</Text>
        </View>
      </View>

      {/* Maximum Voltage */}
      <View style={styles.mergedRow}>
        <View style={styles.sliderHeader}>
          <Text style={styles.mergedLabel}>Maximum Voltage</Text>
          <View style={[styles.valueBox, { borderColor: '#FEE2E2' }]}>
            <TextInput
              style={styles.valueText}
              defaultValue={maxV.toString()} // 'value' ki jagah 'defaultValue'
              maxLength={3}
              keyboardType="numeric"
              onEndEditing={(e) => setMaxV(parseFloat(e.nativeEvent.text) || 0)}
            />
            <Text style={[styles.unitText, { color: '#EF4444' }]}>V</Text>
          </View>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={240}
          step={0.5}
          value={maxV}
          onSlidingComplete={(val) => setMaxV(parseFloat(val.toFixed(1)))} // Ye line change karein
          minimumTrackTintColor="#EF4444"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#EF4444"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.labelSmall}>0 V</Text>
          <Text style={styles.labelSmall}>240 V</Text>
        </View>
      </View>

      {/* Maximum Current */}
      <View style={styles.mergedRow}>
        <View style={styles.sliderHeader}>
          <Text style={styles.mergedLabel}>Maximum Current</Text>
          <View style={[styles.valueBox, { borderColor: '#FEE2E2' }]}>
            <TextInput
              style={styles.valueText}
              defaultValue={maxA.toString()} // 'value' ki jagah 'defaultValue'
              maxLength={3}
              keyboardType="numeric"
              onEndEditing={(e) => setMaxA(parseFloat(e.nativeEvent.text) || 0)}
            />
            <Text style={[styles.unitText, { color: '#EF4444' }]}>A</Text>
          </View>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={20}
          step={0.1}
          value={maxA}
          onSlidingComplete={(val) => setMaxA(parseFloat(val.toFixed(1)))} // Ye line change karein
          minimumTrackTintColor="#EF4444"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#EF4444"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.labelSmall}>0 A</Text>
          <Text style={styles.labelSmall}>20 A</Text>
        </View>
      </View>
    </View>
  );

  const MotorServiceCard = () => {
    const formatRemainingTime = (remainingHours: number) => {
      const hours = Math.floor(remainingHours);
      const minutes = Math.round((remainingHours - hours) * 60);
      if (hours === 0 && minutes === 0) return '0 hrs';
      if (hours === 0) return `${minutes} mins`;
      if (minutes === 0) return `${hours} hrs`;
      return `${hours} hrs ${minutes} mins`;
    };

    const remaining = Math.max(0, parseInt(serviceLimitInput) - runningHours);

    return (
      <View style={styles.serviceCard}>
        <Text style={styles.cardTitle}>🔧 MOTOR SERVICE</Text>

        <View style={styles.serviceStatusRow}>
          <View style={styles.serviceStatusLeft}>
            <View style={[styles.serviceIcon, { backgroundColor: serviceExceeded ? '#FEE2E2' : '#E8F3F0' }]}>
              <Text style={styles.serviceIconText}>🔧</Text>
            </View>
            <View>
              <Text style={styles.serviceStatusLabel}>Service Status</Text>
              <Text style={[styles.serviceStatusValue, { color: serviceExceeded ? '#EF4444' : '#1F7A63' }]}>
                {serviceExceeded ? 'Service Required' : 'Normal'}
              </Text>
            </View>
          </View>
          <View style={[styles.serviceBadge, { backgroundColor: serviceExceeded ? '#FEE2E2' : '#E8F3F0' }]}>
            <Text style={[styles.serviceBadgeText, { color: serviceExceeded ? '#EF4444' : '#1F7A63' }]}>
              {serviceExceeded ? '⚠️ Service Required' : '✓ Normal'}
            </Text>
          </View>
        </View>

        {serviceExceeded && (
          <View style={[styles.alertBanner, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={[styles.alertText, { color: '#EF4444' }]}>
              Service required! Motor has exceeded {serviceLimitInput} hours.
            </Text>
          </View>
        )}

        {!serviceExceeded && (
          <View style={[styles.infoBannerSmall, { backgroundColor: '#E8F3F0' }]}>
            <Text style={styles.infoIcon}>✓</Text>
            <Text style={[styles.infoTextSmall, { color: '#1F7A63' }]}>
              Motor is in good condition. {formatRemainingTime(remaining)} remaining.
            </Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Running Time</Text>
            <Text style={[styles.statValue, { color: serviceExceeded ? '#EF4444' : '#1F7A63' }]}>
              {formatDuration(runningHours)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Service Limit</Text>
            <Text style={[styles.statValue, { color: '#1F7A63' }]}>
              {serviceLimitInput} <Text style={styles.statUnit}>hrs</Text>
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0</Text>
            <Text style={[styles.progressPercent, { color: serviceExceeded ? '#EF4444' : '#1F7A63' }]}>
              {serviceProgress.toFixed(0)}%
            </Text>
            <Text style={styles.progressLabel}>{serviceLimitInput} hrs</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${serviceProgress}%`,
              backgroundColor: serviceExceeded ? '#EF4444' : '#1F7A63'
            }]} />
          </View>
        </View>

        <View style={styles.customLimitSection}>
          <Text style={styles.customLimitLabel}>Custom Service Limit</Text>
          <View style={styles.customLimitInputContainer}>
            <TextInput
              style={styles.customLimitInput}
              value={serviceLimitInput}
              onChangeText={(text) => {
                setServiceLimitInput(text);
                const newLimit = parseInt(text) || 500;
                setServiceExceeded(runningHours >= newLimit);
                setServiceProgress(Math.min((runningHours / newLimit) * 100, 100));
              }}
              keyboardType="numeric"
              placeholder="500"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.customLimitUnit}>
              <Text style={styles.customLimitUnitText}>hours</Text>
            </View>
          </View>
        </View>

        {showResetConfirm ? (
          <View style={styles.resetConfirmContainer}>
            <Text style={styles.resetConfirmText}>Reset service counter?</Text>
            <Text style={[styles.resetConfirmText, { fontSize: 10, color: '#666' }]}>
              Current: {formatDuration(runningHours)} will be reset to 0
            </Text>
            <View style={styles.resetConfirmButtons}>
              <TouchableOpacity
                onPress={() => setShowResetConfirm(false)}
                style={[styles.resetConfirmButton, styles.resetConfirmCancel]}>
                <Text style={styles.resetConfirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResetService}
                style={[styles.resetConfirmButton, styles.resetConfirmOk]}>
                <Text style={[styles.resetConfirmButtonText, { color: '#fff' }]}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowResetConfirm(true)}
            style={styles.resetButton}>
            <Text style={styles.resetButtonText}>⟳ Reset Service Counter</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#1F7A63" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1F7A63"]} />
        }>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Safety Guard</Text>
          <Text style={styles.subtitle}>Protect your motor with smart monitoring</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* MERGED CARD - Smart Control + Slider UI for Voltage & Current */}
          <MergedCard />

          {/* Motor Service Card */}
          <MotorServiceCard />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Apply Changes</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsMotorSafetyScreen;