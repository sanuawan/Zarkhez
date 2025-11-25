// src/screens/HomeScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerDark: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  titleDark: {
    color: '#22c55e',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#9ca3af',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  headerButtonTextDark: {
    color: '#f3f4f6',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonDark: {
    backgroundColor: '#7f1d1d',
    borderColor: '#991b1b',
  },
  logoutButtonText: {
    fontSize: 16,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardDark: {
    backgroundColor: '#262626',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  cardTitleDark: {
    color: '#f9fafb',
  },
  
  // Mode Toggle
  modeToggleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 25,
    padding: 4,
  },
  modeToggleDark: {
    backgroundColor: '#374151',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    color: '#6b7280',
  },
  modeTextDark: {
    color: '#9ca3af',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  
  // Power Button
  powerContainer: {
    alignItems: 'center',
  },
  powerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    marginBottom: 16,
  },
  powerButtonOn: {
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
  },
  powerButtonDark: {
    shadowColor: '#000',
  },
  powerButtonDisabled: {
    opacity: 0.6,
  },
  powerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerIcon: {
    fontSize: 40,
  },
  powerStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  powerStatusDark: {
    color: '#9ca3af',
  },
  powerStatusOn: {
    color: '#10b981',
  },
  autoModeIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  autoModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  autoModeDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  autoModeDescriptionDark: {
    color: '#9ca3af',
  },
  
  // Status Cards
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusCardDark: {
    backgroundColor: '#262626',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  statusLabelDark: {
    color: '#9ca3af',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusValueDark: {
    color: '#f9fafb',
  },
  
  // Weather Card
  weatherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherCardDark: {
    backgroundColor: '#262626',
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherIcon: {
    fontSize: 32,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  weatherTitleDark: {
    color: '#f9fafb',
  },
  weatherSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  weatherSubtitleDark: {
    color: '#9ca3af',
  },
  weatherInfo: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  temperatureDark: {
    color: '#f9fafb',
  },
  humidityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  humidityIcon: {
    fontSize: 12,
  },
  humidity: {
    fontSize: 12,
    color: '#3b82f6',
  },
  humidityDark: {
    color: '#60a5fa',
  },
  
  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 56) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonDark: {
    backgroundColor: '#262626',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  actionLabelDark: {
    color: '#f3f4f6',
  },
});