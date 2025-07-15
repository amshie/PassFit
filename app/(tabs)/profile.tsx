// app/(tabs)/profile.tsx - Beispiel für Hook-Integration in Tab-Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// ✅ Hook-Layer für deklaratives User-Management
import { useUser, useUpdateUser, useDeleteUser } from '../../src/hooks/useUser';
// ✅ Centralized Auth Store
import { useAppStore } from '../../src/store';

export default function ProfileTabScreen() {
  const router = useRouter();
  
  // ✅ Use centralized auth store instead of direct Firebase calls with optimized selectors
  const currentUser = useAppStore((state) => state.user);
  const authSignOut = useAppStore((state) => state.signOut);
  const authLoading = useAppStore((state) => state.isLoading);

  // ✅ Hooks - Komponente weiß nur, dass sie User-Daten braucht
  const { data: userProfile, isLoading, error, refetch } = useUser(currentUser?.uid || '');
  const updateUserMutation = useUpdateUser(currentUser?.uid || '');
  const deleteUserMutation = useDeleteUser();

  const handleEditProfile = () => {
    if (currentUser?.uid) {
      router.push(`/profile/${currentUser.uid}`);
    }
  };

  const handleLogout = async () => {
    try {
      // ✅ Use centralized auth store signOut action
      await authSignOut();
      // Navigate to homepage after successful logout
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Fehler', 'Logout fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Account löschen',
      'Möchtest du deinen Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              if (currentUser?.uid) {
                // Delete user profile first
                await deleteUserMutation.mutateAsync(currentUser.uid);
                // Then sign out using centralized auth store
                await authSignOut();
                // Navigate to homepage
                router.replace('/');
              }
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Fehler', 'Account konnte nicht gelöscht werden');
            }
          },
        },
      ]
    );
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>Lade Profildaten...</Text>
      </View>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Fehler beim Laden der Profildaten</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Erneut versuchen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mein Profil</Text>
      </View>

      {/* ✅ User-Daten aus Hook-Layer */}
      <View style={styles.profileCard}>
        <Text style={styles.cardTitle}>Profil-Informationen</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {userProfile?.displayName || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Nicht angegeben'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>E-Mail:</Text>
          <Text style={styles.value}>{userProfile?.email || currentUser?.email || 'Nicht angegeben'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Geschlecht:</Text>
          <Text style={styles.value}>
            {userProfile?.sex === 'M' ? 'Männlich' : userProfile?.sex === 'F' ? 'Weiblich' : 'Nicht angegeben'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Alter:</Text>
          <Text style={styles.value}>{userProfile?.age ? `${userProfile.age} Jahre` : 'Nicht angegeben'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Mitglied seit:</Text>
          <Text style={styles.value}>
            {userProfile?.createdAt 
              ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('de-DE')
              : 'Unbekannt'
            }
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Profil bearbeiten</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutButton, authLoading && styles.disabledButton]} 
          onPress={handleLogout}
          disabled={authLoading}
        >
          {authLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Abmelden</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.deleteButton, deleteUserMutation.isPending && styles.disabledButton]} 
          onPress={handleDeleteAccount}
          disabled={deleteUserMutation.isPending}
        >
          {deleteUserMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.deleteButtonText}>Account löschen</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  profileCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  actionsCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#fca5a5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
