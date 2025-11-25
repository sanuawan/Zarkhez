// src/screens/LoginScreen.tsx
import React, {useState} from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Email aur password dono darj karo');
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
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
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#6b7280"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

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
                    colors={['#0d9488', '#047857']} // Darker green colors
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
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 16,
    minHeight: '100%', // Ensure it takes full height
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
    width: '100%', // Take full width on small screens
    maxWidth: 400, // But don't exceed 400px on larger screens
    marginVertical: 20, // Add some vertical margin
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
    color: 'rgba(8, 1, 1, 0.5)', // White text
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