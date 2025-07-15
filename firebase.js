//Erweitern: Weitere Hooks für andere Models (Studio, Subscription, etc.) erstellen// firebase.js
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

let app, auth, db, analytics;

if (isWeb) {
  // For web, export mock Firebase services to avoid import.meta issues
  app = { name: 'mock-app' };
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {}
  };
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      })
    })
  };
  analytics = null;
} else {
  // For native platforms, use the actual Firebase configuration
  const { initializeApp } = require('firebase/app');
  const { getFirestore } = require('firebase/firestore');  
  const {
    initializeAuth,
    getReactNativePersistence
  } = require('firebase/auth');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const { getAnalytics, isSupported } = require('firebase/analytics');

  let FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID;
  
  try {
    const env = require('@env');
    FIREBASE_API_KEY = env.FIREBASE_API_KEY;
    FIREBASE_AUTH_DOMAIN = env.FIREBASE_AUTH_DOMAIN;
    FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
    FIREBASE_STORAGE_BUCKET = env.FIREBASE_STORAGE_BUCKET;
    FIREBASE_MESSAGING_SENDER_ID = env.FIREBASE_MESSAGING_SENDER_ID;
    FIREBASE_APP_ID = env.FIREBASE_APP_ID;
    FIREBASE_MEASUREMENT_ID = env.FIREBASE_MEASUREMENT_ID;
  } catch (error) {
    console.warn('Environment variables not available, using defaults');
  }

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
  app = initializeApp(firebaseConfig);

  db = getFirestore(app);

  // Auth mit AsyncStorage-Persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  // Analytics nur, wenn unterstützt
  analytics = null;
  (async () => {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
  })();
}

export { app, auth, db, analytics };
