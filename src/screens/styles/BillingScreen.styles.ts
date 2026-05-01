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
    marginBottom: 12,
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

  // 🔥 DARK MODE & NEW UI STYLES 🔥
  containerDark: {
    backgroundColor: '#0a0a0a',
  },
  cardDark: {
    backgroundColor: '#1c2220',
    borderWidth: 1,
    borderColor: '#2a3b36',
  },
  textDark: {
    color: '#f9fafb',
  },
  textMutedDark: {
    color: '#9ca3af',
  },

  // Rate Card
  rateCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rateCardDark: {
    backgroundColor: '#1c2220', // 🔥 Zarkhez premium charcoal (UserDetail jaisa)
    borderWidth: 1,
    borderColor: '#2a3b36',     // Halka border
    elevation: 4,
    shadowColor: '#000',
  },
  rateInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F7A63',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#1F7A63',
  },
  rateInputDark: {
    color: '#6ED3B5',
    borderBottomColor: '#6ED3B5',
  },
  rateValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F7A63',
  },
  rateValueDark: {
    color: '#6ED3B5',
  },
  rateButton: {
    backgroundColor: '#1F7A63',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#EDF2F1',
    borderRadius: 12,
    padding: 5,
    elevation: 1,
  },
 tabContainerDark: {
    backgroundColor: '#1c2220', // 🔥 Same charcoal background
    borderWidth: 1,
    borderColor: '#2a3b36',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#1F7A63',
  },
  tabButtonActiveDark: {
    backgroundColor: '#2a9d82',
  },
  tabText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabTextInactive: {
    color: '#666',
  },
  tabTextInactiveDark: {
    color: '#9ca3af',
  },

  // User Rows
  userRowContainerDark: {
    backgroundColor: '#1c2220', // 🔥 Zarkhez theme ka light dark color
    borderWidth: 1,
    borderColor: '#2a3b36',     // 🔥 Halka sa border taake card alag nazar aaye
    shadowColor: '#000',
  },
  avatarDark: {
    backgroundColor: '#333',
  },
  detailsButtonDark: {
    borderTopColor: '#333',
    backgroundColor: '#262626',
  },

  tableHeaderDark: {
    backgroundColor: '#163329',   // 🔥 Wahi maza ka Deep Green
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#6ED3B5', // 🔥 Golden ki jagah Zarkhez ka apna Mint Green
  },
  tableHeaderTextDark: {
    color: '#FFFFFF',             // Text white hi rahega
  },

  // Badges
  statusBadge: {
    position: 'absolute',
    right: 12,
    top: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 5,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  badgePaidLight: { backgroundColor: '#E8F5E9' },
  badgePaidDark: { backgroundColor: '#064e3b' },
  badgePaidTextLight: { color: '#1F7A63' },
  badgePaidTextDark: { color: '#34d399' },

  badgePendingLight: { backgroundColor: '#F5F5F5' },
  badgePendingDark: { backgroundColor: '#3f3f46' },
  badgePendingTextLight: { color: '#9E9E9E' },
  badgePendingTextDark: { color: '#d4d4d8' },

});