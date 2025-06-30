import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [method, setMethod] = useState('email');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const goHome = () => router.push('/');

  return (
    <>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <Pressable onPress={goHome} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Homepage</Text>
      </View>

      <LinearGradient colors={['#EEF2FF', '#EEF2FF']} style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://placehold.co/120x120.png?text=FitApp' }}
            style={styles.logo}
          />
          <Text style={styles.header}>Welcome back</Text>
          <Text style={styles.subheader}>
            Log in to access your fitness journey
          </Text>

          {/* Email / Phone Toggle */}
          <View style={styles.tabContainer}>
            {['email', 'phone'].map((m) => (
              <Pressable
                key={m}
                style={[styles.tab, method === m && styles.activeTab]}
                onPress={() => setMethod(m)}
              >
                <Text
                  style={[
                    styles.tabText,
                    method === m && styles.activeTabText,
                  ]}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Credential Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {method === 'email' ? 'Email' : 'Phone'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                method === 'email'
                  ? 'your.email@company.com'
                  : '+1234567890'
              }
              keyboardType={
                method === 'email' ? 'email-address' : 'phone-pad'
              }
              value={credential}
              onChangeText={setCredential}
            />
          </View>

          {/* Password Input */}
          <View style={styles.fieldContainer}>
            <View style={styles.passwordRow}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#6B46C1"
                />
              </Pressable>
            </View>
          </View>

          {/* Keep me signed in */}
          <Pressable
            style={styles.keepRow}
            onPress={() => setKeepSignedIn((v) => !v)}
          >
            <View
              style={[styles.checkbox, keepSignedIn && styles.checked]}
            />
            <Text style={styles.keepText}>Keep me signed in</Text>
          </Pressable>

          {/* Log In Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <Text style={styles.or}>or</Text>

          {/* Login with Google */}
          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.googleText}>  Login with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpRow}>
            <Text style={styles.noAccount}>Don't have an account? </Text>
            <Link href="/SignUpScreen" asChild>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  container: { flex: 1, backgroundColor: '#EEF2FF' },
  card: {
    flex: 1,
    margin: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
  },
  logo: { width: 80, height: 80, marginBottom: 16 },
  header: { fontSize: 24, fontWeight: '600', color: '#111827' },
  subheader: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 14, color: '#6B7280' },
  activeTabText: { color: '#111827', fontWeight: '600' },
  fieldContainer: { width: '100%', marginBottom: 16 },
  fieldLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: { fontSize: 12, color: '#6B46C1' },
  passwordInputContainer: { position: 'relative', width: '100%' },
  eyeIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  keepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 4,
    marginRight: 8,
  },
  checked: { backgroundColor: '#6B46C1', borderColor: '#6B46C1' },
  keepText: { fontSize: 14, color: '#6B7280' },
  loginButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  or: { fontSize: 12, color: '#6B7280', marginVertical: 8 },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DB4437',
  },
  googleText: { fontSize: 14, color: '#DB4437', fontWeight: '600' },
  signUpRow: { flexDirection: 'row', alignItems: 'center' },
  noAccount: { fontSize: 12, color: '#6B7280' },
  signUpLink: { fontSize: 12, fontWeight: '600', color: '#6B46C1' },
});
