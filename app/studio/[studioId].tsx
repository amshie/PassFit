import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useStudio } from '@/hooks/useStudio';
import { StudioDetails } from '@/components/ui';
import { useAppStore } from '@/store';
import { useUserRealtime, useUserSubscriptionStatus } from '@/hooks/useUser';
import { useHasCheckedInToday, useCreateCheckIn } from '@/hooks/useCheckIn';
import { UserService } from '@/services/api/user.service';
import { Studio } from '@/models/studio';

export default function StudioDetailPage() {
  const { studioId } = useLocalSearchParams<{ studioId: string }>();
  const router = useRouter();

  const currentUser = useAppStore((state) => state.user);
  const { data: userProfile } = useUserRealtime(currentUser?.uid || '');
  const { data: subscriptionStatus } = useUserSubscriptionStatus(currentUser?.uid || '');
  const { data: hasCheckedInToday } = useHasCheckedInToday(
    currentUser?.uid || '',
    studioId
  );
  const checkInMutation = useCreateCheckIn();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (userProfile && studioId) {
      const favorites = ((userProfile as any)?.favoriteStudios || []) as string[];
      setIsFavorite(favorites.includes(studioId));
    }
  }, [userProfile, studioId]);
  
  // Fetch studio data using the existing hook
  const { 
    data: studio, 
    isLoading, 
    error 
  } = useStudio(studioId);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Studio Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingText}>Studio wird geladen...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state - studio not found or error occurred
  if (error || !studio) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Studio Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
          <Text style={styles.errorTitle}>Studio nicht gefunden</Text>
          <Text style={styles.errorMessage}>
            Das angeforderte Studio konnte nicht geladen werden.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Success state - render studio details
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {studio.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Studio Details Component */}
      <StudioDetails
        studio={studio}
        onCheckIn={async (studio: Studio) => {
          if (!currentUser?.uid) return;
          try {
            await checkInMutation.mutateAsync({
              userId: currentUser.uid,
              studioId: studio.studioId,
            });
            Alert.alert('Erfolg', 'Check-in erfolgreich.');
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Check-in fehlgeschlagen';
            Alert.alert('Fehler', message);
          }
        }}
        onFavoriteToggle={async (studio: Studio) => {
          if (!currentUser?.uid) return;
          try {
            const favorites = ((userProfile as any)?.favoriteStudios || []) as string[];
            let updated: string[];
            if (favorites.includes(studio.studioId)) {
              updated = favorites.filter((id) => id !== studio.studioId);
            } else {
              updated = [...favorites, studio.studioId];
            }
            setIsFavorite(updated.includes(studio.studioId));
            await UserService.updateUserProfile(currentUser.uid, {
              favoriteStudios: updated,
            } as any);
          } catch (error) {
            console.error('Favorite toggle error:', error);
          }
        }}
        isFavorite={isFavorite}
        canCheckIn={subscriptionStatus === 'active' && !hasCheckedInToday}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40, // Same width as back button to center title
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
