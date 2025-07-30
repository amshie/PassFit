import React, { useState, useRef} from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../src/services/firebase/config';
import { CheckInService } from '../src/services/api/checkin.service';
import { useUserType } from '../src/hooks/useUserType';
import { UpgradePrompt } from '../src/components/ui/UpgradePrompt';


export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const scanningRef = useRef(false);
  const { isFree } = useUserType();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Check if user is premium before allowing scan
    if (isFree) {
      setShowUpgradePrompt(true);
      return;
    }

    if (scanningRef.current) return;
    scanningRef.current = true;

    // Vorsichtshalber: Frühzeitig beenden, wenn kein gültiger Nutzer
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Fehler', 'Du musst eingeloggt sein.');
      scanningRef.current = false;
      return;
    }

    let payload: any;
    try {
      payload = JSON.parse(data);
    } catch {
      Alert.alert(
        'Ungültiger QR-Code',
        'Der Code ist kein gültiges JSON.',
        [
          {
            text: 'OK',
            onPress: () => {
              scanningRef.current = false;
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }

    if (payload.type !== 'checkin' || typeof payload.studioId !== 'string') {
      Alert.alert(
        'Ungültiger QR-Code',
        'Dies ist kein Check-In-QR.',
        [
          {
            text: 'OK',
            onPress: () => {
              scanningRef.current = false;
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    
    setScanned(true);
    
    try {
      const result = await CheckInService.checkAndCreate({
        userId: user.uid,
        studioId: payload.studioId,
      });

      if (result.alreadyCheckedIn) {
        router.push({
          pathname: '/progress',
          params: { alreadyCheckedIn: 'true' },
        });
      } else {
        router.push({
          pathname: '/progress',
          params: { newCheckIn: 'true' },
        });
      }
    } catch (err: any) {
      Alert.alert('Check-In fehlgeschlagen', err.message);
      scanningRef.current = false;
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
          title: 'QR Scanner',
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
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        {/* Overlay UI separat */}
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

        {scanned && (
          <View style={styles.rescanContainer}>
            <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
              <Text style={styles.rescanButtonText}>Erneut scannen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.backContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={28} color="#007AFF" />
          <Text style={styles.backButtonText}>Zurück zur Check-In Seite</Text>
        </TouchableOpacity>
      </View>

      {/* Upgrade Prompt for Free Users */}
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="QR-Code Check-in"
        description="QR-Code Check-ins sind nur für Premium-Nutzer verfügbar. Upgrade jetzt und erhalte Zugang zu allen exklusiven Features!"
      />
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
    backContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
});