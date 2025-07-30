// src/components/account/PaymentSection/PaymentSection.tsx
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Types
import { User } from '../../../models/users';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string; // for PayPal
}

interface PaymentSectionProps {
  userProfile: User | null;
  subscriptionStatus: User['subscriptionStatus'];
}

export function PaymentSection({
  userProfile: _userProfile,
  subscriptionStatus: _subscriptionStatus,
}: PaymentSectionProps) {
  const { t } = useTranslation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock payment method - in real app, this would come from Stripe/PayPal API
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>({
    id: 'pm_1234567890',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
  });

  // Form state for new payment method
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardIcon = (brand: string): "card" => {
    // Always return 'card' as it's a valid Ionicons name
    return 'card';
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setCardForm(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    if (formatted.length <= 5) { // MM/YY
      setCardForm(prev => ({ ...prev, expiryDate: formatted }));
    }
  };

  const handleCvcChange = (value: string) => {
    const v = value.replace(/[^0-9]/gi, '');
    if (v.length <= 4) {
      setCardForm(prev => ({ ...prev, cvc: v }));
    }
  };

  const validateCardForm = () => {
    const { cardNumber, expiryDate, cvc, cardholderName } = cardForm;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert(t('common.error'), 'Bitte geben Sie eine gültige Kartennummer ein.');
      return false;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      Alert.alert(t('common.error'), 'Bitte geben Sie ein gültiges Ablaufdatum ein.');
      return false;
    }
    
    if (!cvc || cvc.length < 3) {
      Alert.alert(t('common.error'), 'Bitte geben Sie einen gültigen CVC-Code ein.');
      return false;
    }
    
    if (!cardholderName.trim()) {
      Alert.alert(t('common.error'), 'Bitte geben Sie den Namen des Karteninhabers ein.');
      return false;
    }
    
    return true;
  };

  const handleSavePaymentMethod = async () => {
    if (!validateCardForm()) return;

    setIsLoading(true);
    try {
      // TODO: Integrate with Stripe API
      // const paymentMethod = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: cardElement,
      //   billing_details: {
      //     name: cardForm.cardholderName,
      //   },
      // });

      // Mock successful save
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPaymentMethod: PaymentMethod = {
        id: 'pm_' + Date.now(),
        type: 'card',
        last4: cardForm.cardNumber.slice(-4),
        brand: 'visa', // Would be determined by Stripe
        expiryMonth: parseInt(cardForm.expiryDate.split('/')[0]),
        expiryYear: 2000 + parseInt(cardForm.expiryDate.split('/')[1]),
      };

      setPaymentMethod(newPaymentMethod);
      setShowPaymentModal(false);
      setCardForm({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: '',
      });

      Alert.alert(
        t('common.ok'),
        t('account.payment.updateSuccess')
      );
    } catch (error) {
      console.error('Payment method save error:', error);
      Alert.alert(
        t('common.error'),
        t('account.payment.updateError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePaymentMethod = () => {
    Alert.alert(
      'Zahlungsmethode entfernen',
      'Möchten Sie diese Zahlungsmethode wirklich entfernen?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Entfernen',
          style: 'destructive',
          onPress: () => {
            setPaymentMethod(null);
            Alert.alert(t('common.ok'), 'Zahlungsmethode wurde entfernt.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('account.payment.title')}</Text>

      {paymentMethod ? (
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentMethodRow}>
                <Ionicons
                  name={getCardIcon(paymentMethod.brand || '')}
                  size={24}
                  color="#6B46C1"
                />
                <Text style={styles.paymentMethodText}>
                  {paymentMethod.type === 'card' ? (
                    <>
                      {paymentMethod.brand?.toUpperCase()} •••• {paymentMethod.last4}
                    </>
                  ) : (
                    <>
                      PayPal ({paymentMethod.email})
                    </>
                  )}
                </Text>
              </View>
              
              {paymentMethod.type === 'card' && paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                <Text style={styles.expiryText}>
                  {t('account.payment.expiresOn')}: {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemovePaymentMethod}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.changeMethodButton}
            onPress={() => setShowPaymentModal(true)}
          >
            <Ionicons name="card-outline" size={20} color="#6B46C1" />
            <Text style={styles.changeMethodText}>{t('account.payment.changeMethod')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noPaymentCard}>
          <Ionicons name="wallet-outline" size={48} color="#6B7280" />
          <Text style={styles.noPaymentTitle}>{t('account.payment.noMethod')}</Text>
          <Text style={styles.noPaymentText}>
            Fügen Sie eine Zahlungsmethode hinzu, um Ihr Abonnement zu verwalten.
          </Text>
          <TouchableOpacity
            style={styles.addMethodButton}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.addMethodText}>{t('account.payment.addMethod')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('account.payment.cardForm.title')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.payment.cardForm.cardNumber')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardForm.cardNumber}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              {/* Expiry Date and CVC */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>{t('account.payment.cardForm.expiryDate')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={cardForm.expiryDate}
                    onChangeText={handleExpiryDateChange}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>{t('account.payment.cardForm.cvc')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={cardForm.cvc}
                    onChangeText={handleCvcChange}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Cardholder Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('account.payment.cardForm.cardholderName')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardForm.cardholderName}
                  onChangeText={(text) => setCardForm(prev => ({ ...prev, cardholderName: text }))}
                  placeholder="Max Mustermann"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('account.payment.cardForm.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, isLoading && styles.disabledButton]}
                onPress={handleSavePaymentMethod}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>{t('account.payment.cardForm.saveCard')}</Text>
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

  // Payment Card
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  expiryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 36,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  changeMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B46C1',
    marginLeft: 8,
  },

  // No Payment Method
  noPaymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noPaymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noPaymentText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addMethodButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  rowInputs: {
    flexDirection: 'row',
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
