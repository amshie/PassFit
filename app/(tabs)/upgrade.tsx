import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';

// UI Components
import { Card } from '../../src/components/ui';

// Services and Store
import { SubscriptionService } from '@/services/api';
import { syncUserSubscriptionStatus } from '@/services/firebase/userService';
import { useAppStore } from '@/store';

// Theme Context
import { useTheme } from '../../src/providers/ThemeProvider';

export default function UpgradeTabScreen() {
  const { t } = useTranslation();
  const { getBackgroundColor, getTextColor, getSurfaceColor, getBorderColor, isDark } = useTheme();
  const currentUser = useAppStore(state => state.user);

  const handlePlanPress = async (planType: 'vip' | 'gold') => {
    if (!currentUser) {
      Alert.alert(t('common.error'), 'Bitte melde dich an.');
      return;
    }

    try {
      const startedAt = Timestamp.now();
      const expiresAt = Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );

      await SubscriptionService.createSubscription({
        userId: currentUser.uid,
        planId: planType,
        startedAt,
        expiresAt,
        status: 'active',
      });

      await syncUserSubscriptionStatus(currentUser.uid, 'active');

      Alert.alert(t('common.ok'), t('upgrade.purchaseSuccess'));
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(t('common.error'), t('upgrade.purchaseError'));
    }
  };

  const getPlanIcon = (planType: 'vip' | 'gold') => {
    return planType === 'vip' ? 'diamond' : 'star';
  };

  const getPlanColor = (planType: 'vip' | 'gold') => {
    return planType === 'vip' ? '#6B46C1' : '#F59E0B';
  };

  const getPlanGradient = (planType: 'vip' | 'gold') => {
    if (planType === 'vip') {
      return isDark ? '#4C1D95' : '#EDE9FE';
    }
    return isDark ? '#92400E' : '#FEF3C7';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Header Section */}
      <View style={[styles.headerSection, { backgroundColor: getSurfaceColor(), borderBottomColor: getBorderColor() }]}>
        <Text style={[styles.headerTitle, { color: getTextColor('primary') }]}>
          {t('upgrade.choosePlan')}
        </Text>
        <Text style={[styles.headerSubtitle, { color: getTextColor('secondary') }]}>
          Wähle das perfekte Abo für deine Fitness-Ziele
        </Text>
      </View>

      {/* Plans Section */}
      <View style={styles.plansSection}>
        {/* VIP Plan Card */}
        <Card
          variant="elevated"
          pressable
          onPress={() => handlePlanPress('vip')}
          style={{
            ...styles.planCard,
            ...styles.vipCard,
            backgroundColor: getPlanGradient('vip'),
            borderColor: getPlanColor('vip'),
            borderWidth: 2,
          }}
        >
          <View style={styles.planHeader}>
            <View style={[styles.planIconContainer, { backgroundColor: getPlanColor('vip') }]}>
              <Ionicons 
                name={getPlanIcon('vip')} 
                size={32} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.planTitleContainer}>
              <Text style={[styles.planTitle, { color: getPlanColor('vip') }]}>
                {t('upgrade.vip')}
              </Text>
              <Text style={[styles.planPrice, { color: getTextColor('primary') }]}>
                {t('upgrade.vipPrice')}
              </Text>
            </View>
          </View>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={getPlanColor('vip')} />
              <Text style={[styles.featureText, { color: getTextColor('primary') }]}>
                Unbegrenzte Studio-Besuche
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={getPlanColor('vip')} />
              <Text style={[styles.featureText, { color: getTextColor('primary') }]}>
                Premium-Studios inklusive
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={getPlanColor('vip')} />
              <Text style={[styles.featureText, { color: getTextColor('primary') }]}>
                Persönlicher Trainer-Support
              </Text>
            </View>
          </View>

          <View style={styles.planAction}>
            <Ionicons name="chevron-forward" size={24} color={getPlanColor('vip')} />
          </View>
        </Card>

        {/* Gold Plan Card */}
        <Card
          variant="elevated"
          pressable
          onPress={() => handlePlanPress('gold')}
          style={{
            ...styles.planCard,
            ...styles.goldCard,
            backgroundColor: getPlanGradient('gold'),
            borderColor: getPlanColor('gold'),
            borderWidth: 2,
          }}
        >
          <View style={styles.planHeader}>
            <View style={[styles.planIconContainer, { backgroundColor: getPlanColor('gold') }]}>
              <Ionicons 
                name={getPlanIcon('gold')} 
                size={32} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.planTitleContainer}>
              <Text style={[styles.planTitle, { color: getPlanColor('gold') }]}>
                {t('upgrade.gold')}
              </Text>
              <Text style={[styles.planPrice, { color: getTextColor('primary') }]}>
                {t('upgrade.goldPrice')}
              </Text>
            </View>
          </View>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={getPlanColor('gold')} />
              <Text style={[styles.featureText, { color: getTextColor('primary') }]}>
                10 Studio-Besuche pro Monat
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={getPlanColor('gold')} />
              <Text style={[styles.featureText, { color: getTextColor('primary') }]}>
                Standard-Studios
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={getPlanColor('gold')} />
              <Text style={[styles.featureText, { color: getTextColor('primary') }]}>
                Community-Support
              </Text>
            </View>
          </View>

          <View style={styles.planAction}>
            <Ionicons name="chevron-forward" size={24} color={getPlanColor('gold')} />
          </View>
        </Card>
      </View>

      {/* Footer Section */}
      <View style={styles.footerSection}>
        <Text style={[styles.footerText, { color: getTextColor('secondary') }]}>
          Alle Preise verstehen sich inklusive MwSt. Jederzeit kündbar.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Section
  headerSection: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Plans Section
  plansSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  planCard: {
    padding: 20,
    marginBottom: 8,
  },
  vipCard: {
    // Additional VIP-specific styling can be added here
  },
  goldCard: {
    // Additional Gold-specific styling can be added here
  },

  // Plan Header
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  planIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
  },

  // Plan Features
  planFeatures: {
    marginBottom: 20,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },

  // Plan Action
  planAction: {
    alignItems: 'flex-end',
  },

  // Footer Section
  footerSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
