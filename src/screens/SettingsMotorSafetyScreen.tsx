import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { styles } from './styles/SettingsMotorSafetyScreen.styles';

const SettingsMotorSafetyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [minV, setMinV] = useState(190.0);
  const [maxV, setMaxV] = useState(240.0);
  const [maxA, setMaxA] = useState(12.0);

  useEffect(() => {
    const fetchSafety = async () => {
      const doc = await firestore().collection('settings').doc('safety_config').get();
      if (doc.exists) {
        const d = doc.data();
        setMinV(d?.minV || 190.0);
        setMaxV(d?.maxV || 240.0);
        setMaxA(d?.maxA || 12.0);
      }
      setLoading(false);
    };
    fetchSafety();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await firestore().collection('settings').doc('safety_config').set({
        minV, maxV, maxA,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", "Safety limits updated!");
    } catch (e) {
      Alert.alert("Error", "Could not save settings.");
    }
    setSaving(false);
  };

  // Reusable Component for Plus/Minus/Type
  const CounterInput = ({ label, value, onChange, step, unit }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, borderRadius: 12 }}>
        <TouchableOpacity 
          onPress={() => onChange(parseFloat((value - step).toFixed(2)))}
          style={{ backgroundColor: '#e05353', width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>−</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextInput
            style={{ fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' }}
            value={value.toString()}
            keyboardType="numeric"
            onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
          />
          <Text style={{ color: '#666', fontSize: 12 }}>{unit}</Text>
        </View>

        <TouchableOpacity 
          onPress={() => onChange(parseFloat((value + step).toFixed(2)))}
          style={{ backgroundColor: '#1F7A63', width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator color="#1F7A63" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Safety Guard</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>🛡️ Motor will auto-cut if thresholds are exceeded.</Text>
          </View>

          <CounterInput label="MIN VOLTAGE" value={minV} onChange={setMinV} step={0.5} unit="Volts (AC/DC)" />
          <CounterInput label="MAX VOLTAGE" value={maxV} onChange={setMaxV} step={0.5} unit="Volts (AC/DC)" />
          <CounterInput label="MAX CURRENT" value={maxA} onChange={setMaxA} step={0.1} unit="Amperes (A)" />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Apply Changes</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsMotorSafetyScreen;