// firebase.js
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

if (isWeb) {
  // For web, use the web-specific Firebase configuration
  module.exports = require('./firebase.web.js');
} else {
  // For Expo managed workflow, use the standard Firebase SDK with proper configuration
  const Constants = require('expo-constants').default;
  
  // Get environment variables from Constants or fallback to defaults
  const getEnvVar = (key) => {
    try {
      return Constants.expoConfig?.extra?.[key] || Constants.manifest?.extra?.[key];
    } catch (error) {
      return null;
    }
  };

  // Firebase configuration with environment variables or defaults
  const firebaseConfig = {
    apiKey: getEnvVar('FIREBASE_API_KEY') || "AIzaSyD6jusepa71b3CPvap0-IAIBf1ObdLAgc4",
    authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || "fitnesspass-a54cb.firebaseapp.com",
    projectId: getEnvVar('FIREBASE_PROJECT_ID') || "fitnesspass-a54cb",
    storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || "fitnesspass-a54cb.firebasestorage.app",
    messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || "583767453466",
    appId: getEnvVar('FIREBASE_APP_ID') || "1:583767453466:web:bc6b02d39a2b94764106a3",
    measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID') || "G-54844JZSES",
  };

  let app, auth, db, analytics;

  try {
    // For Expo managed workflow, use the standard Firebase SDK
    const { initializeApp, getApps } = require('firebase/app');
    const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');  
    const {
      getAuth,
      initializeAuth,
      getReactNativePersistence
    } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const { getAnalytics, isSupported } = require('firebase/analytics');

    // Initialize Firebase for native (only if not already initialized)
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);

    // Initialize Auth with AsyncStorage persistence for native
    try {
      auth = getAuth(app);
    } catch (authError) {
      // If getAuth fails, try initializeAuth with persistence
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }

    // Analytics for native (if supported)
    analytics = null;
    (async () => {
      try {
        if (await isSupported()) {
          analytics = getAnalytics(app);
        }
      } catch (error) {
        console.warn('Analytics not supported:', error);
      }
    })();

    console.log('Firebase initialized successfully for Expo managed workflow');
  } catch (error) {
    console.error('Failed to initialize Firebase for native:', error);
    
    // Fallback services with proper error handling
    app = { 
      name: 'native-fallback',
      options: firebaseConfig,
      utils: () => ({})
    };
    auth = { 
      currentUser: null,
      signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
      createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
      signOut: () => Promise.reject(new Error('Firebase not initialized')),
      onAuthStateChanged: () => () => {},
      signInWithCredential: () => Promise.reject(new Error('Firebase not initialized'))
    };
    db = { 
      collection: () => ({ 
        doc: () => ({
          get: () => Promise.reject(new Error('Firebase not initialized')),
          set: () => Promise.reject(new Error('Firebase not initialized')),
          update: () => Promise.reject(new Error('Firebase not initialized')),
          delete: () => Promise.reject(new Error('Firebase not initialized'))
        }) 
      }) 
    };
    analytics = null;
  }

  module.exports = { app, auth, db, analytics };
}
