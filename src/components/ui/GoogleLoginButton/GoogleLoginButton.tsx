import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { theme } from '@/styles';
import { AuthService } from '@/services/api';

export interface GoogleLoginButtonProps {
  onPress?: () => void;
  onSuccess?: (user?: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  mode?: 'login' | 'register';
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onPress,
  onSuccess,
  onError,
  disabled = false,
  mode = 'login',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (disabled || isLoading) return;

    if (onPress) {
      onPress();
      return;
    }

    setIsLoading(true);
    
    try {
      let user;
      
      if (mode === 'register') {
        user = await AuthService.registerWithGoogle();
      } else {
        user = await AuthService.signInWithGoogle();
      }
      
      onSuccess?.(user);
      
    } catch (error: any) {
      console.error('Google authentication error:', error);
      const errorMessage = error.message || 'Google Anmeldung fehlgeschlagen';
      onError?.(errorMessage);
      
      // Show user-friendly error message
      Alert.alert(
        'Google Anmeldung Fehler', 
        errorMessage.includes('not configured') 
          ? 'Google Anmeldung ist noch nicht konfiguriert. Bitte verwenden Sie E-Mail oder Telefonnummer.'
          : errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = mode === 'login' 
    ? 'Mit Google anmelden' 
    : 'Mit Google registrieren';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
        isLoading && styles.loading,
      ]}
      onPress={handleGoogleAuth}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.googleIcon}>G</Text>
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {isLoading ? 'Wird geladen...' : buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[3],
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285f4',
    backgroundColor: '#f8f9fa',
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    borderRadius: 12,
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500',
    color: '#3c4043',
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  disabledText: {
    color: '#9aa0a6',
  },
  loading: {
    opacity: 0.8,
  },
});
