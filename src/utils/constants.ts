/**
 * Application constants and configuration values
 */

// App Configuration
export const APP_CONFIG = {
  name: 'PassFit',
  version: '1.0.0',
  description: 'Your personal fitness companion',
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// Authentication
export const AUTH_CONFIG = {
  passwordMinLength: 6,
  sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  emailVerificationRequired: true,
} as const;

// Workout Categories
export const WORKOUT_CATEGORIES = [
  'strength',
  'cardio',
  'flexibility',
  'sports',
  'yoga',
  'pilates',
  'crossfit',
  'bodyweight',
  'powerlifting',
  'olympic_lifting',
] as const;

export type WorkoutCategory = typeof WORKOUT_CATEGORIES[number];

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

// Exercise Types
export const EXERCISE_TYPES = [
  'strength',
  'cardio',
  'flexibility',
  'balance',
  'endurance',
  'power',
  'agility',
] as const;

export type ExerciseType = typeof EXERCISE_TYPES[number];

// Muscle Groups
export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'obliques',
  'lower_back',
  'glutes',
  'quadriceps',
  'hamstrings',
  'calves',
  'full_body',
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];

// Equipment Types
export const EQUIPMENT_TYPES = [
  'none',
  'dumbbells',
  'barbell',
  'kettlebell',
  'resistance_bands',
  'pull_up_bar',
  'bench',
  'cable_machine',
  'smith_machine',
  'treadmill',
  'stationary_bike',
  'rowing_machine',
  'elliptical',
  'medicine_ball',
  'foam_roller',
  'yoga_mat',
  'stability_ball',
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];

// Workout Session Status
export const SESSION_STATUS = [
  'planned',
  'in_progress',
  'paused',
  'completed',
  'cancelled',
] as const;

export type SessionStatus = typeof SESSION_STATUS[number];

// User Goals
export const FITNESS_GOALS = [
  'lose_weight',
  'gain_muscle',
  'improve_endurance',
  'increase_strength',
  'improve_flexibility',
  'maintain_fitness',
  'sport_specific',
  'rehabilitation',
] as const;

export type FitnessGoal = typeof FITNESS_GOALS[number];

// Activity Levels
export const ACTIVITY_LEVELS = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active',
] as const;

export type ActivityLevel = typeof ACTIVITY_LEVELS[number];

// Gender Options
export const GENDER_OPTIONS = [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
] as const;

export type Gender = typeof GENDER_OPTIONS[number];

// Units of Measurement
export const WEIGHT_UNITS = ['kg', 'lbs'] as const;
export const HEIGHT_UNITS = ['cm', 'ft'] as const;
export const DISTANCE_UNITS = ['km', 'mi'] as const;

export type WeightUnit = typeof WEIGHT_UNITS[number];
export type HeightUnit = typeof HEIGHT_UNITS[number];
export type DistanceUnit = typeof DISTANCE_UNITS[number];

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// Validation Constants
export const VALIDATION_LIMITS = {
  displayName: {
    min: 2,
    max: 50,
  },
  workoutName: {
    min: 3,
    max: 100,
  },
  exerciseName: {
    min: 2,
    max: 80,
  },
  description: {
    max: 500,
  },
  age: {
    min: 13,
    max: 120,
  },
  weight: {
    min: 20,
    max: 500,
  },
  height: {
    min: 100,
    max: 250,
  },
  sets: {
    min: 1,
    max: 20,
  },
  reps: {
    min: 1,
    max: 1000,
  },
  exerciseWeight: {
    min: 0,
    max: 1000,
  },
  duration: {
    min: 1,
    max: 480, // 8 hours
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  user: 'passfit_user',
  preferences: 'passfit_preferences',
  workoutDraft: 'passfit_workout_draft',
  sessionData: 'passfit_session_data',
  onboardingComplete: 'passfit_onboarding_complete',
} as const;

// Theme Colors (for reference)
export const THEME_COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
} as const;

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  unknown: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  profileUpdated: 'Profile updated successfully!',
  workoutCreated: 'Workout created successfully!',
  workoutCompleted: 'Workout completed! Great job!',
  passwordChanged: 'Password changed successfully!',
  emailVerified: 'Email verified successfully!',
} as const;

// Feature Flags (for development)
export const FEATURE_FLAGS = {
  enableAnalytics: true,
  enablePushNotifications: true,
  enableSocialFeatures: false,
  enablePremiumFeatures: false,
  enableBetaFeatures: false,
} as const;

// Default Values
export const DEFAULT_VALUES = {
  workoutDuration: 45, // minutes
  restTime: 60, // seconds
  sets: 3,
  reps: 12,
  weight: 0,
  profilePicture: '',
  theme: 'light',
  units: {
    weight: 'kg' as WeightUnit,
    height: 'cm' as HeightUnit,
    distance: 'km' as DistanceUnit,
  },
} as const;

// Pagination
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultPage: 1,
} as const;

// File Upload
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;
