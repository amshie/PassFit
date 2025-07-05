import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QRScannerService, QRScanResult } from '../src/services/qr-scanner.service';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);

    // Validate QR code
    if (!QRScannerService.isValidQRCode(data)) {
      Alert.alert(
        'Ungültiger QR-Code',
        'Der gescannte Code ist nicht gültig oder unterstützt.',
        [
          {
            text: 'Erneut scannen',
            onPress: () => setScanned(false),
          },
          {
            text: 'Zurück',
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }

    // Process QR code
    const scanResult: QRScanResult = {
      type,
      data,
      timestamp: new Date(),
    };

    try {
      const workoutData = await QRScannerService.processQRCode(scanResult);
      
      if (workoutData) {
        // Show workout confirmation
        Alert.alert(
          'Trainingsgerät erkannt!',
          `Gerät: ${workoutData.equipmentName}\nTyp: ${workoutData.workoutType}\nID: ${workoutData.equipmentId}`,
          [
            {
              text: 'Abbrechen',
              style: 'cancel',
              onPress: () => setScanned(false),
            },
            {
              text: 'Workout starten',
              onPress: async () => {
                const success = await QRScannerService.startWorkoutSession(workoutData);
                if (success) {
                  router.back();
                } else {
                  setScanned(false);
                }
              },
            },
          ]
        );
      } else {
        // Unknown QR code format
        Alert.alert(
          'QR-Code nicht erkannt',
          `Der gescannte Code konnte nicht als Trainingsgerät identifiziert werden.\n\nInhalt: ${data}`,
          [
            {
              text: 'Erneut scannen',
              onPress: () => setScanned(false),
            },
            {
              text: 'Zurück',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Fehler beim Verarbeiten',
        'Der QR-Code konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
        [
          {
            text: 'Erneut scannen',
            onPress: () => setScanned(false),
          },
          {
            text: 'Zurück',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Kamera-Berechtigung wird geladen...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Scanner", headerShown: true }} />
        <Text style={styles.text}>Kamera-Zugriff erforderlich</Text>
        <Text style={styles.subText}>
          Diese App benötigt Zugriff auf die Kamera, um QR-Codes zu scannen.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Berechtigung erteilen</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "QR Scanner", 
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'aztec', 'ean13', 'ean8', 'upc_e', 'datamatrix', 'code128', 'code39', 'codabar', 'itf14', 'upc_a'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.middleContainer}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                <View style={styles.scannerFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>
              <View style={styles.unfocusedContainer}></View>
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Richten Sie die Kamera auf einen QR-Code
            </Text>
          </View>
        </CameraView>
      </View>

      {scanned && (
        <View style={styles.rescanContainer}>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanButtonText}>Erneut scannen</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  rescanContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  rescanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
