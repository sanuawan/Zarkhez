import React, { useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  SafeAreaView, StatusBar, BackHandler 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext'; 
import { getStyles } from './styles/SettingsLanguageScreen.styles';

const SettingsLanguageScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const styles = getStyles(isDark);

  // --- WORKING LOGIC ---
  const handleBack = () => {
    // Alerts is the name from your App.tsx
    navigation.navigate('Alerts' as never);
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [language]); // This dependency is the magic!

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A63" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Full Header Design */}
        <LinearGradient 
          colors={['#1F7A63', '#2a9d82']} 
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>{t('nav.settings')}</Text>
          </TouchableOpacity>
          
          <Text style={styles.mainTitle}>{language === 'en' ? 'Language' : 'زبان'}</Text>
          <Text style={styles.subtitle}>
            {language === 'en' ? 'Choose your preferred language' : 'اپنی پسندیدہ زبان منتخب کریں'}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>
            {language === 'en' ? 'SELECT LANGUAGE' : 'زبان منتخب کریں'}
          </Text>

          {/* English Option */}
          <TouchableOpacity 
            style={[styles.langCard, language === 'en' && styles.selectedCard]} 
            onPress={() => setLanguage('en')}
            activeOpacity={0.7}
          >
            <View style={styles.langIconContainer}><Text style={styles.langIcon}>🇺🇸</Text></View>
            <View style={styles.langTexts}>
              <Text style={styles.langTitle}>English</Text>
              <Text style={styles.langSubtitle}>Default Language</Text>
            </View>
            {language === 'en' && (
              <View style={styles.checkmark}><Text style={styles.checkmarkIcon}>✓</Text></View>
            )}
          </TouchableOpacity>

          {/* Urdu Option */}
          <TouchableOpacity 
            style={[styles.langCard, language === 'ur' && styles.selectedCard]} 
            onPress={() => setLanguage('ur')}
            activeOpacity={0.7}
          >
            <View style={styles.langIconContainer}><Text style={styles.langIcon}>🇵🇰</Text></View>
            <View style={styles.langTexts}>
              <Text style={styles.langTitle}>اردو</Text>
              <Text style={styles.langSubtitle}>قومی زبان</Text>
            </View>
            {language === 'ur' && (
              <View style={styles.checkmark}><Text style={styles.checkmarkIcon}>✓</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsLanguageScreen;