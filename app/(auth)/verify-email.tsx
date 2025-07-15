import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useCreateUser } from '../../src/hooks/useUser';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const createUserMutation = useCreateUser();

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = getAuth().currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);

          // ✅ Erst jetzt Nutzerprofil im Backend speichern
          await createUserMutation.mutateAsync({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
          });

          router.replace(`/profile/${user.uid}`);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    if (resendCount >= 3) {
      Alert.alert('Limit erreicht', 'Du hast die maximale Anzahl an Versuchen erreicht.');
      return;
    }

    try {
      setLoading(true);
      const user = getAuth().currentUser!;
      await sendEmailVerification(user);
      setResendCount(c => c + 1);
      Alert.alert('Verifikations-E-Mail erneut gesendet.');
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', 'E-Mail konnte nicht erneut gesendet werden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Bitte prüfe dein E-Mail-Postfach und bestätige deine Registrierung.
      </Text>
      <TouchableOpacity
        style={[styles.button, resendCount >= 3 && styles.disabledButton]}
        disabled={loading || resendCount >= 3}
        onPress={handleResend}
      >
        <Text style={styles.buttonText}>
          {resendCount >= 3 ? 'Limit erreicht' : 'E-Mail erneut senden'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EEF2FF',
  },
  message: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#A78BFA',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
