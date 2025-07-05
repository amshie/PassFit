import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createWorkoutSlice, WorkoutSlice } from './slices/workoutSlice';

// Combined store type
export type AppStore = AuthSlice & UserSlice & WorkoutSlice;

// Create the main store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createUserSlice(...args),
        ...createWorkoutSlice(...args),
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

// Selector hooks for better performance
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

// Export store slices for direct access if needed
export { createAuthSlice, createUserSlice, createWorkoutSlice };
export type { AuthSlice, UserSlice, WorkoutSlice };
