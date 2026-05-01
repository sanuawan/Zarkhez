// src/screens/styles/CropSoilScreen.styles.ts
import { StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive Helper
const scale = SCREEN_WIDTH / 375;

const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const styles = StyleSheet.create({
  // 🔴 100% EXACT HOME SCREEN WALE STYLES 🔴
  customHeader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    width: '100%',
  },
  customHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(110,211,181,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  customLogoIconText: {
    fontSize: 14,
    color: '#6ED3B5',
  },
  customLogoText: {
    fontSize: 12,
    color: '#6ED3B5',
    fontWeight: '500',
  },
  customMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'left', // 🔥 Is se start main aayega
  },
  customSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'left', // 🔥 Is se start main aayega
  },
  
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  containerDark: {
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: normalize(16),
    paddingBottom: normalize(100),
  },
  
  // Title Section
  titleContainer: {
    alignItems: 'center',
    marginBottom: normalize(24),
    marginTop: normalize(10),
  },
  titleIcon: {
    width: normalize(70),
    height: normalize(70),
    backgroundColor: '#10b981',
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleIconText: {
    fontSize: normalize(30),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'center',
  },
  titleDark: {
    color: '#d1fae5',
  },
  subtitle: {
    fontSize: normalize(14),
    color: '#047857',
    marginTop: normalize(4),
    textAlign: 'center',
  },
  subtitleDark: {
    color: '#a7f3d0',
  },
  
  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: normalize(16),
    padding: normalize(18),
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#262626',
  },
  cardTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: normalize(18),
    color: '#1f2937',
  },
  cardTitleDark: {
    color: '#f9fafb',
  },
  
  // Selection Container
  selectionContainer: {
    gap: normalize(16),
  },
  selectionItem: {
    gap: normalize(6),
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#374151',
    marginBottom: normalize(4),
    marginLeft: normalize(4), // indent text alignment
  },
  labelDark: {
    color: '#d1d5db',
  },
  
  // Dropdown Styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    backgroundColor: '#f8fafc',
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: normalize(50),
  },
  dropdownButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  dropdownButtonOpen: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  dropdownButtonText: {
    fontSize: normalize(15),
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  dropdownButtonTextDark: {
    color: '#f9fafb',
  },
  dropdownArrow: {
    fontSize: normalize(16),
    color: '#6b7280',
    marginLeft: normalize(8),
  },
  
  // Input Field Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: normalize(16),
    height: normalize(50),
  },
  inputContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  input: {
    flex: 1,
    fontSize: normalize(15),
    color: '#1f2937',
    paddingHorizontal: normalize(10),
    height: '100%',
  },
  inputDark: {
    color: '#f9fafb',
  },
  inputPrefix: {
    fontSize: normalize(16),
    marginRight: normalize(8),
    color: '#6b7280',
  },
  inputSuffix: {
    fontSize: normalize(14),
    color: '#6b7280',
    marginLeft: normalize(8),
    fontWeight: '500',
  },
  
  // Generate Button
  generateButton: {
    backgroundColor: '#10b981',
    borderRadius: normalize(12),
    paddingVertical: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.7,
  },
  generateButtonIcon: {
    fontSize: normalize(20),
    marginRight: normalize(10),
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  
  // Dropdown Modal
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#ffffff',
    borderRadius: normalize(16),
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownModalDark: {
    backgroundColor: '#262626',
  },
  dropdownList: {
    borderRadius: normalize(16),
  },
  dropdownItem: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemDark: {
    borderBottomColor: '#374151',
  },
  dropdownItemSelected: {
    backgroundColor: '#d1fae5',
  },
  dropdownItemSelectedDark: {
    backgroundColor: '#065f46',
  },
  dropdownItemText: {
    fontSize: normalize(15),
    color: '#374151',
  },
  dropdownItemTextDark: {
    color: '#f9fafb',
  },
  dropdownItemTextSelected: {
    color: '#065f46',
    fontWeight: '600',
  },
  
  // Moisture Section
  moistureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  moistureIcon: {
    width: normalize(55),
    height: normalize(55),
    backgroundColor: '#3b82f6',
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  moistureIconText: {
    fontSize: normalize(22),
    color: '#ffffff',
  },
  moistureTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: normalize(6),
  },
  moistureTitleDark: {
    color: '#f9fafb',
  },
  statusBadge: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(12),
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: normalize(12),
    fontWeight: '600',
  },
  moistureContainer: {
    gap: normalize(12),
  },
  moistureInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moistureLabel: {
    fontSize: normalize(15),
    color: '#6b7280',
  },
  moistureLabelDark: {
    color: '#9ca3af',
  },
  moistureValue: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  moistureValueDark: {
    color: '#60a5fa',
  },
  progressBar: {
    height: normalize(16),
    backgroundColor: '#e5e7eb',
    borderRadius: normalize(8),
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#374151',
  },
  progressFill: {
    height: '100%',
    borderRadius: normalize(8),
  },
  
  // AI Recommendation Section
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  aiIcon: {
    width: normalize(55),
    height: normalize(55),
    backgroundColor: '#10b981',
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  aiIconText: {
    fontSize: normalize(22),
    color: '#ffffff',
  },
  aiTitle: {
    fontSize: normalize(19),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: normalize(4),
  },
  aiTitleDark: {
    color: '#f9fafb',
  },
  aiDescription: {
    fontSize: normalize(13),
    color: '#6b7280',
    flexShrink: 1, // For text wrap
  },
  aiDescriptionDark: {
    color: '#9ca3af',
  },
  recommendationBox: {
    padding: normalize(16),
    borderRadius: normalize(16),
    marginBottom: normalize(16),
    minHeight: normalize(70),
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10b981',
  },

  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
    marginVertical: normalize(4),
  },
  recommendationIcon: {
    fontSize: normalize(20),
    marginRight: normalize(12),
    flexShrink: 0,
  },
  recommendationText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: normalize(22),
    textAlign: 'left', 
    paddingRight: normalize(8),
  },
  
  // Water Requirement Details
  waterContainer: {
    gap: normalize(20),
  },
  detailsGrid: {
    gap: normalize(12),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(14),
    backgroundColor: '#f8fafc',
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailItemDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  detailIcon: {
    fontSize: normalize(22),
    marginRight: normalize(16),
    width: normalize(30),
    textAlign: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: normalize(13),
    color: '#6b7280',
    marginBottom: normalize(2),
  },
  detailLabelDark: {
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#1f2937',
  },
  detailValueDark: {
    color: '#f9fafb',
  },
  
  // Weather Grid
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  weatherTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weatherTitleDark: {
    color: '#f9fafb',
  },
  lastUpdated: {
    fontSize: normalize(11),
    color: '#6b7280',
    marginTop: normalize(2),
  },
  lastUpdatedDark: {
    color: '#9ca3af',
  },
  refreshIcon: {
    fontSize: normalize(20),
    color: '#3b82f6',
    padding: normalize(4), // Touch area increase
  },
  refreshIconDark: {
    color: '#60a5fa',
  },
  
  // Current Weather Styles
  currentWeatherContainer: {
    marginBottom: normalize(24),
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  weatherIconLarge: {
    fontSize: normalize(44),
    marginRight: normalize(16),
  },
  tempLarge: {
    fontSize: normalize(34),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tempLargeDark: {
    color: '#f9fafb',
  },
  conditionText: {
    fontSize: normalize(16),
    color: '#6b7280',
    marginTop: normalize(4),
  },
  conditionTextDark: {
    color: '#9ca3af',
  },
  
  // Weather Details Styles
  weatherDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: normalize(12),
    padding: normalize(16),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  weatherDetailsDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailRowDark: {
    borderBottomColor: '#4b5563',
  },
  
  // Forecast Styles
  forecastContainer: {
    marginTop: normalize(16),
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: normalize(12),
    padding: normalize(14),
    marginRight: normalize(12),
    width: normalize(90),
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  forecastItemDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e40af',
  },
  forecastDay: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: '#374151',
    marginBottom: normalize(8),
    textAlign: 'center',
  },
  forecastDayDark: {
    color: '#f9fafb',
  },
  forecastIcon: {
    fontSize: normalize(22),
    marginBottom: normalize(8),
  },
  forecastTemp: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: normalize(4),
  },
  forecastTempDark: {
    color: '#f9fafb',
  },
  
  // Loading Styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(40),
  },
  loadingText: {
    marginTop: normalize(12),
    fontSize: normalize(14),
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingTextDark: {
    color: '#9ca3af',
  },
});