// src/screens/SettingsMotorSafetyScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/SettingsMotorSafetyScreen.styles';

const SettingsMotorSafetyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [minVoltage, setMinVoltage] = useState(190);
  const [maxVoltage, setMaxVoltage] = useState(240);
  const [minCurrent, setMinCurrent] = useState(2);
  const [maxCurrent, setMaxCurrent] = useState(12);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Motor Safety Config</Text>
          <Text style={styles.subtitle}>Motor stops automatically if readings go out of range</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoBanner}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <Text style={styles.infoText}>If voltage or current readings fall outside these thresholds, the motor will automatically stop to prevent damage.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VOLTAGE THRESHOLDS</Text>
            <View style={styles.sliderGroup}>
              <View style={styles.sliderItem}>
                <View style={styles.sliderLabel}><Text style={styles.sliderLabelText}>Minimum Voltage</Text><Text style={styles.sliderValue}>{minVoltage} V</Text></View>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${((minVoltage - 150) / 60) * 100}%`, backgroundColor: '#FFD166' }]} />
                  <View style={[styles.sliderThumb, { left: `${((minVoltage - 150) / 60) * 100}%` }]} />
                </View>
                <View style={styles.sliderLimits}><Text style={styles.limitText}>150 V</Text><Text style={styles.limitText}>210 V</Text></View>
              </View>
              <View style={styles.sliderItem}>
                <View style={styles.sliderLabel}><Text style={styles.sliderLabelText}>Maximum Voltage</Text><Text style={styles.sliderValue}>{maxVoltage} V</Text></View>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${((maxVoltage - 220) / 40) * 100}%`, backgroundColor: '#e05353' }]} />
                  <View style={[styles.sliderThumb, { left: `${((maxVoltage - 220) / 40) * 100}%` }]} />
                </View>
                <View style={styles.sliderLimits}><Text style={styles.limitText}>220 V</Text><Text style={styles.limitText}>260 V</Text></View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CURRENT THRESHOLDS</Text>
            <View style={styles.sliderGroup}>
              <View style={styles.sliderItem}>
                <View style={styles.sliderLabel}><Text style={styles.sliderLabelText}>Minimum Current</Text><Text style={styles.sliderValue}>{minCurrent} A</Text></View>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${(minCurrent / 5) * 100}%`, backgroundColor: '#6ED3B5' }]} />
                  <View style={[styles.sliderThumb, { left: `${(minCurrent / 5) * 100}%` }]} />
                </View>
                <View style={styles.sliderLimits}><Text style={styles.limitText}>0 A</Text><Text style={styles.limitText}>5 A</Text></View>
              </View>
              <View style={styles.sliderItem}>
                <View style={styles.sliderLabel}><Text style={styles.sliderLabelText}>Maximum Current</Text><Text style={styles.sliderValue}>{maxCurrent} A</Text></View>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${((maxCurrent - 6) / 14) * 100}%`, backgroundColor: '#e05353' }]} />
                  <View style={[styles.sliderThumb, { left: `${((maxCurrent - 6) / 14) * 100}%` }]} />
                </View>
                <View style={styles.sliderLimits}><Text style={styles.limitText}>6 A</Text><Text style={styles.limitText}>20 A</Text></View>
              </View>
            </View>
          </View>

          <View style={styles.configSummary}>
            <Text style={styles.summaryTitle}>ACTIVE CONFIGURATION</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Min Voltage</Text><Text style={styles.summaryValue}>{minVoltage} V</Text></View>
              <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Max Voltage</Text><Text style={styles.summaryValue}>{maxVoltage} V</Text></View>
              <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Min Current</Text><Text style={styles.summaryValue}>{minCurrent} A</Text></View>
              <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Max Current</Text><Text style={styles.summaryValue}>{maxCurrent} A</Text></View>
            </View>
          </View>

          <TouchableOpacity style={[styles.saveButton, saved && styles.savedButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{saved ? 'Saved!' : 'Save Configuration'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsMotorSafetyScreen;