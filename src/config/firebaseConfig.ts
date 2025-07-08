// src/config/firebaseConfig.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// --- WEB SDK (PWA) ---
import { initializeApp as initWebApp, FirebaseOptions } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import {
  getFirestore as initWebFirestore,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence
} from 'firebase/firestore';

// --- NATIVE SDK (Mobile) ---
import appNative from '@react-native-firebase/app';
import authNative from '@react-native-firebase/auth';
import firestoreNative from '@react-native-firebase/firestore';

// Types for return values
export type WebAppType   = ReturnType<typeof initWebApp>;
export type WebAuthType  = ReturnType<typeof initializeAuth>;
export type WebDbType    = ReturnType<typeof initWebFirestore>;

export type NativeAppType  = ReturnType<typeof appNative.app>;
export type NativeAuthType = ReturnType<typeof authNative>;
export type NativeDbType   = ReturnType<typeof firestoreNative>;

const isWeb = Platform.OS === 'web';

let firebaseApp: WebAppType | NativeAppType;
let firebaseAuth: WebAuthType | NativeAuthType;
let firebaseDb: WebDbType | NativeDbType;

if (isWeb) {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

  const webConfig: FirebaseOptions = {
    apiKey: extra.FIREBASE_API_KEY,
    authDomain: extra.FIREBASE_AUTH_DOMAIN,
    projectId: extra.FIREBASE_PROJECT_ID,
    storageBucket: extra.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: extra.FIREBASE_APP_ID,
    measurementId: extra.FIREBASE_MEASUREMENT_ID,
  };

  // Web initialization
  firebaseApp  = initWebApp(webConfig);
  firebaseAuth = initializeAuth(firebaseApp, { persistence: indexedDBLocalPersistence });
  firebaseDb   = initWebFirestore(firebaseApp);

  // Enable offline persistence
  enableIndexedDbPersistence(firebaseDb).catch(err => {
    console.warn('Firestore persistence could not be enabled:', err);
  });
  // Enable multi-tab synchronization
  enableMultiTabIndexedDbPersistence(firebaseDb).catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open – only one can have persistence enabled.');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser does not support all features required for multi-tab persistence.');
    }
  });
} else {
  // Native initialization (iOS/Android)
  firebaseApp  = appNative.app();                // default FirebaseApp instance
  firebaseAuth = authNative(firebaseApp);        // FirebaseAuth instance for the app
  firebaseDb   = firestoreNative(firebaseApp);   // FirebaseFirestore instance for the app
}

export { firebaseApp, firebaseAuth, firebaseDb };
