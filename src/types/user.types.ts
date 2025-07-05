export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  dateOfBirth?: Date;
  height?: number; // in cm
  weight?: number; // in kg
  fitnessGoals: FitnessGoal[];
  activityLevel: ActivityLevel;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  theme: 'light' | 'dark' | 'system';
}

export interface NotificationSettings {
  workoutReminders: boolean;
  progressUpdates: boolean;
  achievements: boolean;
  social: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  shareWorkouts: boolean;
  shareProgress: boolean;
}

export type FitnessGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'endurance'
  | 'strength'
  | 'flexibility'
  | 'general_fitness';

export type ActivityLevel = 
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  favoriteExercises: string[];
  lastWorkout?: Date;
}
