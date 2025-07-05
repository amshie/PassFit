import React, { useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Input, Card, GoogleLoginButton } from '@/components/ui';
import { useAppStore } from '@/store';
import { validateEmail, validatePassword } from '@/utils';
import { theme } from '@/styles';

export interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
  onForgotPassword?: () => void;
  onNavigateToIndex?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNavigateToRegister,
  onForgotPassword,
  onNavigateToIndex,
}) => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Use direct store access to avoid selector re-render issues
  const signIn = useAppStore(useCallback((state) => state.signIn, []));
  const isLoading = useAppStore(useCallback((state) => state.isLoading, []));

  const validateForm = (): boolean => {
    let isValid = true;

    if (loginType === 'email') {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error || 'Ungültige E-Mail');
        isValid = false;
      } else {
        setEmailError('');
      }
    } else {
      // Validate phone
      if (!phone.trim()) {
        setPhoneError('Telefonnummer ist erforderlich');
        isValid = false;
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        setPhoneError('Bitte geben Sie eine gültige Telefonnummer ein');
        isValid = false;
      } else {
        setPhoneError('');
      }
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || 'Ungültiges Passwort');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const loginData = loginType === 'email' 
        ? { email, password }
        : { phone, password };
      
      await signIn(loginData);
      onSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Anmeldung fehlgeschlagen',
        error.message || 'Ein Fehler ist bei der Anmeldung aufgetreten'
      );
    }
  };

  return (
    <Card variant="elevated" padding={6}>
      <View style={{ marginBottom: theme.spacing[6] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            textAlign: 'center',
            marginBottom: theme.spacing[2],
          }}
        >
          Willkommen zurück
        </Text>
        <Text
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }}
        >
          Melden Sie sich bei Ihrem PassFit-Konto an
        </Text>
      </View>

      <View style={{ gap: theme.spacing[4] }}>
        {/* Login Type Selection */}
        <View style={{ marginBottom: theme.spacing[4] }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[3],
            }}
          >
            Anmeldeart wählen:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: theme.spacing[3],
            }}
          >
            <Button
              title="E-Mail"
              variant={loginType === 'email' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setLoginType('email')}
              style={{ flex: 1 }}
            />
            <Button
              title="Telefonnummer"
              variant={loginType === 'phone' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setLoginType('phone')}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Conditional Input based on login type */}
        {loginType === 'email' ? (
          <Input
            label="E-Mail"
            placeholder="E-Mail eingeben"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            required
          />
        ) : (
          <Input
            label="Telefonnummer"
            placeholder="Telefonnummer eingeben"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
            keyboardType="phone-pad"
            autoComplete="tel"
            required
          />
        )}

        <Input
          label="Passwort"
          placeholder="Passwort eingeben"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          secureTextEntry
          showPasswordToggle
          autoComplete="password"
          required
        />

        <Button
          title="Anmelden"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />

        {/* Google Login Button */}
        <View style={{ marginTop: theme.spacing[4] }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing[3],
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
            <Text
              style={{
                marginHorizontal: theme.spacing[3],
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              oder
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
          </View>
          
          <GoogleLoginButton
            mode="login"
            {...(onSuccess && { onSuccess: (user) => onSuccess() })}
            onError={(error) => Alert.alert('Google Anmeldung Fehler', error)}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme.spacing[2],
          }}
        >
          <Button
            title="Passwort vergessen?"
            variant="ghost"
            size="sm"
            onPress={onForgotPassword}
          />
        </View>

        {/* Index Button */}
        <Button
          title="Zur Index Seite"
          variant="outline"
          onPress={onNavigateToIndex}
          fullWidth
          style={{ marginTop: theme.spacing[4] }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme.spacing[4],
            paddingTop: theme.spacing[4],
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginRight: theme.spacing[2],
            }}
          >
            Noch kein Konto?
          </Text>
          <Button
            title="Registrieren"
            variant="ghost"
            size="sm"
            onPress={onNavigateToRegister}
          />
        </View>
      </View>
    </Card>
  );
};

export default LoginForm;
