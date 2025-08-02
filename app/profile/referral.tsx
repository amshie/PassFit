import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/providers/ThemeProvider';
import { useAppStore } from '../../src/store';

export default function ReferralScreen() {
  const router = useRouter();
  const currentUser = useAppStore(state => state.user);
  const { getBackgroundColor, getSurfaceColor, getTextColor, getBorderColor } = useTheme();

  const referralCode = useMemo(() => currentUser?.uid?.slice(0,8) || 'CODE1234', [currentUser]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Tritt PassFit bei und nutze meinen Code ${referralCode}!`,
      });
    } catch (err) {
      console.error('Share error', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}> 
      <View style={[styles.header, { backgroundColor: getSurfaceColor(), borderBottomColor: getBorderColor() }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={getTextColor('primary')} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: getTextColor('primary') }]}>Weitersagen</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.placeholderText, { color: getTextColor('secondary') }]}>Teile den Code mit deinen Freunden und erhalte einen Bonus.</Text>
        <View style={[styles.codeContainer, { borderColor: getBorderColor() }]}> 
          <Text style={[styles.codeText, { color: getTextColor('primary') }]}>{referralCode}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Teilen</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSpacer: { width: 40 },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  placeholderText: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  codeContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  codeText: { fontSize: 24, fontWeight: 'bold' },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
