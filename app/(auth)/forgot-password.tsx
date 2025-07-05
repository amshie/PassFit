import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { theme } from '@/styles';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setEmailSent(true);
      Alert.alert(
        'E-Mail gesendet!',
        'Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie auch Ihren Spam-Ordner.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Es wurde kein Konto mit dieser E-Mail-Adresse gefunden.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Die E-Mail-Adresse ist ungültig.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
          break;
        default:
          errorMessage = error.message || 'Ein Fehler ist aufgetreten.';
      }
      
      Alert.alert('Fehler', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.primary[500]} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={60} color={theme.colors.primary[500]} />
        </View>
        <Text style={styles.title}>Passwort vergessen?</Text>
        <Text style={styles.subtitle}>
          Kein Problem! Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="E-Mail-Adresse"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />}
          />
        </View>

        <Button
          title={loading ? "Wird gesendet..." : "Reset-Link senden"}
          onPress={handleSendResetEmail}
          disabled={loading || !email.trim()}
          style={styles.sendButton}
        />

        {emailSent && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success[500]} />
            <Text style={styles.successText}>
              E-Mail erfolgreich gesendet! Überprüfen Sie Ihr Postfach.
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle-outline" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.infoText}>
              Der Link ist 1 Stunde gültig
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.infoText}>
              Überprüfen Sie auch Ihren Spam-Ordner
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleBackToLogin} style={styles.backToLoginButton}>
          <Text style={styles.backToLoginText}>
            Zurück zur Anmeldung
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing[4],
  },
  backButton: {
    marginTop: theme.spacing[12],
    marginBottom: theme.spacing[4],
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    paddingBottom: theme.spacing[8],
  },
  iconContainer: {
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing[2],
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing[6],
  },
  sendButton: {
    marginBottom: theme.spacing[6],
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success[500] + '20',
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
  },
  successText: {
    marginLeft: theme.spacing[2],
    color: theme.colors.success[500],
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
  },
  infoContainer: {
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[6],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  infoText: {
    marginLeft: theme.spacing[2],
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
  },
  footer: {
    paddingBottom: theme.spacing[8],
  },
  backToLoginButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
  },
  backToLoginText: {
    color: theme.colors.primary[500],
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
  },
});
