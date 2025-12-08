// src/screens/styles/ScheduleScreen.styles.ts
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

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
    paddingBottom: 20,
  },

  // Title Styles
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleIcon: {
    width: 70,
    height: 70,
    backgroundColor: '#10b981',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  titleIconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  titleDark: {
    color: '#f9fafb',
  },

  // Time Banner Card
  timeBannerCard: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timeBannerCardDark: {
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
  },
  timeBannerGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  timeBannerTitle: {
    fontSize: 16,
    color: '#dbeafe',
    marginBottom: 12,
    fontWeight: '600',
  },
  timeBannerTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timeBannerItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  timeBannerLabel: {
    fontSize: 14,
    color: '#dbeafe',
    marginBottom: 4,
  },
  timeBannerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  timeBannerSeparator: {
    fontSize: 20,
    color: '#ffffff',
    marginHorizontal: 16,
    fontWeight: 'bold',
  },
  timeBannerDuration: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },

  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardDark: {
    backgroundColor: '#262626',
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  sectionTitleDark: {
    color: '#f9fafb',
  },

  // Schedule Type Container
  scheduleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleTypeButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  scheduleTypeButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  scheduleTypeButtonActiveDark: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  scheduleTypeButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  scheduleTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  scheduleTypeButtonTextDark: {
    color: '#f9fafb',
  },
  scheduleTypeButtonTextActive: {
    color: '#ffffff',
  },

  // Calendar Card
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  calendarCardDark: {
    backgroundColor: '#262626',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    fontSize: 22,
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontWeight: 'bold',
  },
  calendarNavButtonDark: {
    color: '#f9fafb',
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  calendarMonthDark: {
    color: '#f9fafb',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: (width - 80) / 7,
    textAlign: 'center',
  },
  dayOfWeekDark: {
    color: '#9ca3af',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: (width - 80) / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonSelected: {
    backgroundColor: '#10b981',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dateTextDark: {
    color: '#f9fafb',
  },
  dateTextSelected: {
    color: '#ffffff',
  },
  sundayText: {
    color: '#ef4444',
  },
  pastDate: {
    color: '#9ca3af',
    opacity: 0.5,
  },
  dateSelectedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  emptyCell: {
    width: 36,
    height: 36,
  },
  selectedDatesCount: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedDatesCountDark: {
    color: '#9ca3af',
  },

  // Save Button
  saveButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDark: {
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  saveButtonIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#ffffff',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Time Picker
  timePicker: {
    backgroundColor: '#ffffff',
  },
});