// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD6jusepa71b3CPvap0-IAIBf1ObdLAgc4",
  authDomain: "fitnesspass-a54cb.firebaseapp.com",
  projectId: "fitnesspass-a54cb",
  storageBucket: "fitnesspass-a54cb.firebasestorage.app",
  messagingSenderId: "583767453466",
  appId: "1:583767453466:web:bc6b02d39a2b94764106a3",
  measurementId: "G-54844JZSES"
};
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db   = getFirestore(app);

// Analytics nur, wenn unterstützt
(async () => {
  if (await isSupported()) {
    getAnalytics(app);
  }
})();
