// LoginScreen.tsx 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // LOAD SAVED CREDENTIALS
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');

        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        if (savedRememberMe === 'true') setRememberMe(true);
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  const onLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Email aur password dono darj karo');
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);

      // SAVE CREDENTIALS IF REMEMBER ME CHECKED
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
        await AsyncStorage.setItem('savedPassword', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
        await AsyncStorage.removeItem('rememberMe');
      }

      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('Login failed', err.message || String(err));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1702373749921-3ed85367c2ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwYWdyaWN1bHR1cmUlMjBmaWVsZHxlbnwxfHx8fDE3NTk0ODI2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
        }}
        style={styles.background}
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Logo/Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#10b981', '#3b82f6']}
                style={styles.logoContainer}
              >
                <Text style={styles.logoEmoji}>🌾</Text>
              </LinearGradient>

              {/* Gradient Text for FarmTech */}
              <View style={styles.titleContainer}>
                <LinearGradient
                  colors={['#16a34a', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBackground}
                >
                  <Text style={styles.title}>Zarkhez</Text>
                </LinearGradient>
              </View>

              <Text style={styles.subtitle}>Welcome</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="farmer@example.com"
                  placeholderTextColor="#6b7280"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#10b981" 
                  cursorColor="#10b981" 
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#6b7280"
                    style={[styles.input, { paddingRight: 50 }]} 
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} 
                    selectionColor="#10b981" 
                    cursorColor="#10b981" 
                  />
                  {/* Eye button */}
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: 16,
                      padding: 4,
                    }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={{ fontSize: 20, color: '#6b7280' }}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: rememberMe ? '#10b981' : '#d1d5db',
                  borderRadius: 4,
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: rememberMe ? '#10b981' : 'transparent',
                }}>
                  {rememberMe && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
                </View>
                <Text style={{ color: '#374151', fontSize: 14 }}>Remember me</Text>
              </TouchableOpacity>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    (!email || !password) && styles.disabledButton
                  ]}
                  onPress={onLogin}
                  disabled={!email || !password}
                >
                  <LinearGradient
                    colors={['#0d9488', '#047857']}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.loginButtonText}>Login</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoEmoji: {
    fontSize: 32,
  },
  titleContainer: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#15803d',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    backgroundColor: 'rgba(240, 253, 244, 0.5)',
    height: 56,
    color: '#1f2937', 
  },

  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50, 
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#6b7280',
  },
  
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rememberText: {
    fontSize: 14,
    color: '#374151',
  },
  buttonsContainer: {
    gap: 16,
    marginTop: 16,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white', 
    fontSize: 20,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#93c5fd',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  registerButtonText: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default LoginScreen;