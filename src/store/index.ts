import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createWorkoutSlice, WorkoutSlice } from './slices/workoutSlice';
import { createSettingsSlice, SettingsSlice } from './slices/settingsSlice';

// Combined store type
export type AppStore = AuthSlice & UserSlice & WorkoutSlice & SettingsSlice;

// Create the main store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createUserSlice(...args),
        ...createWorkoutSlice(...args),
        ...createSettingsSlice(...args),
      }),
      {
        name: 'passfit-store',
        storage: createJSONStorage(() => AsyncStorage),
        // Only persist certain parts of the state
        partialize: (state) => ({
          // Auth state (but not loading states)
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          
          // User profile (but not loading states)
          profile: state.profile,
          
          // Settings state (persist user preferences)
          language: state.language,
          themeMode: state.themeMode,
          notifications: state.notifications,
          
          // Don't persist sensitive or temporary data
          // isLoading states, errors, current sessions, etc. will not be persisted
        }),
        // Storage configuration
        version: 1,
        // Skip hydration on server-side rendering
        skipHydration: true,
      }
    ),
    {
      name: 'PassFit Store',
    }
  )
);

// Selector hooks for better performance - using individual selectors to prevent object recreation
export const useAuthUser = () => useAppStore((state) => state.user);
export const useAuthLoading = () => useAppStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useAuthError = () => useAppStore((state) => state.error);
export const useAuthInitialized = () => useAppStore((state) => state.isInitialized);

// Action selectors
export const useSignIn = () => useAppStore((state) => state.signIn);
export const useRegister = () => useAppStore((state) => state.register);
export const useSignOut = () => useAppStore((state) => state.signOut);
export const useResetPassword = () => useAppStore((state) => state.resetPassword);
export const useSendEmailVerification = () => useAppStore((state) => state.sendEmailVerification);
export const useClearAuthError = () => useAppStore((state) => state.clearError);
export const useInitializeAuth = () => useAppStore((state) => state.initializeAuth);

// Legacy useAuth hook for backward compatibility - use individual selectors instead
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
  isAuthenticated: state.isAuthenticated,
  error: state.error,
  isInitialized: state.isInitialized,
  signIn: state.signIn,
  register: state.register,
  signOut: state.signOut,
  resetPassword: state.resetPassword,
  sendEmailVerification: state.sendEmailVerification,
  clearError: state.clearError,
  initializeAuth: state.initializeAuth,
}));

export const useUser = () => useAppStore((state) => ({
  profile: state.profile,
  stats: state.stats,
  isLoadingProfile: state.isLoadingProfile,
  isLoadingStats: state.isLoadingStats,
  profileError: state.profileError,
  statsError: state.statsError,
  getUserProfile: state.getUserProfile,
  updateUserProfile: state.updateUserProfile,
  getUserStats: state.getUserStats,
  updateUserEmail: state.updateUserEmail,
  updateUserPassword: state.updateUserPassword,
  clearProfileError: state.clearProfileError,
  clearStatsError: state.clearStatsError,
}));

export const useWorkouts = () => useAppStore((state) => ({
  workouts: state.workouts,
  currentWorkout: state.currentWorkout,
  currentSession: state.currentSession,
  workoutSessions: state.workoutSessions,
  featuredWorkouts: state.featuredWorkouts,
  exerciseProgress: state.exerciseProgress,
  isLoadingWorkouts: state.isLoadingWorkouts,
  isLoadingSession: state.isLoadingSession,
  isLoadingProgress: state.isLoadingProgress,
  workoutsError: state.workoutsError,
  sessionError: state.sessionError,
  progressError: state.progressError,
  getUserWorkouts: state.getUserWorkouts,
  getWorkout: state.getWorkout,
  createWorkout: state.createWorkout,
  updateWorkout: state.updateWorkout,
  deleteWorkout: state.deleteWorkout,
  startWorkoutSession: state.startWorkoutSession,
  completeWorkoutSession: state.completeWorkoutSession,
  getUserWorkoutSessions: state.getUserWorkoutSessions,
  getExerciseProgress: state.getExerciseProgress,
  recordWorkoutProgress: state.recordWorkoutProgress,
  getFeaturedWorkouts: state.getFeaturedWorkouts,
  clearWorkoutsError: state.clearWorkoutsError,
  clearSessionError: state.clearSessionError,
  clearProgressError: state.clearProgressError,
  setCurrentWorkout: state.setCurrentWorkout,
  setCurrentSession: state.setCurrentSession,
}));

// Individual selectors to prevent object recreation and infinite loops
export const useThemeMode = () => useAppStore((state) => state.themeMode);
export const useLanguage = () => useAppStore((state) => state.language);
export const useNotifications = () => useAppStore((state) => state.notifications);

// Individual loading state selectors
export const useIsChangingLanguage = () => useAppStore((state) => state.isChangingLanguage);
export const useIsChangingTheme = () => useAppStore((state) => state.isChangingTheme);
export const useIsChangingNotifications = () => useAppStore((state) => state.isChangingNotifications);

// Individual error state selectors
export const useLanguageError = () => useAppStore((state) => state.languageError);
export const useThemeError = () => useAppStore((state) => state.themeError);
export const useNotificationsError = () => useAppStore((state) => state.notificationsError);

// Individual action selectors
export const useChangeLanguage = () => useAppStore((state) => state.changeLanguage);
export const useChangeThemeMode = () => useAppStore((state) => state.changeThemeMode);
export const useToggleNotifications = () => useAppStore((state) => state.toggleNotifications);
export const useRequestNotificationPermissions = () => useAppStore((state) => state.requestNotificationPermissions);
export const useClearLanguageError = () => useAppStore((state) => state.clearLanguageError);
export const useClearThemeError = () => useAppStore((state) => state.clearThemeError);
export const useClearNotificationsError = () => useAppStore((state) => state.clearNotificationsError);
export const useInitializeSettings = () => useAppStore((state) => state.initializeSettings);

// Grouped selectors for backward compatibility (use individual selectors instead)
export const useSettingsActions = () => useAppStore((state) => ({
  changeLanguage: state.changeLanguage,
  changeThemeMode: state.changeThemeMode,
  toggleNotifications: state.toggleNotifications,
  requestNotificationPermissions: state.requestNotificationPermissions,
  clearLanguageError: state.clearLanguageError,
  clearThemeError: state.clearThemeError,
  clearNotificationsError: state.clearNotificationsError,
  initializeSettings: state.initializeSettings,
}));

export const useSettingsLoadingStates = () => useAppStore((state) => ({
  isChangingLanguage: state.isChangingLanguage,
  isChangingTheme: state.isChangingTheme,
  isChangingNotifications: state.isChangingNotifications,
}));

export const useSettingsErrors = () => useAppStore((state) => ({
  languageError: state.languageError,
  themeError: state.themeError,
  notificationsError: state.notificationsError,
}));

// Legacy useSettings hook for backward compatibility - use individual selectors instead
export const useSettings = () => useAppStore((state) => ({
  // Settings state
  language: state.language,
  themeMode: state.themeMode,
  notifications: state.notifications,
  
  // Loading states
  isChangingLanguage: state.isChangingLanguage,
  isChangingTheme: state.isChangingTheme,
  isChangingNotifications: state.isChangingNotifications,
  
  // Error states
  languageError: state.languageError,
  themeError: state.themeError,
  notificationsError: state.notificationsError,
  
  // Actions
  changeLanguage: state.changeLanguage,
  changeThemeMode: state.changeThemeMode,
  toggleNotifications: state.toggleNotifications,
  requestNotificationPermissions: state.requestNotificationPermissions,
  clearLanguageError: state.clearLanguageError,
  clearThemeError: state.clearThemeError,
  clearNotificationsError: state.clearNotificationsError,
  initializeSettings: state.initializeSettings,
}));

// Export store slices for direct access if needed
export { createAuthSlice, createUserSlice, createWorkoutSlice, createSettingsSlice };
export type { AuthSlice, UserSlice, WorkoutSlice, SettingsSlice };
