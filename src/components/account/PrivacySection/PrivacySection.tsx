// src/components/account/PrivacySection/PrivacySection.tsx
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
  ScrollView,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

// Services
import { UserService, CookiePreferences } from '@/services/api';

// Types
import { User } from '../../../models/users';

interface PrivacySectionProps {
  userProfile: User | null;
}

export function PrivacySection({ userProfile: _userProfile }: PrivacySectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Cookie preferences state
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
  });

  const handleDataDownload = async () => {
    setIsLoading(true);
    try {
      if (!_userProfile) {
        throw new Error('No user profile available');
      }
      const exportData = await UserService.exportUserData(_userProfile.uid);
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: t('account.privacy.dataDownload.title'),
      });

      Alert.alert(
        t('common.ok'),
        t('account.privacy.dataDownload.downloadSuccess')
      );
    } catch (error) {
      console.error('Data download error:', error);
      Alert.alert(
        t('common.error'),
        t('account.privacy.dataDownload.downloadError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCookiePreferences = async () => {
    setIsLoading(true);
    try {
      if (!_userProfile) {
        throw new Error('No user profile available');
      }
      await UserService.updateCookiePreferences(
        _userProfile.uid,
        cookiePreferences
      );

      setShowCookieModal(false);
      Alert.alert(t('common.ok'), 'Cookie-Einstellungen wurden gespeichert.');
    } catch (error) {
      console.error('Cookie preferences save error:', error);
      Alert.alert(
        t('common.error'),
        'Fehler beim Speichern der Cookie-Einstellungen.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== t('account.privacy.deleteAccount.confirmText')) {
      Alert.alert(
        t('common.error'),
        t('account.privacy.deleteAccount.confirmationMismatch')
      );
      return;
    }

    setIsLoading(true);
    try {
      if (!_userProfile) {
        throw new Error('No user profile available');
      }
      await UserService.deleteUserAccount(_userProfile.uid);
      Alert.alert(
        t('common.ok'),
        t('account.privacy.deleteAccount.deleteSuccess'),
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Account deletion error:', error);
      Alert.alert(
        t('common.error'),
        t('account.privacy.deleteAccount.deleteError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAccountDeletion = () => {
    Alert.alert(
      t('account.privacy.deleteAccount.confirmTitle'),
      t('account.privacy.deleteAccount.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Weiter',
          style: 'destructive',
          onPress: () => setShowDeleteModal(true),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('account.privacy.title')}</Text>

      <View style={styles.privacyCard}>
        {/* Data Download */}
        <TouchableOpacity
          style={styles.privacyItem}
          onPress={handleDataDownload}
          disabled={isLoading}
        >
          <View style={styles.privacyItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="download-outline" size={24} color="#6B46C1" />
            </View>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>
                {t('account.privacy.dataDownload.title')}
              </Text>
              <Text style={styles.privacySubtitle}>
                {t('account.privacy.dataDownload.description')}
              </Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#6B46C1" />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        {/* Cookie Settings */}
        <TouchableOpacity
          style={styles.privacyItem}
          onPress={() => setShowCookieModal(true)}
        >
          <View style={styles.privacyItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="settings-outline" size={24} color="#6B46C1" />
            </View>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>
                {t('account.privacy.cookies.title')}
              </Text>
              <Text style={styles.privacySubtitle}>
                Verwalten Sie Ihre Cookie- und Tracking-Präferenzen
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[styles.privacyItem, styles.dangerItem]}
          onPress={confirmAccountDeletion}
        >
          <View style={styles.privacyItemLeft}>
            <View style={[styles.iconContainer, styles.dangerIconContainer]}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </View>
            <View style={styles.privacyInfo}>
              <Text style={[styles.privacyTitle, styles.dangerTitle]}>
                {t('account.privacy.deleteAccount.title')}
              </Text>
              <Text style={styles.privacySubtitle}>
                {t('account.privacy.deleteAccount.description')}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Cookie Preferences Modal */}
      <Modal
        visible={showCookieModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCookieModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('account.privacy.cookies.title')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCookieModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cookieContainer}>
              {/* Essential Cookies */}
              <View style={styles.cookieItem}>
                <View style={styles.cookieInfo}>
                  <Text style={styles.cookieTitle}>
                    {t('account.privacy.cookies.essential')}
                  </Text>
                  <Text style={styles.cookieDescription}>
                    {t('account.privacy.cookies.essentialDescription')}
                  </Text>
                </View>
                <Switch
                  value={cookiePreferences.essential}
                  disabled={true} // Essential cookies cannot be disabled
                  trackColor={{ false: '#D1D5DB', true: '#6B46C1' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Analytics Cookies */}
              <View style={styles.cookieItem}>
                <View style={styles.cookieInfo}>
                  <Text style={styles.cookieTitle}>
                    {t('account.privacy.cookies.analytics')}
                  </Text>
                  <Text style={styles.cookieDescription}>
                    {t('account.privacy.cookies.analyticsDescription')}
                  </Text>
                </View>
                <Switch
                  value={cookiePreferences.analytics}
                  onValueChange={(value) =>
                    setCookiePreferences(prev => ({ ...prev, analytics: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#6B46C1' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Marketing Cookies */}
              <View style={styles.cookieItem}>
                <View style={styles.cookieInfo}>
                  <Text style={styles.cookieTitle}>
                    {t('account.privacy.cookies.marketing')}
                  </Text>
                  <Text style={styles.cookieDescription}>
                    {t('account.privacy.cookies.marketingDescription')}
                  </Text>
                </View>
                <Switch
                  value={cookiePreferences.marketing}
                  onValueChange={(value) =>
                    setCookiePreferences(prev => ({ ...prev, marketing: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#6B46C1' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCookieModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, isLoading && styles.disabledButton]}
                onPress={handleSaveCookiePreferences}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>
                    {t('account.privacy.cookies.savePreferences')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, styles.dangerTitle]}>
                {t('account.privacy.deleteAccount.title')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={48} color="#EF4444" />
                <Text style={styles.warningText}>
                  {t('account.privacy.deleteAccount.warning')}
                </Text>
                <Text style={styles.warningDescription}>
                  {t('account.privacy.deleteAccount.confirmMessage')}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('account.privacy.deleteAccount.typeConfirm')}
                </Text>
                <TextInput
                  style={[styles.textInput, styles.dangerInput]}
                  value={deleteConfirmation}
                  onChangeText={setDeleteConfirmation}
                  placeholder={t('account.privacy.deleteAccount.confirmText')}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDangerButton, isLoading && styles.disabledButton]}
                onPress={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalDangerText}>
                    {t('account.privacy.deleteAccount.deleteButton')}
                  </Text>
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

  // Privacy Card
  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  privacyItemLeft: {
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
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Danger styles
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerIconContainer: {
    backgroundColor: '#FEF2F2',
  },
  dangerTitle: {
    color: '#EF4444',
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

  // Cookie Settings
  cookieContainer: {
    maxHeight: 300,
    marginBottom: 24,
  },
  cookieItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cookieInfo: {
    flex: 1,
    marginRight: 16,
  },
  cookieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cookieDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
  dangerInput: {
    borderColor: '#EF4444',
  },

  // Warning
  warningContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  warningText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  warningDescription: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 20,
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
  modalDangerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalDangerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});
