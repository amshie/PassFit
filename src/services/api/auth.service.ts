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
import { auth, db } from '../firebase/config';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
} from '@/types';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export class AuthService {
  /**
   * Sign in with email/phone and password
   */
  static async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      // For now, we'll use email authentication
      // Phone authentication would require additional setup with Firebase
      const email = credentials.email || credentials.phone;
      
      if (!email) {
        throw new Error('E-Mail oder Telefonnummer ist erforderlich');
      }

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        credentials.password
      );

      const user = await this.getUserProfile(userCredential.user);
      return user;
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

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user profile in Firestore
      const user = await this.createUserProfile(userCredential.user);
      
      return user;
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
   * Initialize Google Sign-In
   */
  static async initializeGoogleSignIn(): Promise<void> {
    try {
      // For now, Google Sign-In is disabled until OAuth client IDs are configured
      // Uncomment and configure when you have Google OAuth client IDs
      console.log('Google Sign-In initialization skipped - OAuth client IDs not configured');
      
      // const webClientId = process.env['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'];
      
      // if (!webClientId) {
      //   throw new Error('Google Web Client ID not configured');
      // }

      // await GoogleSignin.configure({
      //   webClientId: webClientId,
      //   offlineAccess: true,
      //   hostedDomain: '',
      //   forceCodeForRefreshToken: true,
      // });
    } catch (error: any) {
      console.error('Google Sign-In initialization failed:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<User> {
    try {
      // Google Sign-In is disabled until OAuth client IDs are configured
      throw new Error('Google Sign-In is not configured. Please use email authentication or configure Google OAuth client IDs.');
      
      // // Initialize Google Sign-In if not already done
      // await this.initializeGoogleSignIn();

      // // Check if device supports Google Play Services (Android)
      // await GoogleSignin.hasPlayServices();

      // // Get user info from Google
      // const userInfo = await GoogleSignin.signIn();
      
      // if (!userInfo.data?.idToken) {
      //   throw new Error('Google sign-in failed: No ID token received');
      // }

      // // Create Firebase credential
      // const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken);

      // // Sign in to Firebase with Google credential
      // const userCredential = await signInWithCredential(auth, googleCredential);

      // // Get or create user profile
      // const user = await this.getUserProfile(userCredential.user);
      
      // return user;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register with Google
   */
  static async registerWithGoogle(): Promise<User> {
    // Google registration is the same as sign-in for new users
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
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL ?? undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), user);
    return user;
  }

  /**
   * Get user profile from Firestore
   */
  private static async getUserProfile(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || userData['displayName'] || '',
        photoURL: firebaseUser.photoURL ?? userData['photoURL'] ?? undefined,
        emailVerified: firebaseUser.emailVerified,
        createdAt: userData['createdAt']?.toDate() || new Date(),
        updatedAt: new Date(),
      };
    } else {
      // Create profile if it doesn't exist
      return await this.createUserProfile(firebaseUser);
    }
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(error: any): AuthError {
    const authError: AuthError = {
      code: error.code || 'unknown',
      message: this.getErrorMessage(error.code) || error.message || 'An unknown error occurred',
    };

    return authError;
  }

  /**
   * Get user-friendly error messages
   */
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred.';
  }
}
