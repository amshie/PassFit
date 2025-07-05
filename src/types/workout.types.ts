export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  duration: number; // in minutes
  difficulty: DifficultyLevel;
  category: WorkoutCategory;
  tags: string[];
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  instructions: string[];
  sets: ExerciseSet[];
  restTime?: number; // in seconds
  notes?: string;
}

export interface ExerciseSet {
  id: string;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in seconds for time-based exercises
  distance?: number; // in meters for cardio
  completed: boolean;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  exercises: CompletedExercise[];
  notes?: string;
  rating?: number; // 1-5 stars
  calories?: number;
  status: 'in_progress' | 'completed' | 'paused' | 'cancelled';
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
  notes?: string;
}

export interface CompletedSet {
  setId: string;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  completed: boolean;
  completedAt?: Date;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type WorkoutCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'sports'
  | 'rehabilitation'
  | 'yoga'
  | 'pilates'
  | 'crossfit'
  | 'bodyweight'
  | 'powerlifting'
  | 'olympic_lifting';

export type ExerciseCategory = 
  | 'compound'
  | 'isolation'
  | 'cardio'
  | 'plyometric'
  | 'isometric'
  | 'stretching'
  | 'balance'
  | 'coordination';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'full_body'
  | 'core';

export type Equipment = 
  | 'bodyweight'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_bands'
  | 'pull_up_bar'
  | 'bench'
  | 'squat_rack'
  | 'cable_machine'
  | 'treadmill'
  | 'stationary_bike'
  | 'rowing_machine'
  | 'yoga_mat'
  | 'foam_roller'
  | 'medicine_ball'
  | 'stability_ball';

export interface WorkoutProgress {
  exerciseId: string;
  date: Date;
  bestSet: {
    weight?: number;
    reps?: number;
    duration?: number;
    distance?: number;
  };
  volume: number; // total weight lifted or time/distance
  personalRecord: boolean;
}
