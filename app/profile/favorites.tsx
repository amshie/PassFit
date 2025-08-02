import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/providers/ThemeProvider';

export default function FavoritesScreen() {
  const router = useRouter();
  const { getBackgroundColor, getSurfaceColor, getTextColor, getBorderColor } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={[styles.header, { backgroundColor: getSurfaceColor(), borderBottomColor: getBorderColor() }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={getTextColor('primary')} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: getTextColor('primary') }]}>Favoriten</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.placeholderText, { color: getTextColor('secondary') }]}>Deine gespeicherten Studios und Kurse erscheinen hier.</Text>
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
    justifyContent: 'center',
  },
  placeholderText: { fontSize: 16, textAlign: 'center' },
});
