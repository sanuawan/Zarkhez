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
  BackHandler,
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
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const SettingsMotorSafetyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const handleBack = () => navigation.goBack();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  

  const scrollViewRef = useRef<ScrollView>(null);
  const customLimitInputRef = useRef<TextInput>(null);

  // States
  const [controlMode, setControlMode] = useState<'auto' | 'manual'>('auto');
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [minV, setMinV] = useState(190.0);
  const [maxV, setMaxV] = useState(240.0);
  const [maxA, setMaxA] = useState(12.0);
  const notificationSentRef = useRef(false);
  const [defaultLimit, setDefaultLimit] = useState("500");

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
            setDefaultLimit(d.serviceLimit.toString());   // ✅ add this
          }
          if (d.controlMode) {
            setControlMode(d.controlMode);
          }
        }
      }

      const runtimeData = await motorRuntimeService.getRuntimeData();
      setRunningHours(runtimeData?.totalHours ?? 0);

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
    <View style={[styles.section, isDark && styles.sectionDark]}>
      <Text style={[styles.sectionTitle, isDark && styles.textMutedDark]}>{t('safety.smartControl')}</Text>

      {/* Smart Control Mode */}
      <Text style={[styles.mergedSubLabel, isDark && styles.textWhite]}>{t('safety.controlMode')}</Text>
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, isDark && styles.modeButtonDark, controlMode === 'auto' && styles.modeButtonActive]}
          onPress={() => setControlMode('auto')}>
          <View style={styles.modeIconCircle}><Text>⚡</Text></View>
          <Text style={[styles.modeButtonText, isDark && styles.textWhite]}>{t('safety.autoMode')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, isDark && styles.modeButtonDark, controlMode === 'manual' && styles.modeButtonActive]}
          onPress={() => setControlMode('manual')}>
          <View style={styles.modeIconCircle}><Text>📈</Text></View>
          <Text style={[styles.modeButtonText, isDark && styles.textWhite]}>{t('safety.manualMode')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.modeDescriptionBanner, isDark && styles.modeDescriptionBannerDark]}>
        <Text style={[styles.modeDescriptionText, isDark && styles.modeDescriptionTextDark]}>
          🛡️ {controlMode === 'auto' ? t('safety.autoDesc') : t('safety.manualDesc')}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Voltage & Current Limits with Slider UI */}
      <Text style={[styles.mergedSubLabel, isDark && styles.textWhite]}>{t('safety.limits')}</Text>

      {/* Minimum Voltage */}
      <View style={styles.mergedRow}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.mergedLabel, isDark && styles.textWhite]}>{t('safety.minVol')}</Text>
          <View style={[styles.valueBox, isDark && styles.valueBoxDark]}>
            <TextInput
              style={[styles.valueText, isDark && styles.textWhite]}
              defaultValue={minV.toString()} // 'value' ki jagah 'defaultValue'
              maxLength={3}
              keyboardType="numeric"
              onEndEditing={(e) => setMinV(parseFloat(e.nativeEvent.text) || 0)}
            />
            <Text style={[styles.unitText, { color: '#EF4444' }]}>V</Text>
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
          maximumTrackTintColor={isDark ? '#3a4b46' : '#E5E7EB'}
          thumbTintColor="#FFD066"
        />

        <View style={styles.rangeLabels}>
          <Text style={[styles.labelSmall, isDark && styles.textMutedDark]}>0 V</Text>
          <Text style={[styles.labelSmall, isDark && styles.textMutedDark]}>220 V</Text>
        </View>
      </View>

      {/* Maximum Voltage */}
      <View style={styles.mergedRow}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.mergedLabel, isDark && styles.textWhite]}>{t('safety.maxVol')}</Text>
          <View style={[styles.valueBox, isDark && styles.valueBoxDark, { borderColor: '#FEE2E2' }]}>
            <TextInput
              style={[styles.valueText, isDark && styles.textWhite]}
              defaultValue={maxV.toString()} // 'value' ki jagah 'defaultValue'
              maxLength={3}
              keyboardType="numeric"
              onEndEditing={(e) => setMaxV(parseFloat(e.nativeEvent.text) || 0)}
            />
            <Text style={[styles.unitText, isDark && styles.textMutedDark, { color: '#EF4444' }]}>V</Text>
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
          maximumTrackTintColor={isDark ? '#3a4b46' : '#E5E7EB'}
          thumbTintColor="#EF4444"
        />
        <View style={styles.rangeLabels}>
          <Text style={[styles.labelSmall, isDark && styles.textMutedDark]}>0 V</Text>
          <Text style={[styles.labelSmall, isDark && styles.textMutedDark]}>240 V</Text>
        </View>
      </View>

      {/* Maximum Current */}
      <View style={styles.mergedRow}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.mergedLabel, isDark && styles.textWhite]}>{t('safety.maxCurr')}</Text>
          <View style={[styles.valueBox, isDark && styles.valueBoxDark, { borderColor: '#FEE2E2' }]}>
            <TextInput
              style={[styles.valueText, isDark && styles.textWhite]}
              defaultValue={maxA.toString()} // 'value' ki jagah 'defaultValue'
              maxLength={3}
              keyboardType="numeric"
              onEndEditing={(e) => setMaxA(parseFloat(e.nativeEvent.text) || 0)}
            />
            <Text style={[styles.unitText, isDark && styles.textMutedDark, { color: '#EF4444' }]}>A</Text>
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
          maximumTrackTintColor={isDark ? '#3a4b46' : '#E5E7EB'}
          thumbTintColor="#EF4444"
        />
        <View style={styles.rangeLabels}>
          <Text style={[styles.labelSmall, isDark && styles.textMutedDark]}>0 A</Text>
          <Text style={[styles.labelSmall, isDark && styles.textMutedDark]}>20 A</Text>
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

    const limitNum = parseInt(serviceLimitInput) || 500;
    const remaining = Math.max(0, limitNum - (runningHours || 0));

    return (
      <View style={[styles.serviceCard, isDark && styles.serviceCardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.textMutedDark]}>{t('safety.motorService')}</Text>

        <View style={styles.serviceStatusRow}>
          <View style={styles.serviceStatusLeft}>
            <View style={[styles.serviceIcon, { backgroundColor: serviceExceeded ? '#FEE2E2' : '#E8F3F0' }]}>
              <Text style={styles.serviceIconText}>🔧</Text>
            </View>
            <View>
              <Text style={[styles.serviceStatusLabel, isDark && styles.textMutedDark]}>{t('safety.serviceStatus')}</Text>
              <Text style={[styles.serviceStatusValue, isDark && styles.textWhite]}>{serviceExceeded ? t('safety.serviceRequired') : t('safety.normal')}</Text>
            </View>
          </View>
          <View style={[styles.serviceBadge, { backgroundColor: serviceExceeded ? '#FEE2E2' : '#E8F3F0' }]}>
            <Text style={[styles.serviceBadgeText]}>{serviceExceeded ? `⚠️ ${t('safety.serviceRequired')}` : `✓ ${t('safety.normal')}`}</Text>
          </View>
        </View>

        {serviceExceeded && (
          <View style={[styles.alertBanner, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={[styles.alertText, isDark && styles.textWhite]}>Service required! Motor has exceeded {serviceLimitInput} {t('safety.hours')}.</Text>
          </View>
        )}

        {!serviceExceeded && (
          <View style={[styles.infoBannerSmall, isDark && styles.infoBannerSmallDark]}>
            <Text style={styles.infoIcon}>✓</Text>
            <Text style={[styles.infoTextSmall, isDark && styles.infoTextSmallDark]}>{t('safety.motorGood')} {formatRemainingTime(remaining)} {t('safety.remaining')}.</Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <Text style={[styles.statLabel, isDark && styles.textWhite]}>{t('safety.runningTime')}</Text>
            <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : (serviceExceeded ? '#EF4444' : '#1F7A63') }]}>
              {formatDuration(runningHours)}
            </Text>
          </View>
          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <Text style={[styles.statLabel, isDark && styles.textWhite]}>{t('safety.serviceLimit')}</Text>
            <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#1F7A63' }]}>
              {serviceLimitInput || "500"} <Text style={[styles.statUnit, isDark && styles.textWhite]}>{t('safety.hrs')}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, isDark && styles.textMutedDark]}>0</Text>
            <Text style={[styles.progressPercent, { color: serviceExceeded ? '#EF4444' : '#1F7A63' }]}>
              {serviceProgress.toFixed(0)}%
            </Text>
            <Text style={[styles.progressLabel, isDark && styles.textMutedDark]}>{serviceLimitInput} {t('safety.hrs')}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${serviceProgress}%`,
              backgroundColor: serviceExceeded ? '#EF4444' : '#1F7A63'
            }]} />
          </View>
        </View>

        <View style={styles.customLimitSection}>
          <Text style={[styles.customLimitLabel, isDark && styles.textWhite]}>{t('safety.customLimit')}</Text>
          <View style={styles.customLimitInputContainer}>
            <TextInput
              ref={customLimitInputRef}
              style={[styles.customLimitInput, isDark && styles.customLimitInputDark]}
              value={serviceLimitInput}
              onChangeText={(text) => {
                setServiceLimitInput(text);
                const newLimit = parseInt(text) || 500;
                setServiceExceeded(runningHours >= newLimit);
                setServiceProgress(Math.min((runningHours / newLimit) * 100, 100));
              }}
              keyboardType="numeric"
              placeholder="500"
              placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
              returnKeyType="done"
              blurOnSubmit={false}        // ✅ ye rakhna important hai
            />
            <View style={[styles.customLimitUnit, isDark && styles.customLimitUnitDark]}>
              <Text style={[styles.customLimitUnitText, isDark && styles.textMutedDark]}>{t('safety.hours')}</Text>
            </View>
          </View>
        </View>

        {showResetConfirm ? (
          <View style={styles.resetConfirmContainer}>
            <Text style={[styles.resetConfirmText, isDark && styles.textWhite]}>{t('safety.resetConfirm')}</Text>
            <Text style={[styles.resetConfirmText, isDark && styles.textWhite]}>Current: {formatDuration(runningHours)} {t('safety.willBeReset')}</Text>
            <View style={styles.resetConfirmButtons}>
              <TouchableOpacity
                onPress={() => setShowResetConfirm(false)}
                style={[styles.resetConfirmButton, styles.resetConfirmCancel]}>
                <Text style={[styles.resetConfirmButtonText, isDark && styles.textWhite]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResetService}
                style={[styles.resetConfirmButton, styles.resetConfirmOk]}>
                <Text style={[styles.resetConfirmButtonText, isDark && styles.textWhite]}>{t('safety.reset')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowResetConfirm(true)}
            style={[styles.resetButton, isDark && styles.resetButtonDark]}>
            <Text style={[styles.resetButtonText, isDark && styles.textWhite]}>{t('safety.resetCounter')}</Text>
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
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          style={isDark ? styles.containerDark : undefined}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1F7A63"]} />}
          keyboardShouldPersistTaps="handled"
        >

          <LinearGradient colors={['#1F7A63', '#2a9d82']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>{t('safety.settings')}</Text>
            </TouchableOpacity>
            <Text style={styles.mainTitle}>{t('safety.title')}</Text>
            <Text style={styles.subtitle}>{t('safety.subtitle')}</Text>
          </LinearGradient>

          <View style={[styles.content, { paddingBottom: insets.bottom + 40 }, isDark && styles.containerDark]}>
            {/* MERGED CARD - Smart Control + Slider UI for Voltage & Current */}
            <MergedCard />

            {/* Motor Service Card */}
            <MotorServiceCard />

            <TouchableOpacity style={[styles.saveButton, isDark && styles.saveButtonDark]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{t('safety.applyChanges')}</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SettingsMotorSafetyScreen;