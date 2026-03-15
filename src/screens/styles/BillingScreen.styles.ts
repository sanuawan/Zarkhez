// src/screens/styles/BillingScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  header: {
    paddingHorizontal: 20,
    // paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // keep as is, but ensure top padding is correct
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
  analyticsButton: {
    backgroundColor: '#FFD166',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  analyticsButtonText: {
    fontSize: 12,
    color: '#1F7A63',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F7A63',
  },
  sectionDate: {
    fontSize: 12,
    color: '#8aabb3',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8F3F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1F7A63',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  userRowContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#1F7A63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F3F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F7A63',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a2e28',
  },
  userHours: {
    flex: 1,
    fontSize: 14,
    color: '#4a6b64',
  },
  userRate: {
    flex: 1,
    fontSize: 14,
    color: '#4a6b64',
  },
  userBill: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F7A63',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F7F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F7A63',
  },
  scrollContent: {
    paddingBottom: 80, // height of BottomNavBar
  },
  chevron: {
    fontSize: 14,
    color: '#1F7A63',
  },
});