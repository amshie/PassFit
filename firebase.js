// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';  
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

// Firebase configuration with your actual project values
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY || "AIzaSyD6jusepa71b3CPvap0-IAIBf1ObdLAgc4",
  authDomain: FIREBASE_AUTH_DOMAIN || "fitnesspass-a54cb.firebaseapp.com",
  projectId: FIREBASE_PROJECT_ID || "fitnesspass-a54cb",
  storageBucket: FIREBASE_STORAGE_BUCKET || "fitnesspass-a54cb.firebasestorage.app",
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID || "583767453466",
  appId: FIREBASE_APP_ID || "1:583767453466:web:bc6b02d39a2b94764106a3",
  measurementId: FIREBASE_MEASUREMENT_ID || "G-54844JZSES",
};

// App initialisieren
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

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
