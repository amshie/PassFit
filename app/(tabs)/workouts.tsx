import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Theme
import { useTheme } from '../../src/providers/ThemeProvider';

export default function WorkoutsTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = permission?.granted;
  const { getBackgroundColor, getSurfaceColor, getTextColor, getBorderColor, isDark } = useTheme();

  const handleScanPress = () => {
    if (isPermissionGranted) {
      router.push('/scanner');
    } else {
      requestPermission();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Screen options={{ title: "Check In", headerShown: false }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="qr-code-outline" size={60} color="#007AFF" />
          <Text style={[styles.title, { color: getTextColor('primary') }]}>Check In</Text>
          <Text style={[styles.subtitle, { color: getTextColor('secondary') }]}>Scannen Sie QR-Codes für Ihre Trainingseinheiten</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={[styles.scanSection, { backgroundColor: getSurfaceColor() }]}>
            <View style={styles.scanIconContainer}>
              <Ionicons name="qr-code-outline" size={80} color="#007AFF" />
            </View>
            
            <Text style={[styles.scanTitle, { color: getTextColor('primary') }]}>QR-Code Scanner</Text>
            <Text style={[styles.scanDescription, { color: getTextColor('secondary') }]}>
              Scannen Sie den QR-Code an Ihrem Trainingsgerät, um Ihr Workout zu starten
            </Text>

            {!isPermissionGranted && (
              <View style={[styles.permissionContainer, { backgroundColor: isDark ? '#4B1F1F' : '#FFF5F5' }]}>
                <Ionicons name="camera-outline" size={24} color="#FF6B6B" />
                <Text style={styles.permissionText}>
                  Kamera-Berechtigung erforderlich
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.scanButton,
                { opacity: !isPermissionGranted ? 0.7 : 1 }
              ]}
              onPress={handleScanPress}
            >
              <Ionicons 
                name={isPermissionGranted ? "scan-outline" : "camera-outline"} 
                size={24} 
                color="white" 
              />
              <Text style={styles.scanButtonText}>
                {isPermissionGranted ? "QR-Code scannen" : "Kamera-Berechtigung erteilen"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.infoSection, { backgroundColor: getSurfaceColor() }]}>
            <Text style={[styles.infoTitle, { color: getTextColor('primary') }]}>So funktioniert's:</Text>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={[styles.infoText, { color: getTextColor('secondary') }]}>QR-Code am Trainingsgerät finden</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={[styles.infoText, { color: getTextColor('secondary') }]}>Scanner öffnen und Code scannen</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={[styles.infoText, { color: getTextColor('secondary') }]}>Workout automatisch starten</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  mainContent: {
    flex: 1,
  },
  scanSection: {
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanIconContainer: {
    marginBottom: 20,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scanDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  permissionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  permissionText: {
    color: "#FF6B6B",
    marginLeft: 8,
    fontSize: 14,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoSection: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
});


