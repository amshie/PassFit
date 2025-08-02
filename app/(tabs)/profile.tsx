// app/(tabs)/profile.tsx - German Profile Page Design
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// ✅ Hook-Layer für deklaratives User-Management
import { useUserRealtime, useUserSubscriptionStatus } from '../../src/hooks/useUser';
import { useActiveUserSubscription } from '../../src/hooks/useSubscription';
// ✅ Centralized Auth Store
import { useAppStore } from '../../src/store';
// ✅ Theme Context
import { useTheme } from '../../src/providers/ThemeProvider';
// ✅ Services
import { UserService } from '../../src/services/api/user.service';

export default function ProfileTabScreen() {
  const router = useRouter();
  
  // ✅ Use centralized auth store
  const currentUser = useAppStore((state) => state.user);
  const authSignOut = useAppStore((state) => state.signOut);
  const authLoading = useAppStore((state) => state.isLoading);

  // ✅ Theme context
  const { getBackgroundColor, getTextColor, getSurfaceColor, getBorderColor, isDark } = useTheme();

  // ✅ Hooks - User data and subscription with real-time updates
  const { data: userProfile, isLoading, error, refetch } = useUserRealtime(currentUser?.uid || '');
  const { data: subscriptionStatus, isLoading: subscriptionLoading } = useUserSubscriptionStatus(currentUser?.uid || '');
  const { data: activeSubscription } = useActiveUserSubscription(currentUser?.uid || '');

  const handleAvatarPress = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Berechtigung erforderlich', 'Zugriff auf die Fotobibliothek wird benötigt.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && currentUser?.uid) {
        const uri = result.assets[0].uri;
        await UserService.updateUserProfile(currentUser.uid, { photoURL: uri });
      }
    } catch (err) {
      console.error('Avatar update error:', err);
      Alert.alert('Fehler', 'Profilbild konnte nicht aktualisiert werden.');
    }
  };

  const handleMenuPress = (menuItem: string) => {
    switch (menuItem) {
      case 'account':
        router.push('/account');
        break;
      case 'favorites':
        router.push('/profile/favorites');
        break;
      case 'referral':
        router.push('/profile/referral');
        break;
      case 'settings':
        router.push('/profile/settings');
        break;
      default:
        break;
    }
  };

  const getMembershipStatusText = () => {
    if (subscriptionLoading) return 'Lade Status...';
    
    // Use real-time subscriptionStatus from user document
    switch (subscriptionStatus) {
      case 'active':
        return 'Aktives Mitglied';
      case 'expired':
        return 'Mitgliedschaft abgelaufen';
      case 'free':
      default:
        return 'Kostenlose Mitgliedschaft';
    }
  };

  const getMembershipStatusColor = () => {
    // Use real-time subscriptionStatus from user document
    switch (subscriptionStatus) {
      case 'active':
        return '#10B981'; // Green
      case 'expired':
        return '#EF4444'; // Red
      case 'free':
      default:
        return '#6B7280'; // Gray
    }
  };

  const getDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return 'Amer Dvd'; // Default fallback as specified
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: getBackgroundColor() }]}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={[styles.loadingText, { color: getTextColor('secondary') }]}>Lade Profildaten...</Text>
      </View>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: getBackgroundColor() }]}>
        <Text style={[styles.errorText, { color: getTextColor('primary') }]}>Fehler beim Laden der Profildaten</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Erneut versuchen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Header Area (Kopfbereich) */}
      <View style={[styles.headerSection, { backgroundColor: getSurfaceColor(), borderBottomColor: getBorderColor() }]}>
        {/* Avatar Placeholder */}
        <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
          {userProfile?.photoURL ? (
            <Image
              source={{ uri: userProfile.photoURL }}
              style={[styles.avatarImage, { borderColor: getBorderColor() }]}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {
                  backgroundColor: isDark ? '#374151' : '#F3F4F6',
                  borderColor: getBorderColor(),
                },
              ]}
            >
              <Ionicons name="camera" size={32} color={getTextColor('secondary')} />
            </View>
          )}
        </TouchableOpacity>

        {/* Username */}
        <Text style={[styles.username, { color: getTextColor('primary') }]}>{getDisplayName()}</Text>

        {/* Membership Status */}
        <View style={[styles.membershipContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB' }]}>
          <View style={[styles.statusIndicator, { backgroundColor: getMembershipStatusColor() }]} />
          <Text style={[styles.membershipStatus, { color: getMembershipStatusColor() }]}>
            {getMembershipStatusText()}
          </Text>
        </View>
      </View>

      {/* Menu List */}
      <View style={[styles.menuSection, { backgroundColor: getSurfaceColor() }]}>
        {/* Konto */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: getBorderColor() }]} 
          onPress={() => handleMenuPress('account')}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB' }]}>
              <Ionicons name="person-outline" size={24} color="#6B46C1" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: getTextColor('primary') }]}>Konto</Text>
              <Text style={[styles.menuSubtitle, { color: getTextColor('secondary') }]}>Persönliche Daten und Abos</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getTextColor('secondary')} />
        </TouchableOpacity>

        {/* Favoriten */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: getBorderColor() }]} 
          onPress={() => handleMenuPress('favorites')}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB' }]}>
              <Ionicons name="heart-outline" size={24} color="#EF4444" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: getTextColor('primary') }]}>Favoriten 0</Text>
              <Text style={[styles.menuSubtitle, { color: getTextColor('secondary') }]}>Gespeicherte Studios oder Kurse</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getTextColor('secondary')} />
        </TouchableOpacity>

        {/* Weitersagen */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: getBorderColor() }]} 
          onPress={() => handleMenuPress('referral')}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB' }]}>
              <Ionicons name="gift-outline" size={24} color="#F59E0B" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: getTextColor('primary') }]}>Weitersagen, 30 € absahnen 🎁</Text>
              <Text style={[styles.menuSubtitle, { color: getTextColor('secondary') }]}>Empfehlungsprogramm mit Bonus</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getTextColor('secondary')} />
        </TouchableOpacity>

        {/* Einstellungen */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: getBorderColor() }]} 
          onPress={() => handleMenuPress('settings')}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB' }]}>
              <Ionicons name="settings-outline" size={24} color={getTextColor('secondary')} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: getTextColor('primary') }]}>Einstellungen</Text>
              <Text style={[styles.menuSubtitle, { color: getTextColor('secondary') }]}>Sprache, Datenschutz, Benachrichtigungen</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={getTextColor('secondary')} />
        </TouchableOpacity>
      </View>

      {/* Debug/Admin Actions (can be removed in production) */}
      <View style={styles.debugSection}>
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            authLoading && styles.disabledButton,
            { backgroundColor: isDark ? '#4B5563' : '#6B7280' }
          ]} 
          onPress={async () => {
            try {
              await authSignOut();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Fehler', 'Logout fehlgeschlagen. Bitte versuche es erneut.');
            }
          }}
          disabled={authLoading}
        >
          {authLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Abmelden</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header Section (Kopfbereich)
  headerSection: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  membershipStatus: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Menu Section
  menuSection: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
  },

  // Debug Section
  debugSection: {
    marginTop: 32,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },

  // Loading and Error States
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
