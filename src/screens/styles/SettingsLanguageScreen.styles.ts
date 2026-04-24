import { StyleSheet } from 'react-native';

export const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: isDark ? '#121212' : '#F4F7F6' 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingBottom: 24, 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24 
  },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backIcon: { fontSize: 18, color: '#FFFFFF', marginRight: 8 },
  backText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  content: { padding: 16, gap: 16 },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: isDark ? '#bbb' : '#8aabb3', 
    letterSpacing: 0.5, 
    marginBottom: 4 
  },
  langCard: { 
    backgroundColor: isDark ? '#1e1e1e' : '#FFFFFF', 
    borderRadius: 16, 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12
  },
  selectedCard: { 
    borderColor: '#1F7A63',
    elevation: 4 
  },
  langIconContainer: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: isDark ? '#333' : '#E8F3F0', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  langIcon: { fontSize: 22 },
  langTexts: { flex: 1 },
  langTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: isDark ? '#fff' : '#1a2e28' 
  },
  langSubtitle: { 
    fontSize: 12, 
    color: isDark ? '#aaa' : '#8aabb3' 
  },
  checkmark: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: '#1F7A63', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkmarkIcon: { fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' },
});