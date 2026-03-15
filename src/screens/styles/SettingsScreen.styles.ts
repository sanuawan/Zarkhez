// src/screens/styles/SettingsScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  scrollContent: {
    paddingBottom: 80,
  },
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
  content: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#1F7A63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e28',
    marginBottom: 4,
  },
  userBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  farmerBadge: {
    backgroundColor: '#E8F3F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  farmerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F7A63',
  },
  loggedInText: {
    fontSize: 11,
    color: '#8aabb3',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6ED3B5',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8aabb3',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#1F7A63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingsItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f4f3',
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconText: {
    fontSize: 18,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a2e28',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#8aabb3',
  },
  chevron: {
    fontSize: 18,
    color: '#b0c8c2',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ffd6d6',
    gap: 8,
  },
  logoutIcon: {
    fontSize: 16,
    color: '#e05353',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e05353',
  },
});