// src/config/firebaseConfig.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isWeb = Platform.OS === 'web';

let firebaseApp: any;
let firebaseAuth: any;
let firebaseDb: any;

try {
  // Import Firebase services from the main firebase.js configuration
  const { app, auth, db } = require('../../firebase');
  
  firebaseApp = app;
  firebaseAuth = auth;
  firebaseDb = db;
} catch (error) {
  console.error('Failed to initialize Firebase config:', error);
  
  // Fallback to minimal services only if Firebase completely fails
  firebaseApp = { name: 'fallback-app' };
  firebaseAuth = { 
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    signOut: () => Promise.reject(new Error('Firebase not initialized')),
    onAuthStateChanged: () => () => {}
  };
  firebaseDb = { 
    collection: () => ({ 
      doc: () => ({
        get: () => Promise.reject(new Error('Firebase not initialized')),
        set: () => Promise.reject(new Error('Firebase not initialized')),
        update: () => Promise.reject(new Error('Firebase not initialized')),
        delete: () => Promise.reject(new Error('Firebase not initialized'))
      }) 
    }) 
  };
}

export { firebaseApp, firebaseAuth, firebaseDb };
