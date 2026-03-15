// src/screens/styles/SettingsActivityLogScreen.styles.ts
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  header: { paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backIcon: { fontSize: 18, color: '#FFFFFF', marginRight: 8 },
  backText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  content: { padding: 16 },
  timeline: { position: 'relative', paddingLeft: 24 },
  timelineLine: { position: 'absolute', left: 32, top: 8, bottom: 8, width: 2, backgroundColor: '#D1EBE4' },
  timelineItem: { flexDirection: 'row', marginBottom: 16 },
  eventIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12, zIndex: 2, borderWidth: 2, borderColor: 'rgba(31,122,99,0.1)' },
  eventIconText: { fontSize: 16 },
  eventCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, shadowColor: '#1F7A63', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#1a2e28' },
  eventTime: { fontSize: 11, color: '#b0c8c2' },
  eventDescription: { fontSize: 12, color: '#4a6b64', marginBottom: 6 },
  eventDate: { fontSize: 11, color: '#b0c8c2' },
});