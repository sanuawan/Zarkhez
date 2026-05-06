import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ScheduleScreen Header Styles (100% Settings/Home Jaisa)
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(110,211,181,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoIconText: {
    fontSize: 14,
    color: '#6ED3B5',
  },
  logoText: {
    fontSize: 12,
    color: '#6ED3B5',
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
  },

  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  titleWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  centeredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  centeredTitleDark: {
    color: '#f3f4f6',
  },

  editingIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  editingIndicatorDark: {
    backgroundColor: '#1e293b',
    borderColor: '#86efac',
  },
  editingIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  editingIndicatorTextDark: {
    color: '#86efac',
  },
  editingCancel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#86efac',
  },
  editingCancelDark: {
    color: '#6ee7b7',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  inputDark: {
    borderColor: '#4b5563',
    color: '#f3f4f6',
    backgroundColor: '#374151',
  },

  builderCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  builderCardDark: {
    backgroundColor: '#1f2937',
  },
  builderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F7A63',
    marginBottom: 14,
  },
  builderTitleDark: {
    color: '#6ee7b7',
  },
  builderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  builderLabelDark: {
    color: '#cbd5e1',
  },
  builderInput: {
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderColor: '#eef2f7',
  },

  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#eef7f3',
    borderRadius: 999,
    padding: 4,
    gap: 6,
  },
  segmentedContainerDark: {
    backgroundColor: '#0b1f1a',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  segmentedButtonActive: {
    backgroundColor: '#1F7A63',
  },
  segmentedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },
  segmentedTextDark: {
    color: '#cbd5e1',
  },
  segmentedTextActive: {
    color: '#ffffff',
  },

  timeBannerCardInBuilder: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },

  calendarCardInBuilder: {
    backgroundColor: '#ffffff',
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  calendarCardInBuilderDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },

  timeBannerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeBannerCardDark: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  timeBannerGradient: {
    padding: 20,
  },
  timeBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeBannerTitle: {
    fontSize: 14,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  timeBannerTitleDark: {
    color: '#e5e7eb',
  },
  timeRefreshButton: {
    padding: 4,
  },
  timeRefreshIcon: {
    fontSize: 20,
    color: '#4b5563',
  },
  timeRefreshIconDark: {
    color: '#d1d5db',
  },
  timeBannerTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBannerItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeBannerLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  timeBannerLabelDark: {
    color: '#9ca3af',
  },
  timeBannerValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  timeBannerValueDark: {
    color: '#f3f4f6',
  },
  timeBannerSeparator: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: '300',
    paddingHorizontal: 16,
  },
  timeBannerSeparatorDark: {
    color: '#9ca3af',
  },
  timeBannerDuration: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 12,
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    fontWeight: '500',
  },
  timeBannerDurationDark: {
    color: '#d1d5db',
    backgroundColor: '#374151',
  },

  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  filterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#9ca3af',
  },

  scheduleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scheduleTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
  },
  scheduleTypeButtonActive: {
    backgroundColor: '#86efac',
  },
  scheduleTypeButtonActiveDark: {
    backgroundColor: '#047857',
  },
  scheduleTypeButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  scheduleTypeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  scheduleTypeButtonTextDark: {
    color: '#9ca3af',
  },
  scheduleTypeButtonTextActive: {
    color: '#ffffff',
  },

  daysSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dayChipSelected: {
    backgroundColor: '#bfdbfe',
    borderColor: '#3b82f6',
  },
  dayChipSelectedDark: {
    backgroundColor: '#1e3a8a',
    borderColor: '#60a5fa',
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  dayChipTextSelected: {
    color: '#1e3a8a',
  },
  dayChipTextDark: {
    color: '#f3f4f6',
  },

  calendarCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  calendarCardDark: {
    backgroundColor: '#1f2937',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#86efac',
    padding: 8,
  },
  calendarNavButtonDark: {
    color: '#6ee7b7',
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  calendarMonthDark: {
    color: '#f3f4f6',
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    paddingVertical: 8,
  },
  dayOfWeekDark: {
    color: '#9ca3af',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dateButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  dateButtonSelected: {
    backgroundColor: '#86efac',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  dateTextDark: {
    color: '#f3f4f6',
  },
  dateTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sundayText: {
    color: '#ef4444',
  },
  pastDate: {
    opacity: 0.3,
  },
  emptyCell: {
    flex: 1,
  },
  dateSelectedIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  selectedDatesCount: {
    marginTop: 12,
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
  selectedDatesCountDark: {
    color: '#9ca3af',
  },

  saveButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  saveButtonDark: {
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  saveButtonIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#ffffff',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  filterLabelDark: {
    color: '#9ca3af',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  filterButtonDark: {
    backgroundColor: '#374151',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#064e3b',
    fontWeight: '500',
  },
  filterButtonTextDark: {
    color: '#d1fae5',
  },
  filterArrow: {
    fontSize: 12,
    color: '#064e3b',
  },
  filterArrowDark: {
    color: '#d1fae5',
  },

  savedSection: {
    paddingHorizontal: 16,
  },
  savedSectionDark: {
    // add dark mode style if needed
  },
  savedList: {
    gap: 12,
  },

  savedScheduleCard: {
    borderRadius: 18,
    overflow: 'visible',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  savedScheduleCardDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  savedScheduleGradient: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },
  savedScheduleGradientDark: {
    backgroundColor: '#111827',
  },
  topBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  topBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  savedScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  savedScheduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  savedScheduleAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e5f4ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedScheduleAvatarText: {
    color: '#2c7a67',
    fontWeight: '700',
    fontSize: 14,
  },
  savedScheduleType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedScheduleTypeIcon: {
    fontSize: 13,
  },
  savedScheduleTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7da3b4',
  },
  savedScheduleTypeTextDark: {
    color: '#d1d5db',
  },
  savedScheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  savedScheduleStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  savedScheduleAssignedTo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  savedScheduleAssignedToDark: {
    color: '#f3f4f6',
  },

  weeklyDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  weeklyDayChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  weeklyDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },

  savedScheduleDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  savedScheduleDateLabel: {
    fontSize: 13,
    color: '#7da3b4',
  },
  savedScheduleDateLabelDark: {
    color: '#9ca3af',
  },
  savedScheduleDateValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  savedScheduleDateValueDark: {
    color: '#f3f4f6',
    backgroundColor: '#374151',
  },

  savedScheduleTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedScheduleTimeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  savedScheduleTimeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  savedScheduleTimeLabelDark: {
    color: '#9ca3af',
  },
  savedScheduleTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  savedScheduleTimeValueDark: {
    color: '#f3f4f6',
  },
  savedScheduleTimeSeparator: {
    fontSize: 14,
    color: '#9ca3af',
    paddingHorizontal: 12,
  },
  savedScheduleTimeSeparatorDark: {
    color: '#6b7280',
  },

  cancelReason: {
    fontSize: 12,
    color: '#b91c1c',
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  cancelReasonDark: {
    color: '#fca5a5',
    backgroundColor: '#451a1a',
  },

  savedScheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 2,
    paddingTop: 0,
  },
  savedScheduleDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  savedScheduleDateDark: {
    color: '#6b7280',
  },
  savedScheduleActions: {
    flexDirection: 'row',
    gap: 10,
  },
  savedScheduleEditBtn: {
    backgroundColor: '#e7f3ee',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  savedScheduleEditBtnDark: {
    backgroundColor: '#047857',
  },
  savedScheduleEditBtnText: {
    color: '#2c7a67',
    fontSize: 14,
    fontWeight: '600',
  },
  savedScheduleDeleteBtn: {
    backgroundColor: '#fdecec',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  savedScheduleDeleteBtnDark: {
    backgroundColor: '#dc2626',
  },
  savedScheduleDeleteBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },

  savedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  savedHeaderTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2f3a39',
  },
  savedHeaderTitleDark: {
    color: '#f3f4f6',
  },
  savedHeaderCount: {
    color: '#8ba8b5',
    fontSize: 14,
    fontWeight: '500',
  },
  savedHeaderCountDark: {
    color: '#9ca3af',
  },
  filterPillsRow: {
    gap: 10,
    paddingBottom: 2,
  },
  filterPillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterPillButtonActive: {
    backgroundColor: '#1f7a63',
    borderColor: '#1f7a63',
  },
  filterPillButtonDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  filterPillButtonActiveDark: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7b9aa8',
  },
  filterPillTextDark: {
    color: '#cbd5e1',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainerDark: {
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  loadingTextDark: {
    color: '#9ca3af',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
  },
  emptyContainerDark: {
    backgroundColor: '#1f2937',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyIconDark: {
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  emptyTitleDark: {
    color: '#9ca3af',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: width * 0.7,
  },
  emptySubtitleDark: {
    color: '#8b9bb5',
  },

  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    marginTop: 16,
  },
  errorContainerDark: {
    backgroundColor: '#451a1a',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorIconDark: {
    opacity: 0.8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b91c1c',
    marginBottom: 8,
  },
  errorTitleDark: {
    color: '#fca5a5',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#7f1d1d',
    textAlign: 'center',
    maxWidth: width * 0.7,
  },
  errorSubtitleDark: {
    color: '#fecaca',
  },
});