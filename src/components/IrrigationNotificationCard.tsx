// src/components/IrrigationNotificationCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { IrrigationDecision } from '../services/irrigationLogic';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

interface Props {
  decision: IrrigationDecision;
}

const IrrigationNotificationCard: React.FC<Props> = ({ decision }) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  
  const getIcon = () => {
    if (decision.shouldIrrigate) {
      return decision.priority === 'high' ? '🚨💧' : '💧';
    }
    return '✅';
  };
  
  const getTitle = () => {
    if (language === 'ur') {
      return decision.shouldIrrigate ? 'آج آبپاشی کریں' : 'آج آبپاشی نہ کریں';
    }
    return decision.shouldIrrigate ? 'Irrigate Today' : 'Skip Irrigation Today';
  };
  
  const getCardStyle = () => {
    if (decision.shouldIrrigate) {
      return decision.priority === 'high' ? styles.highUrgencyCard : styles.irrigateCard;
    }
    return styles.skipCard;
  };
  
  const getCardDarkStyle = () => {
    if (decision.shouldIrrigate) {
      return decision.priority === 'high' ? styles.highUrgencyCardDark : styles.irrigateCardDark;
    }
    return styles.skipCardDark;
  };
  
  // Display based on language - English by default, Urdu when selected
  const displayReason = language === 'ur' ? decision.reason : decision.reasonEnglish;
  const displaySoilStatus = language === 'ur' ? decision.soilStatus : decision.soilStatusEnglish;
  const displayWeatherStatus = language === 'ur' ? decision.weatherStatus : decision.weatherStatusEnglish;
  
  return (
    <View style={[
      styles.container, 
      getCardStyle(),
      isDark && getCardDarkStyle()
    ]}>
      <View style={styles.content}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{getTitle()}</Text>
          <Text style={[styles.reason, isDark && styles.reasonDark]}>{displayReason}</Text>
          
          {/* Soil + Weather Status Summary */}
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{displaySoilStatus}</Text>
            </View>
            <Text style={styles.statusSeparator}>•</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{displayWeatherStatus}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(16),
    borderWidth: 1,
  },
  irrigateCard: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  highUrgencyCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  skipCard: {
    backgroundColor: '#e0f2fe',
    borderColor: '#3b82f6',
  },
  irrigateCardDark: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  highUrgencyCardDark: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444',
  },
  skipCardDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#3b82f6',
  },
  content: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: normalize(32),
    marginRight: normalize(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(6),
    color: '#1f2937',
  },
  titleDark: {
    color: '#f9fafb',
  },
  reason: {
    fontSize: normalize(13),
    color: '#374151',
    lineHeight: normalize(18),
    marginBottom: normalize(8),
  },
  reasonDark: {
    color: '#d1d5db',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
  },
  statusBadgeText: {
    fontSize: normalize(11),
    color: '#6b7280',
  },
  statusSeparator: {
    marginHorizontal: normalize(6),
    color: '#9ca3af',
    fontSize: normalize(10),
  },
});

export default IrrigationNotificationCard;