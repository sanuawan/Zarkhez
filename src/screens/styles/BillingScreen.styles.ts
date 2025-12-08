// src/screens/styles/BillingScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#10b981',
    borderRadius: 40,
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
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  titleDark: {
    color: '#f8fafc',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  currentBillHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentBillTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  currentBillTitleDark: {
    color: '#e2e8f0',
  },
  currentBillAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  currentBillAmountDark: {
    color: '#a78bfa',
  },
  usageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageItem: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  usageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  usageIcon: {
    fontSize: 20,
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  },
  usageLabelDark: {
    color: '#cbd5e1',
  },
  usageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  usageValueDark: {
    color: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitleDark: {
    color: '#e2e8f0',
  },
  usageSection: {
    marginBottom: 24,
  },
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageSectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  usageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  usageSectionTitleDark: {
    color: '#cbd5e1',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 4,
  },
  barLabelDark: {
    color: '#94a3b8',
  },
  lineChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingHorizontal: 8,
    position: 'relative',
  },
  linePointContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  linePoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    zIndex: 2,
  },
  lineLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 20,
  },
  lineLabelDark: {
    color: '#94a3b8',
  },
  line: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#d1d5db',
    zIndex: 1,
  },
  lineDark: {
    backgroundColor: '#475569',
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyItemDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  currentBillItem: {
    backgroundColor: '#faf5ff',
    borderColor: '#ddd6fe',
  },
  currentBillItemDark: {
    backgroundColor: '#4c1d95',
    borderColor: '#7c3aed',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyMonthDark: {
    color: '#f1f5f9',
  },
  waterUsage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  waterAmount: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  waterAmountDark: {
    color: '#60a5fa',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  historyAmountDark: {
    color: '#f1f5f9',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});