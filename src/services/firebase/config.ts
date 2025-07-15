import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

let app: any;
let auth: any;
let analytics: any;
let db: any;
let storage: any;

if (isWeb) {
  // For web, use mock Firebase services to avoid import.meta issues
  app = { name: 'mock-app' };
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {}
  };
  analytics = null;
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
  storage = {
    ref: () => ({
      put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } })
    })
  };
} else {
  // For native platforms, use the actual Firebase configuration
  try {
    const firebase = require('../../../firebase');
    const { getFirestore } = require('firebase/firestore');
    const { getStorage } = require('firebase/storage');
    
    app = firebase.app;
    auth = firebase.auth;
    analytics = firebase.analytics;
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase native config not available:', error);
    // Fallback to mock for development
    app = { name: 'fallback-app' };
    auth = { currentUser: null };
    analytics = null;
    db = { collection: () => ({ doc: () => ({}) }) };
    storage = { ref: () => ({}) };
  }
}

export { app, auth, analytics, db, storage };
