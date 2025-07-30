// src/components/account/BillingHistorySection/BillingHistorySection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Types
import { User } from '../../../models/users';
import { Payment } from '../../../models/payment';

interface BillingHistorySectionProps {
  userProfile: User | null;
}

// Mock billing data - in real app, this would come from a hook
const mockBillingHistory: Payment[] = [
  {
    paymentId: 'pay_1',
    userId: 'user_123',
    subscriptionId: 'sub_123',
    amountCents: 2999,
    currency: 'EUR',
    status: 'success',
    processedAt: { toDate: () => new Date('2024-01-15') } as any,
  },
  {
    paymentId: 'pay_2',
    userId: 'user_123',
    subscriptionId: 'sub_123',
    amountCents: 2999,
    currency: 'EUR',
    status: 'success',
    processedAt: { toDate: () => new Date('2023-12-15') } as any,
  },
  {
    paymentId: 'pay_3',
    userId: 'user_123',
    subscriptionId: 'sub_123',
    amountCents: 2999,
    currency: 'EUR',
    status: 'failed',
    processedAt: { toDate: () => new Date('2023-11-15') } as any,
  },
];

export function BillingHistorySection({ userProfile: _userProfile }: BillingHistorySectionProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [billingHistory] = useState<Payment[]>(mockBillingHistory);

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

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return t('account.billing.paid');
      case 'pending':
        return t('account.billing.pending');
      case 'failed':
        return t('account.billing.failed');
      default:
        return status;
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement PDF download functionality
      // const pdfUrl = await InvoiceService.generateInvoicePDF(paymentId);
      // await Linking.openURL(pdfUrl);
      
      // Mock download
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        t('common.ok'),
        `Rechnung für ${paymentId} wird heruntergeladen...`
      );
    } catch (error) {
      console.error('Download invoice error:', error);
      Alert.alert(
        t('common.error'),
        t('account.billing.downloadError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderBillingItem = ({ item }: { item: Payment }) => (
    <View style={styles.billingItem}>
      <View style={styles.billingItemLeft}>
        <View style={styles.billingInfo}>
          <Text style={styles.invoiceText}>
            {t('account.billing.invoice')} #{item.paymentId.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(item.processedAt)}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            {formatPrice(item.amountCents, item.currency)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
      </View>
      
      {item.status === 'success' && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownloadInvoice(item.paymentId)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#6B46C1" />
          ) : (
            <Ionicons name="download-outline" size={20} color="#6B46C1" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('account.billing.title')}</Text>

      {billingHistory.length > 0 ? (
        <View style={styles.billingCard}>
          {billingHistory.map((item, index) => (
            <View key={item.paymentId}>
              {renderBillingItem({ item })}
              {index < billingHistory.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noBillingCard}>
          <Ionicons name="receipt-outline" size={48} color="#6B7280" />
          <Text style={styles.noBillingTitle}>{t('account.billing.noHistory')}</Text>
          <Text style={styles.noBillingText}>
            Ihre Rechnungen werden hier angezeigt, sobald Sie ein Abonnement abschließen.
          </Text>
        </View>
      )}
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

  // Billing Card
  billingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  billingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  billingItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billingInfo: {
    flex: 1,
  },
  invoiceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: -20,
  },

  // No Billing History
  noBillingCard: {
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
  noBillingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noBillingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
