import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  BackHandler 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getStyles } from './styles/SettingsAppearanceScreen.styles';

const SettingsAppearanceScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();
  
  // Dynamic styles fetching based on theme
  const styles = getStyles(isDark);

  // 🔥 Hardware Back Button Logic
  // Is se back dabanay par app exit nahi hogi balki settings screen par jaye gi
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Action handled
      }
      return false; // Default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1F7A63" 
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <LinearGradient 
          colors={['#1F7A63', '#2a9d82']} 
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Appearance</Text>
          <Text style={styles.subtitle}>Choose your preferred theme</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>THEME</Text>

          {/* --- Light Mode Card --- */}
          <TouchableOpacity 
            style={[
              styles.themeCard, 
              !isDark && styles.selectedCard
            ]} 
            onPress={() => { if(isDark) toggleTheme(); }}
            activeOpacity={0.7}
          >
            <View style={styles.themePreview}>
              <View style={[styles.lightPreview, { width: '100%', height: '100%' }]} />
            </View>
            <View style={styles.themeInfo}>
              <View style={styles.themeIconContainer}>
                <Text style={styles.themeIcon}>☀️</Text>
              </View>
              <View style={styles.themeTexts}>
                <Text style={styles.themeTitle}>Light Mode</Text>
                <Text style={styles.themeDescription}>Soft cream background</Text>
              </View>
              {!isDark && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* --- Dark Mode Card --- */}
          <TouchableOpacity 
            style={[
              styles.themeCard, 
              isDark && styles.selectedCard
            ]} 
            onPress={() => { if(!isDark) toggleTheme(); }}
            activeOpacity={0.7}
          >
            <View style={styles.themePreview}>
              <View style={[styles.darkPreview, { width: '100%', height: '100%' }]} />
            </View>
            <View style={styles.themeInfo}>
              <View style={styles.themeIconContainer}>
                <Text style={styles.themeIcon}>🌙</Text>
              </View>
              <View style={styles.themeTexts}>
                <Text style={styles.themeTitle}>Dark Mode</Text>
                <Text style={styles.themeDescription}>Deep forest palette</Text>
              </View>
              {isDark && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.note}>
            Theme applies to the entire Zarkhez app. Changes take effect immediately.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsAppearanceScreen;