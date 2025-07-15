// src/config/firebaseConfig.ts
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

let firebaseApp: any;
let firebaseAuth: any;
let firebaseDb: any;

if (isWeb) {
  // For web, use a simple mock configuration to avoid import.meta issues
  firebaseApp = {
    name: 'mock-app',
    options: {}
  };
  firebaseAuth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {}
  };
  firebaseDb = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      })
    })
  };
} else {
  // For native platforms, use the actual Firebase config
  try {
    const { app, auth, db } = require('../../firebase');
    firebaseApp = app;
    firebaseAuth = auth;
    firebaseDb = db;
  } catch (error) {
    console.warn('Firebase native config not available:', error);
    // Fallback to mock for development
    firebaseApp = { name: 'fallback-app' };
    firebaseAuth = { currentUser: null };
    firebaseDb = { collection: () => ({ doc: () => ({}) }) };
  }
}

export { firebaseApp, firebaseAuth, firebaseDb };
