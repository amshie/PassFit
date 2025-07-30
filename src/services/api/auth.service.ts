import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { auth, db } from '../firebase/config';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
} from '@/types';

// Import Firebase functions - use standard Firebase SDK for both web and native
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Conditionally import GoogleSignin only when needed
let GoogleSignin: any = null;
let isGoogleSignInModuleAvailable = false;

try {
  if (Platform.OS !== 'web') {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    isGoogleSignInModuleAvailable = true;
  }
} catch (error) {
  console.warn('Google Sign-in module not available - likely running in Expo Go:', error);
  GoogleSignin = null;
  isGoogleSignInModuleAvailable = false;
}

export class AuthService {
  /**
   * Sign in with email/phone and password
   */
  static async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      const email = credentials.email || credentials.phone;
      if (!email) {
        throw new Error('E-Mail oder Telefonnummer ist erforderlich');
      }

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        credentials.password
      );
      return this.getUserProfile(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user with email and password
   */
  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });
      await sendEmailVerification(userCredential.user);
      return this.createUserProfile(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send email verification
   */
  static async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }
      await sendEmailVerification(user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Check if Google Sign-in is available
   */
  static isGoogleSignInAvailable(): boolean {
    if (Platform.OS === 'web') {
      return true; // Web Google Sign-in is always available
    }
    return isGoogleSignInModuleAvailable && GoogleSignin !== null;
  }

  /**
   * Initialize Google Sign-In
   */
  static initializeGoogleSignIn(): void {
    // For Expo managed workflow, Google Sign-in is handled differently
    if (Platform.OS === 'web') {
      // Web initialization is handled in signInWithGoogle method
      return;
    } else {
      // Check if GoogleSignin module is available
      if (!isGoogleSignInModuleAvailable || !GoogleSignin) {
        console.warn('Google Sign-in module not available - likely running in Expo Go. Use a development build for Google Sign-in functionality.');
        return; // Don't throw error, just return silently
      }
      
      try {
        GoogleSignin.configure({
          webClientId: '583767453466-hhre84pr2c3p21d228c3tge4ngor8k7r.apps.googleusercontent.com',
          iosClientId: '583767453466-76jgmbgv7fpsa0072c5lhv5m7avsjrtd.apps.googleusercontent.com',
          offlineAccess: false,
        });
        console.log('Google Sign-in configured successfully');
      } catch (error) {
        console.warn('Google Sign-in configuration failed:', error);
        // Mark module as unavailable if configuration fails
        isGoogleSignInModuleAvailable = false;
      }
    }
  }

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<User> {
    try {
      if (Platform.OS === 'web') {
        // Web Google Sign-In using Firebase Auth
        const { signInWithPopup } = require('firebase/auth');
        
        // Get web client ID from Constants
        const webClientId = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || 
                           '583767453466-hhre84pr2c3p21d228c3tge4ngor8k7r.apps.googleusercontent.com';
        
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          client_id: webClientId
        });
        
        const userCredential: UserCredential = await signInWithPopup(auth, provider);
        return this.getUserProfile(userCredential.user);
      } else {
        // For Expo managed workflow, check if native module is available
        if (!isGoogleSignInModuleAvailable || !GoogleSignin) {
          throw new Error('Google Sign-in is not available in Expo Go. Please use email/password authentication or create a development build.');
        }
        
        try {
          // Ensure Google Sign-in is initialized
          this.initializeGoogleSignIn();
          
          // Double-check availability after initialization
          if (!isGoogleSignInModuleAvailable) {
            throw new Error('Google Sign-in module failed to initialize. Please use email/password authentication or create a development build.');
          }

          if (Platform.OS === 'android') {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          }

          const userInfo = await GoogleSignin.signIn();
          
          // Get tokens separately for React Native Google Sign-in
          const tokens = await GoogleSignin.getTokens();
          const idToken = tokens.idToken;
          
          if (!idToken) {
            throw new Error('Google sign-in failed: No ID token received');
          }

          // Create Google credential
          const googleCredential = GoogleAuthProvider.credential(idToken);
          const userCredential: UserCredential = await signInWithCredential(auth, googleCredential);
          return this.getUserProfile(userCredential.user);
        } catch (error: any) {
          // Handle specific Google Sign-in errors
          if (error.message.includes('development build') || 
              error.message.includes('RNGoogleSignin') ||
              error.message.includes('TurboModuleRegistry') ||
              error.message.includes('module failed to initialize')) {
            throw new Error('Google Sign-in is not available in Expo Go. Please use email/password authentication or create a development build.');
          }
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register with Google (same as sign-in)
   */
  static async registerWithGoogle(): Promise<User> {
    return this.signInWithGoogle();
  }

  /**
   * Get current user
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Create user profile in Firestore
   */
  private static async createUserProfile(firebaseUser: FirebaseUser): Promise<User> {
    const user: User = {
      uid:         firebaseUser.uid,
      email:       firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      photoURL:    firebaseUser.photoURL ?? undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt:     new Date(),
      updatedAt:     new Date(),
    };
    
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, user);
    return user;
  }

  /**
   * Get user profile from Firestore
   */
  private static async getUserProfile(firebaseUser: FirebaseUser): Promise<User> {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid:           firebaseUser.uid,
        email:         firebaseUser.email!,
        displayName:   firebaseUser.displayName || data?.displayName || '',
        photoURL:      firebaseUser.photoURL ?? data?.photoURL ?? undefined,
        emailVerified: firebaseUser.emailVerified,
        createdAt:     data?.createdAt?.toDate ? data.createdAt.toDate() : (data?.createdAt || new Date()),
        updatedAt:     new Date(),
      };
    }
    return this.createUserProfile(firebaseUser);
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(error: any): AuthError {
    const code    = error.code || 'unknown';
    const message = this.getErrorMessage(code) || error.message || 'Ein unbekannter Fehler ist aufgetreten';
    return { code, message };
  }

  /**
   * Map Firebase error codes to user-friendly messages
   */
  private static getErrorMessage(errorCode: string): string {
    const messages: Record<string, string> = {
      'auth/user-not-found':            'Kein Benutzer mit dieser E-Mail gefunden.',
      'auth/wrong-password':            'Falsches Passwort.',
      'auth/email-already-in-use':      'Diese E-Mail wird bereits verwendet.',
      'auth/weak-password':             'Das Passwort muss mindestens 6 Zeichen lang sein.',
      'auth/invalid-email':             'Ungültige E-Mail-Adresse.',
      'auth/user-disabled':             'Dieses Konto wurde gesperrt.',
      'auth/too-many-requests':         'Zu viele Versuche. Bitte später erneut versuchen.',
      'auth/network-request-failed':    'Netzwerkfehler. Überprüfe deine Verbindung.',
    };
    return messages[errorCode] || 'Ein unerwarteter Fehler ist aufgetreten.';
  }
}
