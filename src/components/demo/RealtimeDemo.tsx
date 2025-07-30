import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hooks
import { useUserRealtime, useUserSubscriptionStatus } from '../../hooks/useUser';
import { useUpdateSubscriptionStatus, useCreateSubscription } from '../../hooks/useSubscription';

// Store
import { useAppStore } from '../../store';

// Firebase
import { Timestamp } from 'firebase/firestore';

interface RealtimeDemoProps {
  testUserId?: string;
}

/**
 * Demo component to showcase real-time subscription status updates
 * This component demonstrates the real-time functionality across multiple browser tabs
 */
export function RealtimeDemo({ testUserId }: RealtimeDemoProps) {
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  
  // Get current user from store or use test user
  const currentUser = useAppStore((state) => state.user);
  const userId = testUserId || currentUser?.uid || '';

  // Real-time hooks
  const { data: user, isLoading: userLoading, error: userError } = useUserRealtime(userId);
  const { data: subscriptionStatus, isLoading: statusLoading } = useUserSubscriptionStatus(userId);

  // Mutations
  const updateSubscriptionStatus = useUpdateSubscriptionStatus();
  const createSubscription = useCreateSubscription();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'expired': return '#EF4444';
      case 'free': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'expired': return 'time-outline';
      case 'free': return 'person-outline';
      default: return 'help-circle-outline';
    }
  };

  const handleCreateTestSubscription = async () => {
    if (!userId) {
      Alert.alert('Fehler', 'Keine Benutzer-ID verfügbar');
      return;
    }

    setIsCreatingSubscription(true);
    try {
      await createSubscription.mutateAsync({
        userId,
        planId: 'premium-monthly',
        status: 'active',
        startedAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      });

      Alert.alert(
        'Erfolg! 🎉',
        'Test-Abonnement wurde erstellt. Der Status sollte sich sofort in allen geöffneten Tabs aktualisieren!'
      );
    } catch (error) {
      console.error('Error creating test subscription:', error);
      Alert.alert('Fehler', 'Fehler beim Erstellen des Test-Abonnements');
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'expired' | 'canceled') => {
    // This would require a subscription ID in a real scenario
    // For demo purposes, we'll show what would happen
    Alert.alert(
      'Demo-Modus',
      `In einer echten App würde der Status jetzt auf "${newStatus}" geändert werden und sich sofort in allen Tabs aktualisieren.`
    );
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Ionicons name="warning-outline" size={48} color="#F59E0B" />
          <Text style={styles.errorTitle}>Keine Benutzer-ID</Text>
          <Text style={styles.errorText}>
            Bitte melden Sie sich an, um die Echtzeit-Demo zu verwenden.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="flash" size={32} color="#6B46C1" />
        <Text style={styles.title}>Echtzeit Subscription Demo</Text>
        <Text style={styles.subtitle}>
          Öffnen Sie diese Seite in mehreren Browser-Tabs und beobachten Sie die sofortigen Updates!
        </Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 Benutzer-Informationen</Text>
        {userLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6B46C1" />
            <Text style={styles.loadingText}>Lade Benutzerdaten...</Text>
          </View>
        ) : userError ? (
          <Text style={styles.errorText}>Fehler: {userError.message}</Text>
        ) : user ? (
          <View>
            <Text style={styles.infoText}>Name: {user.displayName}</Text>
            <Text style={styles.infoText}>Email: {user.email}</Text>
            <Text style={styles.infoText}>UID: {user.uid}</Text>
          </View>
        ) : (
          <Text style={styles.errorText}>Benutzer nicht gefunden</Text>
        )}
      </View>

      {/* Real-time Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Echtzeit-Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Vollständige Daten (useUserRealtime):</Text>
            {userLoading ? (
              <ActivityIndicator size="small" color="#6B46C1" />
            ) : (
              <View style={styles.statusBadge}>
                <Ionicons 
                  name={getStatusIcon(user?.subscriptionStatus)} 
                  size={16} 
                  color={getStatusColor(user?.subscriptionStatus)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(user?.subscriptionStatus) }]}>
                  {user?.subscriptionStatus || 'free'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Nur Status (useUserSubscriptionStatus):</Text>
            {statusLoading ? (
              <ActivityIndicator size="small" color="#6B46C1" />
            ) : (
              <View style={styles.statusBadge}>
                <Ionicons 
                  name={getStatusIcon(subscriptionStatus)} 
                  size={16} 
                  color={getStatusColor(subscriptionStatus)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(subscriptionStatus) }]}>
                  {subscriptionStatus || 'free'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Demo Actions Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎮 Demo-Aktionen</Text>
        <Text style={styles.cardDescription}>
          Testen Sie die Echtzeit-Updates, indem Sie den Status ändern:
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => handleStatusChange('active')}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Aktivieren</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
            onPress={() => handleStatusChange('expired')}
          >
            <Ionicons name="time" size={20} color="white" />
            <Text style={styles.actionButtonText}>Ablaufen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#6B7280' }]}
            onPress={() => handleStatusChange('canceled')}
          >
            <Ionicons name="close-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Kündigen</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isCreatingSubscription && styles.disabledButton]}
          onPress={handleCreateTestSubscription}
          disabled={isCreatingSubscription}
        >
          {isCreatingSubscription ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.createButtonText}>Test-Abonnement erstellen</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Instructions Card */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 Anweisungen zum Testen</Text>
        <View style={styles.instructionsList}>
          <Text style={styles.instructionItem}>
            1. Öffnen Sie diese Seite in mehreren Browser-Tabs
          </Text>
          <Text style={styles.instructionItem}>
            2. Klicken Sie auf eine der Demo-Aktionen oben
          </Text>
          <Text style={styles.instructionItem}>
            3. Beobachten Sie, wie sich der Status sofort in allen Tabs ändert
          </Text>
          <Text style={styles.instructionItem}>
            4. Keine manuellen Reloads erforderlich! ⚡
          </Text>
        </View>
      </View>

      {/* Technical Info Card */}
      <View style={styles.techCard}>
        <Text style={styles.techTitle}>🔧 Technische Details</Text>
        <Text style={styles.techText}>
          • <Text style={styles.techBold}>Firestore Listener:</Text> onSnapshot() für Echtzeit-Updates{'\n'}
          • <Text style={styles.techBold}>React Query:</Text> Automatische Cache-Invalidierung{'\n'}
          • <Text style={styles.techBold}>Cloud Function:</Text> Automatische Synchronisation{'\n'}
          • <Text style={styles.techBold}>Security Rules:</Text> Schutz vor direkten Client-Writes
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },

  // Status
  statusContainer: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },

  // Actions
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },

  // Instructions
  instructionsCard: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },

  // Technical Info
  techCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  techTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  techText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  techBold: {
    fontWeight: '600',
  },

  // Loading and Error
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorCard: {
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
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});
