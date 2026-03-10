// src/screens/styles/UserDetailScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
  },
  backText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  largeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD166',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F7A63',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  summaryRow: {
    flexDirection: 'row',
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
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F7A63',
    marginBottom: 16,
  },
  timeline: {
    position: 'relative',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F7A63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    zIndex: 2,
  },
  clockIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1F7A63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBadge: {
    backgroundColor: '#E8F3F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F7A63',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F7A63',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: '#8aabb3',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a2e28',
  },
  timeSeparator: {
    width: 24,
    height: 2,
    backgroundColor: '#6ED3B5',
    marginHorizontal: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  durationIcon: {
    fontSize: 11,
    color: '#FFD166',
    marginRight: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#c8922a',
  },
});