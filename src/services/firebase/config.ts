import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

let app: any;
let auth: any;
let analytics: any;
let db: any;
let storage: any;

try {
  // Import Firebase services from the main firebase.js configuration
  const firebase = require('../../../firebase');
  
  app = firebase.app;
  auth = firebase.auth;
  analytics = firebase.analytics;
  db = firebase.db;
  
  // Initialize storage - use standard Firebase Storage for both web and native
  try {
    const { getStorage } = require('firebase/storage');
    storage = getStorage(app);
  } catch (storageError) {
    console.warn('Firebase Storage not available:', storageError);
    storage = { 
      ref: () => ({
        put: () => Promise.reject(new Error('Firebase Storage not initialized')),
        putFile: () => Promise.reject(new Error('Firebase Storage not initialized')),
        getDownloadURL: () => Promise.reject(new Error('Firebase Storage not initialized'))
      })
    };
  }
} catch (error) {
  console.error('Failed to initialize Firebase services:', error);
  
  // Fallback to minimal mock services only if Firebase completely fails
  app = { name: 'fallback-app' };
  auth = { 
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    signOut: () => Promise.reject(new Error('Firebase not initialized')),
    onAuthStateChanged: () => () => {},
    signInWithCredential: () => Promise.reject(new Error('Firebase not initialized'))
  };
  analytics = null;
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
  storage = { 
    ref: () => ({
      put: () => Promise.reject(new Error('Firebase not initialized')),
      putFile: () => Promise.reject(new Error('Firebase not initialized')),
      getDownloadURL: () => Promise.reject(new Error('Firebase not initialized'))
    })
  };
}

export { app, auth, analytics, db, storage };
