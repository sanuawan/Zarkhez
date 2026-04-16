import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  header: { paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backIcon: { fontSize: 18, color: '#FFFFFF', marginRight: 8 },
  backText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  content: { padding: 16, gap: 16 },
  
  infoBanner: { 
    flexDirection: 'row', 
    backgroundColor: '#E8F3F0', 
    borderRadius: 16, 
    padding: 12, 
    alignItems: 'center' 
  },
  infoIcon: { fontSize: 14, marginRight: 8 },
  infoText: { flex: 1, fontSize: 12, color: '#1F7A63' },
  
  // Counter Input Styles
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#1F7A63', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#8aabb3', letterSpacing: 0.5, marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f4f3' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  counterButton: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  counterButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  counterValueContainer: { flex: 1, alignItems: 'center' },
  counterInput: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', padding: 0 },
  counterUnit: { color: '#666', fontSize: 12, marginTop: 2 },
  
  // Motor Service Card Styles
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1F7A63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8aabb3',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f3',
  },
  serviceStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconText: {
    fontSize: 16,
  },
  serviceStatusLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  serviceStatusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  serviceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  alertBanner: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
  },
  alertIcon: {
    fontSize: 14,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
  },
  infoBannerSmall: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  infoTextSmall: {
    flex: 1,
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#9ca3af',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  customLimitSection: {
    marginBottom: 16,
  },
  customLimitLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  customLimitInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  customLimitInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  customLimitUnit: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 12,
  },
  customLimitUnitText: {
    fontSize: 12,
    color: '#6b7280',
  },
  resetConfirmContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  resetConfirmText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  resetConfirmButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  resetConfirmButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetConfirmCancel: {
    backgroundColor: '#F3F4F6',
  },
  resetConfirmOk: {
    backgroundColor: '#EF4444',
  },
  resetConfirmButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F7A63',
  },
  saveButton: { 
    backgroundColor: '#1F7A63', 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 8 
  },
  savedButton: { backgroundColor: '#6ED3B5' },
  saveButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },


  modeContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  modeButton: { 
    flex: 1, padding: 15, borderRadius: 16, backgroundColor: '#f0f4f3', 
    alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' 
  },
  modeButtonActive: { backgroundColor: '#1F7A63', borderColor: '#1F7A63' },
  modeIconCircle: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 8 
  },
  modeButtonText: { fontSize: 13, fontWeight: 'bold', color: '#8aabb3' },
  modeDescriptionBanner: { 
    backgroundColor: '#E8F3F0', padding: 12, borderRadius: 12, marginTop: 10 
  },
  modeDescriptionText: { color: '#1F7A63', fontSize: 12, textAlign: 'center' },

  // SettingsMotorSafetyScreen.styles.js mein yeh add karein:

mergedRow: {
  marginBottom: 24,
},
mergedLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: '#374151',
  marginBottom: 8,
},
mergedSubLabel: {
  fontSize: 13,
  fontWeight: '700',
  color: '#374151',
  marginTop: 4,
  marginBottom: 12,
  letterSpacing: 0.5,
},
divider: {
  height: 1,
  backgroundColor: '#E5E7EB',
  marginVertical: 16,
},
sliderHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
valueBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F3F4F6',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,
  width: 80,
  borderColor: '#E5E7EB',
},
valueText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#1F2937',
  minWidth: 45,
  textAlign: 'center',
  padding: 0, 
  width: 35, 
},
unitText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#6B7280',
  marginLeft: 4,
},
rangeLabels: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 4,
},
labelSmall: {
  fontSize: 11,
  color: '#9CA3AF',
},
});


