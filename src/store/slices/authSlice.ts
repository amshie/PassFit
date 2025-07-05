import { StateCreator } from 'zustand';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { AuthService } from '@/services/api';
import { User, LoginCredentials, RegisterCredentials, AuthError } from '@/types';

export interface AuthSlice {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => (() => void);
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  isInitialized: false,

  // Actions
  signIn: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.signIn(credentials);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const authError = error as AuthError;
      set({
        error: authError.message,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.register(credentials);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const authError = error as AuthError;
      set({
        error: authError.message,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const authError = error as AuthError;
      set({
        error: authError.message,
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.resetPassword(email);
      set({ isLoading: false });
    } catch (error) {
      const authError = error as AuthError;
      set({
        error: authError.message,
        isLoading: false,
      });
      throw error;
    }
  },

  sendEmailVerification: async () => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.sendEmailVerification();
      set({ isLoading: false });
    } catch (error) {
      const authError = error as AuthError;
      set({
        error: authError.message,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  initializeAuth: () => {
    if (get().isInitialized) return () => {};

    set({ isLoading: true });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // User is signed in, get their profile
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date(), // This would come from Firestore in a real app
            updatedAt: new Date(),
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } else {
          // User is signed out
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: 'Failed to initialize authentication',
        });
      }
    });

    // Store the unsubscribe function for cleanup
    // In a real app, you'd want to call this when the app unmounts
    return unsubscribe;
  },
});
