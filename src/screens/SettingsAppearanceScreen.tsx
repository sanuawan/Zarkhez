// src/screens/SettingsAppearanceScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/SettingsAppearanceScreen.styles';

const SettingsAppearanceScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1F7A63', '#2a9d82']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Appearance</Text>
          <Text style={styles.subtitle}>Choose your preferred theme</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>THEME</Text>

          <TouchableOpacity style={[styles.themeCard, selectedTheme === 'light' && styles.selectedCard]} onPress={() => setSelectedTheme('light')}>
            <View style={styles.themePreview}><View style={styles.lightPreview} /></View>
            <View style={styles.themeInfo}>
              <View style={styles.themeIconContainer}><Text style={styles.themeIcon}>☀️</Text></View>
              <View style={styles.themeTexts}>
                <Text style={styles.themeTitle}>Light Mode</Text>
                <Text style={styles.themeDescription}>Soft cream background</Text>
              </View>
              {selectedTheme === 'light' && <View style={styles.checkmark}><Text style={styles.checkmarkIcon}>✓</Text></View>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.themeCard, selectedTheme === 'dark' && styles.selectedCard]} onPress={() => setSelectedTheme('dark')}>
            <View style={styles.themePreview}><View style={styles.darkPreview} /></View>
            <View style={styles.themeInfo}>
              <View style={styles.themeIconContainer}><Text style={styles.themeIcon}>🌙</Text></View>
              <View style={styles.themeTexts}>
                <Text style={styles.themeTitle}>Dark Mode</Text>
                <Text style={styles.themeDescription}>Deep forest palette</Text>
              </View>
              {selectedTheme === 'dark' && <View style={styles.checkmark}><Text style={styles.checkmarkIcon}>✓</Text></View>}
            </View>
          </TouchableOpacity>

          <Text style={styles.note}>Theme applies to the entire Zarkhez app. Changes take effect immediately.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsAppearanceScreen;