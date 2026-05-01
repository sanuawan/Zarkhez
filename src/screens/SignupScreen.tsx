// src/screens/SignupScreen.tsx
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const isFormValid = useMemo(() => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !phone || !email || !password) {
      return false;
    }

    return emailRegex.test(email) && password.length >= 6;
  }, [formData]);

  const onSignup = async () => {
    if (loading) {
      return;
    }

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !phone || !email || !password) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const {user} = userCredential;

      await firestore().collection('users').doc(user.uid).set({
        name,
        phone,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await user.sendEmailVerification();

      Alert.alert(
        'Verification Email Sent!',
        'Please check your inbox or Spam/Junk folder and verify your email before logging in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert('Signup failed', err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/farmer-tubewell.png')}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Image source={require('../assets/zarkhez-logo-removebg.png')} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>
                Join Zarkhez and start managing your farming journey with confidence.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(255, 255, 255, 0.75)"
                  style={styles.input}
                  multiline={false}
                  value={formData.name}
                  onChangeText={value => updateField('name', value)}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  placeholder="03XX-XXXXXXX"
                  placeholderTextColor="rgba(255, 255, 255, 0.75)"
                  style={styles.input}
                  multiline={false}
                  value={formData.phone}
                  onChangeText={value => updateField('phone', value.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={11}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="farmer@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.75)"
                  style={styles.input}
                  multiline={false}
                  value={formData.email}
                  onChangeText={value => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255, 255, 255, 0.75)"
                    style={[styles.input, styles.passwordInput]}
                    multiline={false}
                    value={formData.password}
                    onChangeText={value => updateField('password', value)}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.togglePasswordButton}
                    onPress={() => setShowPassword(prev => !prev)}
                    disabled={loading}
                  >
                    <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.signupButton,
                    (!isFormValid || loading) && styles.disabledButton,
                  ]}
                  onPress={onSignup}
                  disabled={!isFormValid || loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.signupButtonText}>Register</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                  disabled={loading}
                >
                  <Text style={styles.loginLinkText}>
                    Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 15, 30, 0.26)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    width: '100%',
    maxWidth: 430,
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    height: 55,
    color: '#ffffff',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 78,
  },
  togglePasswordButton: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
  togglePasswordText: {
    color: '#d9f99d',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 14,
    marginTop: 24,
  },
  signupButton: {
    borderRadius: 14,
    height: 54,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.65,
  },
  loginLink: {
    padding: 8,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
  },
  loginLinkBold: {
    fontWeight: '600',
    color: '#bfdbfe',
  },
});

export default SignupScreen;