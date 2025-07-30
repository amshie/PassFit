import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserRealtime, useUserSubscriptionStatus, useUpdateSubscriptionStatus } from '../../hooks';

interface RealtimeSubscriptionTestProps {
  uid: string;
  subscriptionId?: string;
}

/**
 * Test-Komponente zur Demonstration der Echtzeit-Subscription-Status-Updates
 * Diese Komponente zeigt sowohl den vollständigen User als auch nur den subscriptionStatus an
 */
export function RealtimeSubscriptionTest({ uid, subscriptionId }: RealtimeSubscriptionTestProps) {
  // Vollständige User-Daten mit Echtzeit-Updates
  const { data: user, isLoading: userLoading, error: userError } = useUserRealtime(uid);
  
  // Nur subscriptionStatus mit Echtzeit-Updates (optimiert)
  const { data: subscriptionStatus, isLoading: statusLoading } = useUserSubscriptionStatus(uid);
  
  // Mutation zum Testen von Status-Änderungen
  const updateSubscriptionStatus = useUpdateSubscriptionStatus();

  const handleStatusChange = (newStatus: 'active' | 'expired' | 'canceled') => {
    if (!subscriptionId) {
      alert('Subscription ID ist erforderlich für Status-Updates');
      return;
    }

    updateSubscriptionStatus.mutate({
      subscriptionId,
      status: newStatus
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'expired': return '#F44336';
      case 'free': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Echtzeit Subscription Status Test</Text>
      
      {/* Vollständige User-Daten */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vollständige User-Daten (useUserRealtime)</Text>
        {userLoading ? (
          <Text>Lädt User-Daten...</Text>
        ) : userError ? (
          <Text style={styles.error}>Fehler: {userError.message}</Text>
        ) : user ? (
          <View>
            <Text>Name: {user.displayName}</Text>
            <Text>Email: {user.email}</Text>
            <View style={styles.statusContainer}>
              <Text>Status: </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.subscriptionStatus) }]}>
                <Text style={styles.statusText}>{user.subscriptionStatus || 'free'}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>User nicht gefunden</Text>
        )}
      </View>

      {/* Nur Subscription Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nur Subscription Status (useUserSubscriptionStatus)</Text>
        {statusLoading ? (
          <Text>Lädt Status...</Text>
        ) : (
          <View style={styles.statusContainer}>
            <Text>Status: </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscriptionStatus) }]}>
              <Text style={styles.statusText}>{subscriptionStatus || 'free'}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Test-Buttons */}
      {subscriptionId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status-Änderungen testen</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleStatusChange('active')}
              disabled={updateSubscriptionStatus.isPending}
            >
              <Text style={styles.buttonText}>Aktivieren</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#F44336' }]}
              onPress={() => handleStatusChange('expired')}
              disabled={updateSubscriptionStatus.isPending}
            >
              <Text style={styles.buttonText}>Ablaufen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#9E9E9E' }]}
              onPress={() => handleStatusChange('canceled')}
              disabled={updateSubscriptionStatus.isPending}
            >
              <Text style={styles.buttonText}>Kündigen</Text>
            </TouchableOpacity>
          </View>
          
          {updateSubscriptionStatus.isPending && (
            <Text style={styles.loading}>Status wird aktualisiert...</Text>
          )}
          
          {updateSubscriptionStatus.error && (
            <Text style={styles.error}>
              Fehler beim Update: {updateSubscriptionStatus.error.message}
            </Text>
          )}
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Tipp: Öffne diese Komponente in mehreren Tabs/Geräten und ändere den Status. 
          Die Änderungen sollten sofort in allen Instanzen sichtbar werden!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loading: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  error: {
    color: '#F44336',
    marginTop: 5,
  },
  info: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});
