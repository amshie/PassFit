// firebase.web.js - Web-specific Firebase configuration
import Constants from 'expo-constants';

// Get environment variables from Constants.expoConfig.extra for web
const getEnvVar = (key) => {
  return Constants.expoConfig?.extra?.[key];
};

// Firebase configuration for web
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

// For now, use mock services to avoid import.meta issues
// This allows the web app to load and we can implement authentication later
console.log('Using mock Firebase services for web to avoid import.meta issues');

app = { name: 'web-mock' };
auth = {
  currentUser: null,
  signInWithEmailAndPassword: (email, password) => {
    console.log('Mock sign in with email:', email);
    return Promise.resolve({
      user: {
        uid: 'mock-uid',
        email: email,
        displayName: 'Mock User',
        emailVerified: true
      }
    });
  },
  createUserWithEmailAndPassword: (email, password) => {
    console.log('Mock create user with email:', email);
    return Promise.resolve({
      user: {
        uid: 'mock-uid',
        email: email,
        displayName: 'Mock User',
        emailVerified: false
      }
    });
  },
  signOut: () => {
    console.log('Mock sign out');
    return Promise.resolve();
  },
  onAuthStateChanged: (callback) => {
    console.log('Mock auth state changed listener');
    // Simulate no user initially
    setTimeout(() => callback(null), 100);
    return () => {}; // Unsubscribe function
  },
  sendPasswordResetEmail: (email) => {
    console.log('Mock password reset for:', email);
    return Promise.resolve();
  }
};

db = {
  collection: (path) => ({
    doc: (id) => ({
      get: () => {
        console.log('Mock get document:', path, id);
        return Promise.resolve({
          exists: false,
          data: () => null
        });
      },
      set: (data) => {
        console.log('Mock set document:', path, id, data);
        return Promise.resolve();
      },
      update: (data) => {
        console.log('Mock update document:', path, id, data);
        return Promise.resolve();
      },
      delete: () => {
        console.log('Mock delete document:', path, id);
        return Promise.resolve();
      }
    })
  })
};

analytics = null;

export { app, auth, db, analytics };
