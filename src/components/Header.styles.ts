// src/components/Header.styles.ts
import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerDark: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  titleDark: {
    color: '#22c55e',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#9ca3af',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  headerButtonTextDark: {
    color: '#f3f4f6',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonDark: {
    backgroundColor: '#7f1d1d',
    borderColor: '#991b1b',
  },
  logoutButtonText: {
    fontSize: 16,
  },
});