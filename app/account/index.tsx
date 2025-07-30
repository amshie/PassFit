// app/account/index.tsx - Comprehensive Account Management Page
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Hooks
import { useUserRealtime, useUserSubscriptionStatus } from '../../src/hooks/useUser';

// Store
import { useAppStore } from '../../src/store';

// Components
import {
  SubscriptionSection,
  PaymentSection,
  BillingHistorySection,
  SecuritySection,
  PrivacySection,
} from '../../src/components/account';

export default function AccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // Get current user from store
  const currentUser = useAppStore((state) => state.user);
  
  // Hooks for user data with real-time updates
  const { data: userProfile, isLoading, error, refetch } = useUserRealtime(currentUser?.uid || '');
  const { data: subscriptionStatus, isLoading: subscriptionLoading } = useUserSubscriptionStatus(currentUser?.uid || '');

  const getDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return 'Amer Dvd'; // Default fallback
  };

  // Loading State
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>{t('account.loading')}</Text>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{t('account.loadingError')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('account.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* User Info Header */}
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color="#6B7280" />
          </View>
        </View>
        <Text style={styles.userName}>{getDisplayName()}</Text>
        <Text style={styles.userEmail}>{userProfile?.email || currentUser?.email}</Text>
      </View>

      {/* Account Sections */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subscription Management */}
        <SubscriptionSection
          userProfile={userProfile || null}
          subscriptionStatus={subscriptionStatus}
          subscriptionLoading={subscriptionLoading}
        />

        {/* Payment Information */}
        <PaymentSection
          userProfile={userProfile || null}
          subscriptionStatus={subscriptionStatus}
        />

        {/* Billing History */}
        <BillingHistorySection
          userProfile={userProfile || null}
        />

        {/* Security & Login */}
        <SecuritySection
          userProfile={userProfile || null}
        />

        {/* Privacy */}
        <PrivacySection
          userProfile={userProfile || null}
        />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },

  // User Header
  userHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  bottomSpacing: {
    height: 40,
  },

  // Loading and Error States
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
