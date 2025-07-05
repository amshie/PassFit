// app/SignUpScreen.jsx
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
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';  // ← Hooks und Link von expo-router
import { GoogleLoginButton } from '@/components/ui';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
const { width } = Dimensions.get('window');

// Passwort-Stärke-Anzeige
function PasswordStrengthMeter({ password }: { password: string }) {
  const strength =
    password.length > 9 ? 'strong' : password.length > 5 ? 'medium' : 'weak';
  const colors = { weak: '#EF4444', medium: '#F59E0B', strong: '#10B981' };
  return (
    <View style={styles.strengthContainer}>
      <View
        style={[
          styles.strengthBar,
          {
            backgroundColor:
              password.length > 0 ? colors[strength] : '#E5E7EB',
          },
        ]}
      />
      {!!password.length && (
        <Text style={[styles.strengthText, { color: colors[strength] }]}>
          {strength.charAt(0).toUpperCase() + strength.slice(1)}
        </Text>
      )}
    </View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();       // ← hook holen
  const [method, setMethod] = useState('email');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Zurück zur Startseite
  const goHome = () => router.push('/');

  // Registrierungs-Handler
  const handleSignUp = async () => {
    if (!agreed) {
      Alert.alert('Bitte akzeptiere die Nutzungsbedingungen.');
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        credential,
        password
      );
      console.log('User created:', user.uid);

      //  →  Dynamische Route: /profile/${uid}
      router.replace(`/profile/${user.uid}`);
    } catch (err: any) {
      console.error('Sign-Up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        Alert.alert(
          'E-Mail existiert bereits',
          'Diese E-Mail ist bereits registriert. Bitte logge dich ein.'
        );
        router.replace('/(auth)/login');
      } else {
        Alert.alert('Fehler', err.message);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Pressable onPress={goHome} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Home Page</Text>
      </View>

      <LinearGradient colors={['#EEF2FF', '#EEF2FF']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Logo */}
          <Image
            source={{ uri: 'https://placehold.co/80x80.png?text=FitApp' }}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Create account</Text>
          <Text style={styles.subheader}>
            Sign up to start your fitness journey
          </Text>

          {/* Toggle: Email/Phone */}
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
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Eingabe: Email oder Phone */}
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

          {/* Passwort-Feld */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
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
            <PasswordStrengthMeter password={password} />
          </View>

          {/* AGB-Zustimmung */}
          <Pressable
            style={styles.agreeRow}
            onPress={() => setAgreed((a) => !a)}
          >
            <View style={[styles.checkbox, agreed && styles.checked]} />
            <Text style={styles.agreeText}>
              I agree to the{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </Pressable>

          {/* Registrierungs-Button */}
          <TouchableOpacity
            style={[styles.createButton, !agreed && styles.disabledButton]}
            disabled={!agreed}
            onPress={handleSignUp}
          >
            <Text style={styles.createText}>Create Account</Text>
          </TouchableOpacity>

          {/* Google Registration Button */}
          <View style={styles.googleContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>oder</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <GoogleLoginButton
              mode="register"
              onSuccess={() => {
                // Navigate to profile after successful Google registration
                router.replace('/(tabs)');
              }}
              onError={(error) => Alert.alert('Google Registrierung Fehler', error)}
            />
          </View>

          {/* Index Button */}
          <TouchableOpacity
            style={styles.indexButton}
            onPress={goHome}
          >
            <Text style={styles.indexButtonText}>Zur Index Seite</Text>
          </TouchableOpacity>

          {/* Footer: Login-Link */}
          <View style={styles.footerRow}>
            <Text style={styles.noAccount}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
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
  scroll: { padding: 20, alignItems: 'center' },
  logo: { width: 80, height: 80, marginBottom: 16 },
  headerText: { fontSize: 24, fontWeight: '600', color: '#111827' },
  subheader: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
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
  passwordInputContainer: { position: 'relative', width: '100%' },
  eyeIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthText: { marginLeft: 8, fontSize: 12, fontWeight: '600' },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
  agreeText: { fontSize: 12, color: '#6B7280', flexShrink: 1 },
  link: { color: '#6B46C1', textDecorationLine: 'underline' },
  createButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  createText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  disabledButton: { backgroundColor: '#A78BFA' },
  footerRow: { flexDirection: 'row' },
  noAccount: { fontSize: 12, color: '#6B7280' },
  footerLink: { fontSize: 12, fontWeight: '600', color: '#6B46C1' },
  googleContainer: {
    width: '100%',
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#6B7280',
  },
  indexButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6B46C1',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  indexButtonText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '600',
  },
});
