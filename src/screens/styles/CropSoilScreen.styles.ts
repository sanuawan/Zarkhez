// src/screens/styles/CropSoilScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    padding: 16,
    paddingBottom: 100,
  },
  
  // Title Section
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  titleIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#10b981',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleIconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'center',
  },
  titleDark: {
    color: '#d1fae5',
  },
  subtitle: {
    fontSize: 14,
    color: '#047857',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitleDark: {
    color: '#a7f3d0',
  },
  
  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardDark: {
    backgroundColor: '#262626',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  cardTitleDark: {
    color: '#f9fafb',
  },
  
  // Selection Container
  selectionContainer: {
    gap: 16,
  },
  selectionItem: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  labelDark: {
    color: '#d1d5db',
  },
  
  // Dropdown Styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 48,
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
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  dropdownButtonTextDark: {
    color: '#f9fafb',
  },
  dropdownArrow: {
    fontSize: 18,
    color: '#6b7280',
    marginLeft: 8,
  },
  
  // Input Field Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 48,
  },
  inputContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    paddingHorizontal: 12,
    height: '100%',
  },
  inputDark: {
    color: '#f9fafb',
  },
  inputPrefix: {
    fontSize: 16,
    marginRight: 8,
    color: '#6b7280',
  },
  inputSuffix: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  
  // Generate Button
  generateButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 12,
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
    fontSize: 20,
    marginRight: 10,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
    borderRadius: 16,
    width: width * 0.85,
    maxHeight: height * 0.6,
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
    borderRadius: 16,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    fontSize: 15,
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
    marginBottom: 20,
  },
  moistureIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  moistureIconText: {
    fontSize: 24,
    color: '#ffffff',
  },
  moistureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  moistureTitleDark: {
    color: '#f9fafb',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moistureContainer: {
    gap: 12,
  },
  moistureInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moistureLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  moistureLabelDark: {
    color: '#9ca3af',
  },
  moistureValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  moistureValueDark: {
    color: '#60a5fa',
  },
  progressBar: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#374151',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressLabelDark: {
    color: '#9ca3af',
  },
  
  // AI Recommendation Section
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#10b981',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aiIconText: {
    fontSize: 24,
    color: '#ffffff',
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  aiTitleDark: {
    color: '#f9fafb',
  },
  aiDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  aiDescriptionDark: {
    color: '#9ca3af',
  },
  recommendationBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    minHeight: 70,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
    flexShrink: 0,
  },
  recommendationText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  
  // Water Requirement Details
  waterContainer: {
    gap: 20,
  },
  waterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  waterLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  waterLabelDark: {
    color: '#d1d5db',
  },
  waterValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  waterValueDark: {
    color: '#60a5fa',
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailItemDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailLabelDark: {
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  detailValueDark: {
    color: '#f9fafb',
  },
  
  // Weather Grid
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  weatherItem: {
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  weatherItemDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e40af',
  },
  weatherIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  weatherValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  weatherValueDark: {
    color: '#f9fafb',
  },
  weatherLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  weatherLabelDark: {
    color: '#93c5fd',
  },


  // Weather Header Styles
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weatherTitleDark: {
    color: '#f9fafb',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  lastUpdatedDark: {
    color: '#9ca3af',
  },
  refreshIcon: {
    fontSize: 20,
    color: '#3b82f6',
  },
  refreshIconDark: {
    color: '#60a5fa',
  },
  
  // Current Weather Styles
  currentWeatherContainer: {
    marginBottom: 24,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIconLarge: {
    fontSize: 48,
    marginRight: 16,
  },
  tempLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tempLargeDark: {
    color: '#f9fafb',
  },
  conditionText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  conditionTextDark: {
    color: '#9ca3af',
  },
  
  // Weather Details Styles
  weatherDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailRowDark: {
    borderBottomColor: '#4b5563',
  },
  
  // Forecast Styles
  forecastContainer: {
    marginTop: 24,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  forecastTitleDark: {
    color: '#f9fafb',
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 100,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  forecastItemDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e40af',
  },
  forecastDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  forecastDayDark: {
    color: '#f9fafb',
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  forecastTempDark: {
    color: '#f9fafb',
  },
  forecastRain: {
    fontSize: 12,
    color: '#3b82f6',
  },
  forecastRainDark: {
    color: '#60a5fa',
  },
  
  // Loading Styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingTextDark: {
    color: '#9ca3af',
  },
});



