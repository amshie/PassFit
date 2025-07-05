// firebase.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';
console.log('🔑 FIREBASE_API_KEY =', FIREBASE_API_KEY);
const firebaseConfig = {
  apiKey:             FIREBASE_API_KEY,
  authDomain:         FIREBASE_AUTH_DOMAIN,
  projectId:          FIREBASE_PROJECT_ID,
  storageBucket:      FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  FIREBASE_MESSAGING_SENDER_ID,
  appId:              FIREBASE_APP_ID,
  measurementId:      FIREBASE_MEASUREMENT_ID,
};

// App initialisieren
export const app = initializeApp(firebaseConfig);

// Auth mit AsyncStorage-Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Analytics nur, wenn unterstützt
export let analytics = null;
(async () => {
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
})();
