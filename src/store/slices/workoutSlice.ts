import { StateCreator } from 'zustand';
import { WorkoutService } from '@/services/api';
import {
  Workout,
  WorkoutSession,
  WorkoutProgress,
  PaginatedResponse,
  SortConfig,
  FilterConfig,
} from '@/types';

export interface WorkoutSlice {
  // State
  workouts: Workout[];
  currentWorkout: Workout | null;
  currentSession: WorkoutSession | null;
  workoutSessions: WorkoutSession[];
  featuredWorkouts: Workout[];
  exerciseProgress: Record<string, WorkoutProgress[]>;
  
  // Loading states
  isLoadingWorkouts: boolean;
  isLoadingSession: boolean;
  isLoadingProgress: boolean;
  
  // Error states
  workoutsError: string | null;
  sessionError: string | null;
  progressError: string | null;

  // Actions
  getUserWorkouts: (
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      sort?: SortConfig;
      filters?: FilterConfig;
    }
  ) => Promise<void>;
  getWorkout: (workoutId: string) => Promise<void>;
  createWorkout: (workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateWorkout: (
    workoutId: string,
    updates: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  
  // Session actions
  startWorkoutSession: (workoutId: string, userId: string) => Promise<string>;
  completeWorkoutSession: (sessionId: string, sessionData: Partial<WorkoutSession>) => Promise<void>;
  getUserWorkoutSessions: (userId: string, options?: { limit?: number; status?: string }) => Promise<void>;
  
  // Progress actions
  getExerciseProgress: (userId: string, exerciseId: string, limit?: number) => Promise<void>;
  recordWorkoutProgress: (
    userId: string,
    progressData: Omit<WorkoutProgress, 'date'> & { date?: Date }
  ) => Promise<void>;
  
  // Featured workouts
  getFeaturedWorkouts: (limit?: number) => Promise<void>;
  
  // Utility actions
  clearWorkoutsError: () => void;
  clearSessionError: () => void;
  clearProgressError: () => void;
  setCurrentWorkout: (workout: Workout | null) => void;
  setCurrentSession: (session: WorkoutSession | null) => void;
}

export const createWorkoutSlice: StateCreator<WorkoutSlice> = (set, get) => ({
  // Initial state
  workouts: [],
  currentWorkout: null,
  currentSession: null,
  workoutSessions: [],
  featuredWorkouts: [],
  exerciseProgress: {},
  
  isLoadingWorkouts: false,
  isLoadingSession: false,
  isLoadingProgress: false,
  
  workoutsError: null,
  sessionError: null,
  progressError: null,

  // Actions
  getUserWorkouts: async (userId: string, options = {}) => {
    set({ isLoadingWorkouts: true, workoutsError: null });
    try {
      const response: PaginatedResponse<Workout> = await WorkoutService.getUserWorkouts(userId, options);
      set({
        workouts: response.data,
        isLoadingWorkouts: false,
        workoutsError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workouts';
      set({
        workoutsError: errorMessage,
        isLoadingWorkouts: false,
      });
      throw error;
    }
  },

  getWorkout: async (workoutId: string) => {
    set({ isLoadingWorkouts: true, workoutsError: null });
    try {
      const workout = await WorkoutService.getWorkout(workoutId);
      set({
        currentWorkout: workout,
        isLoadingWorkouts: false,
        workoutsError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workout';
      set({
        workoutsError: errorMessage,
        isLoadingWorkouts: false,
      });
      throw error;
    }
  },

  createWorkout: async (workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoadingWorkouts: true, workoutsError: null });
    try {
      const workoutId = await WorkoutService.createWorkout(workoutData);
      
      // Add the new workout to the local state
      const newWorkout: Workout = {
        ...workoutData,
        id: workoutId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set({
        workouts: [newWorkout, ...get().workouts],
        isLoadingWorkouts: false,
      });
      
      return workoutId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create workout';
      set({
        workoutsError: errorMessage,
        isLoadingWorkouts: false,
      });
      throw error;
    }
  },

  updateWorkout: async (
    workoutId: string,
    updates: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    set({ isLoadingWorkouts: true, workoutsError: null });
    try {
      await WorkoutService.updateWorkout(workoutId, updates);
      
      // Update local state
      const workouts = get().workouts.map(workout =>
        workout.id === workoutId
          ? { ...workout, ...updates, updatedAt: new Date() }
          : workout
      );
      
      const currentWorkout = get().currentWorkout;
      const updatedCurrentWorkout = currentWorkout?.id === workoutId
        ? { ...currentWorkout, ...updates, updatedAt: new Date() }
        : currentWorkout;
      
      set({
        workouts,
        currentWorkout: updatedCurrentWorkout,
        isLoadingWorkouts: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update workout';
      set({
        workoutsError: errorMessage,
        isLoadingWorkouts: false,
      });
      throw error;
    }
  },

  deleteWorkout: async (workoutId: string) => {
    set({ isLoadingWorkouts: true, workoutsError: null });
    try {
      await WorkoutService.deleteWorkout(workoutId);
      
      // Remove from local state
      const workouts = get().workouts.filter(workout => workout.id !== workoutId);
      const currentWorkout = get().currentWorkout?.id === workoutId ? null : get().currentWorkout;
      
      set({
        workouts,
        currentWorkout,
        isLoadingWorkouts: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete workout';
      set({
        workoutsError: errorMessage,
        isLoadingWorkouts: false,
      });
      throw error;
    }
  },

  startWorkoutSession: async (workoutId: string, userId: string) => {
    set({ isLoadingSession: true, sessionError: null });
    try {
      const sessionId = await WorkoutService.startWorkoutSession(workoutId, userId);
      
      // Create session object for local state
      const session: WorkoutSession = {
        id: sessionId,
        workoutId,
        userId,
        startTime: new Date(),
        exercises: [],
        status: 'in_progress',
      };
      
      set({
        currentSession: session,
        isLoadingSession: false,
      });
      
      return sessionId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start workout session';
      set({
        sessionError: errorMessage,
        isLoadingSession: false,
      });
      throw error;
    }
  },

  completeWorkoutSession: async (sessionId: string, sessionData: Partial<WorkoutSession>) => {
    set({ isLoadingSession: true, sessionError: null });
    try {
      await WorkoutService.completeWorkoutSession(sessionId, sessionData);
      
      // Update local state
      const currentSession = get().currentSession;
      if (currentSession?.id === sessionId) {
        set({
          currentSession: {
            ...currentSession,
            ...sessionData,
            endTime: new Date(),
            status: 'completed',
          },
          isLoadingSession: false,
        });
      } else {
        set({ isLoadingSession: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete workout session';
      set({
        sessionError: errorMessage,
        isLoadingSession: false,
      });
      throw error;
    }
  },

  getUserWorkoutSessions: async (userId: string, options = {}) => {
    set({ isLoadingSession: true, sessionError: null });
    try {
      const sessions = await WorkoutService.getUserWorkoutSessions(userId, options);
      set({
        workoutSessions: sessions,
        isLoadingSession: false,
        sessionError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workout sessions';
      set({
        sessionError: errorMessage,
        isLoadingSession: false,
      });
      throw error;
    }
  },

  getExerciseProgress: async (userId: string, exerciseId: string, limit = 10) => {
    set({ isLoadingProgress: true, progressError: null });
    try {
      const progress = await WorkoutService.getExerciseProgress(userId, exerciseId, limit);
      set({
        exerciseProgress: {
          ...get().exerciseProgress,
          [exerciseId]: progress,
        },
        isLoadingProgress: false,
        progressError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load exercise progress';
      set({
        progressError: errorMessage,
        isLoadingProgress: false,
      });
      throw error;
    }
  },

  recordWorkoutProgress: async (
    userId: string,
    progressData: Omit<WorkoutProgress, 'date'> & { date?: Date }
  ) => {
    set({ isLoadingProgress: true, progressError: null });
    try {
      await WorkoutService.recordWorkoutProgress(userId, progressData);
      
      // Update local progress state
      const exerciseId = progressData.exerciseId;
      const currentProgress = get().exerciseProgress[exerciseId] || [];
      const newProgress: WorkoutProgress = {
        ...progressData,
        date: progressData.date || new Date(),
      };
      
      set({
        exerciseProgress: {
          ...get().exerciseProgress,
          [exerciseId]: [newProgress, ...currentProgress].slice(0, 10), // Keep only latest 10
        },
        isLoadingProgress: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to record workout progress';
      set({
        progressError: errorMessage,
        isLoadingProgress: false,
      });
      throw error;
    }
  },

  getFeaturedWorkouts: async (limit = 10) => {
    set({ isLoadingWorkouts: true, workoutsError: null });
    try {
      const workouts = await WorkoutService.getFeaturedWorkouts(limit);
      set({
        featuredWorkouts: workouts,
        isLoadingWorkouts: false,
        workoutsError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load featured workouts';
      set({
        workoutsError: errorMessage,
        isLoadingWorkouts: false,
      });
      throw error;
    }
  },

  clearWorkoutsError: () => {
    set({ workoutsError: null });
  },

  clearSessionError: () => {
    set({ sessionError: null });
  },

  clearProgressError: () => {
    set({ progressError: null });
  },

  setCurrentWorkout: (workout: Workout | null) => {
    set({ currentWorkout: workout });
  },

  setCurrentSession: (session: WorkoutSession | null) => {
    set({ currentSession: session });
  },
});
