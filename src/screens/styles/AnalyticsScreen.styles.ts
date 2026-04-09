import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F8F7' },
  // Header ko thora niche laya hoon aur spacing di hai
  header: { 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 25, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    elevation: 8 
  },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFF' },
  
  toggleRow: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 25, 
    padding: 4, 
    marginTop: 20, 
    alignSelf: 'flex-start' 
  },
  toggleButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  toggleActive: { backgroundColor: '#FFD166' },
  toggleText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  toggleTextActive: { color: '#1F7A63' },

  content: { padding: 15, paddingBottom: 120 }, // Extra padding for keyboard/bottom card
  
  card: { backgroundColor: '#FFF', borderRadius: 22, padding: 18, marginBottom: 15, elevation: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F7A63', marginBottom: 15 },

  inputRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F7F9F8', 
    padding: 15, 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0EAE7'
  },
  input: { backgroundColor: '#FFF', width: 80, padding: 10, borderRadius: 10, textAlign: 'center', fontWeight: 'bold', color: '#1F7A63', elevation: 2 },
  
  unitBox: { marginTop: 15, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  unitLabel: { color: '#888', fontSize: 12 },
  unitValue: { fontSize: 20, fontWeight: 'bold', color: '#1F7A63' },

  profitCard: { backgroundColor: '#1F7A63', padding: 22, borderRadius: 25, elevation: 6 },
  profitValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.3)', paddingTop: 15 }
});