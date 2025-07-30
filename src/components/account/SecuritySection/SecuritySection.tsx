// src/components/account/SecuritySection/SecuritySection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Types
import { User } from '../../../models/users';

interface SecuritySectionProps {
  userProfile: User | null;
}

export function SecuritySection({ userProfile }: SecuritySectionProps) {
  const { t } = useTranslation();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Email change form
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: '',
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 2FA setup
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailChange = async () => {
    const { newEmail, confirmEmail, currentPassword } = emailForm;

    if (!validateEmail(newEmail)) {
      Alert.alert(t('common.error'), 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    if (newEmail !== confirmEmail) {
      Alert.alert(t('common.error'), 'E-Mail-Adressen stimmen nicht überein.');
      return;
    }

    if (!currentPassword) {
      Alert.alert(t('common.error'), 'Bitte geben Sie Ihr aktuelles Passwort ein.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement email change with Firebase Auth
      // await updateEmail(auth.currentUser, newEmail);
      // await sendEmailVerification(auth.currentUser);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowEmailModal(false);
      setEmailForm({ newEmail: '', confirmEmail: '', currentPassword: '' });
      
      Alert.alert(
        t('common.ok'),
        t('account.security.emailChangeSuccess')
      );
    } catch (error) {
      console.error('Email change error:', error);
      Alert.alert(
        t('common.error'),
        t('account.security.emailChangeError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('account.security.passwordMismatch'));
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        t('common.error'),
        t('account.security.passwordTooWeak')
      );
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement password change with Firebase Auth
      // const credential = EmailAuthProvider.credential(userProfile?.email || '', currentPassword);
      // await reauthenticateWithCredential(auth.currentUser, credential);
      // await updatePassword(auth.currentUser, newPassword);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      Alert.alert(
        t('common.ok'),
        t('account.security.passwordChangeSuccess')
      );
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert(
        t('common.error'),
        t('account.security.passwordChangeError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      Alert.alert(
        t('account.security.twoFactor.disableConfirm'),
        'Sind Sie sicher, dass Sie die Zwei-Faktor-Authentifizierung deaktivieren möchten?',
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: 'Deaktivieren',
            style: 'destructive',
            onPress: async () => {
              setIsLoading(true);
              try {
                // TODO: Disable 2FA
                await new Promise(resolve => setTimeout(resolve, 1500));
                setTwoFactorEnabled(false);
                Alert.alert(t('common.ok'), t('account.security.twoFactor.disableSuccess'));
              } catch (error) {
                Alert.alert(t('common.error'), 'Fehler beim Deaktivieren der 2FA');
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    } else {
      // Enable 2FA
      setShow2FAModal(true);
    }
  };

  const handleSetup2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      Alert.alert(t('common.error'), 'Bitte geben Sie einen 6-stelligen Code ein.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Verify 2FA code and enable
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTwoFactorEnabled(true);
      setShow2FAModal(false);
      setTwoFactorCode('');
      
      Alert.alert(
        t('common.ok'),
        t('account.security.twoFactor.setupSuccess')
      );
    } catch (error) {
      console.error('2FA setup error:', error);
      Alert.alert(
        t('common.error'),
        t('account.security.twoFactor.setupError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('account.security.title')}</Text>

      <View style={styles.securityCard}>
        {/* Email Change */}
        <TouchableOpacity
          style={styles.securityItem}
          onPress={() => setShowEmailModal(true)}
        >
          <View style={styles.securityItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={24} color="#6B46C1" />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>{t('account.security.changeEmail')}</Text>
              <Text style={styles.securitySubtitle}>
                {t('account.security.currentEmail')}: {userProfile?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Password Change */}
        <TouchableOpacity
          style={styles.securityItem}
          onPress={() => setShowPasswordModal(true)}
        >
          <View style={styles.securityItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#6B46C1" />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>{t('account.security.changePassword')}</Text>
              <Text style={styles.securitySubtitle}>
                Zuletzt geändert vor 3 Monaten
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Two-Factor Authentication */}
        <View style={styles.securityItem}>
          <View style={styles.securityItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#6B46C1" />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>{t('account.security.twoFactor.title')}</Text>
              <Text style={styles.securitySubtitle}>
                {twoFactorEnabled 
                  ? t('account.security.twoFactor.enabled')
                  : t('account.security.twoFactor.disabled')
                }
              </Text>
            </View>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={handleToggle2FA}
            trackColor={{ false: '#D1D5DB', true: '#6B46C1' }}
            thumbColor={twoFactorEnabled ? '#FFFFFF' : '#FFFFFF'}
            disabled={isLoading}
          />
        </View>
      </View>

      {/* Email Change Modal */}
      <Modal
        visible={showEmailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('account.security.changeEmail')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEmailModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.newEmail')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={emailForm.newEmail}
                  onChangeText={(text) => setEmailForm(prev => ({ ...prev, newEmail: text }))}
                  placeholder="neue@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.confirmEmail')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={emailForm.confirmEmail}
                  onChangeText={(text) => setEmailForm(prev => ({ ...prev, confirmEmail: text }))}
                  placeholder="neue@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.currentPassword')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={emailForm.currentPassword}
                  onChangeText={(text) => setEmailForm(prev => ({ ...prev, currentPassword: text }))}
                  placeholder="Aktuelles Passwort"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, isLoading && styles.disabledButton]}
                onPress={handleEmailChange}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>E-Mail ändern</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('account.security.changePassword')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.currentPassword')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordForm.currentPassword}
                  onChangeText={(text) => setPasswordForm(prev => ({ ...prev, currentPassword: text }))}
                  placeholder="Aktuelles Passwort"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.newPassword')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordForm.newPassword}
                  onChangeText={(text) => setPasswordForm(prev => ({ ...prev, newPassword: text }))}
                  placeholder="Neues Passwort (min. 8 Zeichen)"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.confirmPassword')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) => setPasswordForm(prev => ({ ...prev, confirmPassword: text }))}
                  placeholder="Neues Passwort bestätigen"
                  secureTextEntry
                />
              </View>

              <Text style={styles.passwordHint}>
                Das Passwort muss mindestens 8 Zeichen lang sein und Groß- und Kleinbuchstaben sowie eine Zahl enthalten.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, isLoading && styles.disabledButton]}
                onPress={handlePasswordChange}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Passwort ändern</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        visible={show2FAModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShow2FAModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('account.security.twoFactor.setupTitle')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShow2FAModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.setupInstructions}>
                {t('account.security.twoFactor.setupInstructions')}
              </Text>
              
              {/* Mock QR Code */}
              <View style={styles.qrContainer}>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code-outline" size={120} color="#6B7280" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.security.twoFactor.verifyCode')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={twoFactorCode}
                  onChangeText={setTwoFactorCode}
                  placeholder="123456"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShow2FAModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, isLoading && styles.disabledButton]}
                onPress={handleSetup2FA}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>2FA aktivieren</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },

  // Security Card
  securityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Form
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  passwordHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // 2FA Setup
  setupInstructions: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});
