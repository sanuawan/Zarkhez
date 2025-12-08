// src/screens/styles/AlertsScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  containerDark: {
    backgroundColor: '#1c1917',
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
    backgroundColor: '#ef4444',
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
    color: '#dc2626',
    marginBottom: 8,
  },
  titleDark: {
    color: '#fca5a5',
  },
  activeAlertsBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeAlertsText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIconText: {
    fontSize: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  statusLabelDark: {
    color: '#e5e7eb',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusValueDark: {
    color: '#f9fafb',
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
  alertsList: {
    marginTop: 8,
  },
  alertItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  alertTitleDark: {
    color: '#f1f5f9',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  alertTimeDark: {
    color: '#9ca3af',
  },
  alertDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    marginLeft: 36,
  },
  alertDescriptionDark: {
    color: '#cbd5e1',
  },
  alertActions: {
    flexDirection: 'row',
    marginLeft: 36,
  },
  actionButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  actionButtonTextDark: {
    color: '#9ca3af',
  },
  emergencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emergencyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  emergencyControls: {
    marginTop: 8,
  },
  emergencyStopButton: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyStopText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceButton: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  serviceButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});