// src/components/account/SubscriptionSection/SubscriptionSection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Hooks
import { usePlan } from '../../../hooks/usePlan';
import { useCancelSubscription, useActiveUserSubscription } from '../../../hooks/useSubscription';

// Types
import { User } from '../../../models/users';

interface SubscriptionSectionProps {
  userProfile: User | null;
  subscriptionStatus: User['subscriptionStatus'];
  subscriptionLoading: boolean;
}

export function SubscriptionSection({
  userProfile,
  subscriptionStatus,
  subscriptionLoading,
}: SubscriptionSectionProps) {
  const { t } = useTranslation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Get active subscription details based on user profile
  const { data: activeSubscription, isLoading: activeSubscriptionLoading } = useActiveUserSubscription(
    userProfile?.uid || ''
  );

  // Get plan details
  const { data: currentPlan, isLoading: planLoading } = usePlan(
    activeSubscription?.planId || ''
  );

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useCancelSubscription();

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (priceCents: number, currency: string = 'EUR') => {
    const price = priceCents / 100;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'canceled':
        return '#EF4444';
      case 'expired':
        return '#6B7280';
      case 'free':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('profile.membershipStatus.active');
      case 'pending':
        return t('profile.membershipStatus.pending');
      case 'canceled':
        return t('profile.membershipStatus.canceled');
      case 'expired':
        return t('profile.membershipStatus.expired');
      case 'free':
        return 'Kostenlos';
      default:
        return status;
    }
  };

  const getPlanDisplayName = (planName: string) => {
    const lowerName = planName.toLowerCase();
    if (lowerName.includes('basic') || lowerName.includes('basis')) {
      return t('account.subscription.plans.basic');
    }
    if (lowerName.includes('premium')) {
      return t('account.subscription.plans.premium');
    }
    if (lowerName.includes('pro')) {
      return t('account.subscription.plans.pro');
    }
    return planName;
  };

  // Use real-time subscription status from user document
  const getStatusFromUserStatus = (userStatus: User['subscriptionStatus']) => {
    switch (userStatus) {
      case 'active':
        return 'active';
      case 'expired':
        return 'expired';
      case 'free':
      default:
        return 'free';
    }
  };

  const displayStatus = getStatusFromUserStatus(subscriptionStatus);

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    try {
      await cancelSubscriptionMutation.mutateAsync(activeSubscription.subscriptionId);
      setShowCancelModal(false);
      setCancelReason('');
      Alert.alert(
        t('common.ok'),
        t('account.subscription.cancelSuccess')
      );
    } catch (error) {
      console.error('Cancel subscription error:', error);
      Alert.alert(
        t('common.error'),
        t('account.subscription.cancelError')
      );
    }
  };

  const handleChangePlan = () => {
    // TODO: Navigate to plan selection screen
    Alert.alert(
      'Plan ändern',
      'Plan-Änderung wird bald verfügbar sein.'
    );
  };

  if (subscriptionLoading || planLoading || activeSubscriptionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('account.subscription.title')}</Text>

      {(activeSubscription && currentPlan) || subscriptionStatus === 'active' ? (
        <View style={styles.subscriptionCard}>
          {/* Current Plan */}
          <View style={styles.planHeader}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>
                {currentPlan ? getPlanDisplayName(currentPlan.name) : 'Premium Plan'}
              </Text>
              <Text style={styles.planPrice}>
                {currentPlan ? (
                  <>
                    {formatPrice(currentPlan.priceCents, currentPlan.currency)}
                    <Text style={styles.planDuration}>
                      /{Math.round(currentPlan.durationDays / 30)} Monat{Math.round(currentPlan.durationDays / 30) !== 1 ? 'e' : ''}
                    </Text>
                  </>
                ) : (
                  '€29.99/Monat'
                )}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(displayStatus)}15` }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(displayStatus) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(displayStatus) }]}>
                {getStatusText(displayStatus)}
              </Text>
            </View>
          </View>

          {/* Plan Details */}
          <View style={styles.planDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('account.subscription.currentPlan')}</Text>
              <Text style={styles.detailValue}>
                {currentPlan ? getPlanDisplayName(currentPlan.name) : 'Premium Plan'}
              </Text>
            </View>
            
            {activeSubscription && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {activeSubscription.status === 'canceled' 
                    ? t('account.subscription.expiresOn')
                    : t('account.subscription.renewsOn')
                  }
                </Text>
                <Text style={styles.detailValue}>
                  {formatDate(activeSubscription.expiresAt)}
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('account.subscription.status')}</Text>
              <Text style={[styles.detailValue, { color: getStatusColor(displayStatus) }]}>
                {getStatusText(displayStatus)}
              </Text>
            </View>
          </View>

          {/* Plan Features */}
          {currentPlan?.features && currentPlan.features.length > 0 && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Enthaltene Leistungen:</Text>
              {currentPlan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.changePlanButton}
              onPress={handleChangePlan}
            >
              <Ionicons name="swap-horizontal" size={20} color="#6B46C1" />
              <Text style={styles.changePlanText}>{t('account.subscription.changePlan')}</Text>
            </TouchableOpacity>

            {subscriptionStatus === 'active' && activeSubscription && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCancelModal(true)}
              >
                <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                <Text style={styles.cancelText}>{t('account.subscription.cancelSubscription')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        // No Active Subscription
        <View style={styles.noSubscriptionCard}>
          <Ionicons name="card-outline" size={48} color="#6B7280" />
          <Text style={styles.noSubscriptionTitle}>{t('account.subscription.noPlan')}</Text>
          <Text style={styles.noSubscriptionText}>
            Wählen Sie einen Plan, um alle Funktionen von PassFit zu nutzen.
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleChangePlan}
          >
            <Text style={styles.upgradeButtonText}>{t('account.subscription.upgradeNow')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cancel Subscription Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('account.subscription.cancelConfirmTitle')}</Text>
            <Text style={styles.modalMessage}>{t('account.subscription.cancelConfirmMessage')}</Text>

            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>{t('account.subscription.cancelReasonTitle')}</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder={t('account.subscription.cancelReasonPlaceholder')}
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, cancelSubscriptionMutation.isPending && styles.disabledButton]}
                onPress={handleCancelSubscription}
                disabled={cancelSubscriptionMutation.isPending}
              >
                {cancelSubscriptionMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>{t('account.subscription.confirmCancel')}</Text>
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },

  // Subscription Card
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B46C1',
  },
  planDuration: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Plan Details
  planDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Features
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  changePlanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  changePlanText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B46C1',
    marginLeft: 6,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 6,
  },

  // No Subscription
  noSubscriptionCard: {
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
  noSubscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  reasonContainer: {
    marginBottom: 24,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
  },
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
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});
