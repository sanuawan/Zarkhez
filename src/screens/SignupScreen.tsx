// src/screens/SignupScreen.tsx
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

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSignup = async () => {
    const { name, phone, email, password } = formData;
    
    if (!name || !phone || !email || !password) {
      return Alert.alert('Error', 'Tamam fields darj karo');
    }
    
    try {
      await auth().createUserWithEmailAndPassword(email.trim(), password);
      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('Signup failed', err.message || String(err));
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

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
                colors={['#3b82f6', '#10b981']} 
                style={styles.logoContainer}
              >
                <Text style={styles.logoEmoji}>🌾</Text>
              </LinearGradient>
              
              {/* Gradient Text for Zarkhez */}
              <View style={styles.titleContainer}>
                <LinearGradient
                  colors={['#2563eb', '#16a34a']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBackground}
                >
                  <Text style={styles.title}>Join Zarkhez</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Signup Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#6b7280"
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  placeholder="03XX-XXXXXXX"
                  placeholderTextColor="#6b7280"
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="farmer@example.com"
                  placeholderTextColor="#6b7280"
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
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
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.signupButton,
                    !isFormValid && styles.disabledButton
                  ]} 
                  onPress={onSignup}
                  disabled={!isFormValid}
                >
                  <LinearGradient
                    colors={['#2563eb', '#0d9488']} 
                    style={styles.gradientButton}
                  >
                    <Text style={styles.signupButtonText}>Register</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginLinkText}>
                    Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
                  </Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#93c5fd', 
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'rgba(219, 234, 254, 0.3)', 
    height: 56,
    color: '#000000', 
  },
  buttonsContainer: {
    gap: 16,
    marginTop: 24,
  },
  signupButton: {
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
  signupButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginLink: {
    padding: 12,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loginLinkBold: {
    fontWeight: '600',
    color: '#2563eb',
  },
});

export default SignupScreen;