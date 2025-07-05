import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginForm } from '@/components/forms';
import { theme } from '@/styles';

export default function LoginScreen() {
  const router = useRouter();

  const handleNavigateToIndex = () => {
    router.push('/');
  };

  const handleNavigateToRegister = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleLoginSuccess = () => {
    // Navigate to main app after successful login
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Willkommen zurück</Text>
        <Text style={styles.subtitle}>Melden Sie sich in Ihrem PassFit-Konto an</Text>
      </View>
      
      <View style={styles.formContainer}>
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onNavigateToRegister={handleNavigateToRegister}
          onForgotPassword={handleForgotPassword}
          onNavigateToIndex={handleNavigateToIndex}
        />
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
  header: {
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[8],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
});
