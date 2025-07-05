import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Workout,
  WorkoutSession,
  Exercise,
  WorkoutProgress,
  PaginatedResponse,
  SortConfig,
  FilterConfig,
} from '@/types';

export class WorkoutService {
  /**
   * Get workout by ID
   */
  static async getWorkout(workoutId: string): Promise<Workout | null> {
    try {
      const workoutDoc = await getDoc(doc(db, 'workouts', workoutId));
      
      if (workoutDoc.exists()) {
        const data = workoutDoc.data();
        return {
          ...data,
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date(),
        } as Workout;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting workout:', error);
      throw error;
    }
  }

  /**
   * Get workouts for a user
   */
  static async getUserWorkouts(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      sort?: SortConfig;
      filters?: FilterConfig;
    } = {}
  ): Promise<PaginatedResponse<Workout>> {
    try {
      const { page = 1, limit: pageLimit = 10, sort, filters } = options;
      
      let workoutQuery = query(
        collection(db, 'workouts'),
        where('userId', '==', userId)
      );

      // Apply filters
      if (filters?.['category']) {
        workoutQuery = query(workoutQuery, where('category', '==', filters['category']));
      }
      
      if (filters?.['difficulty']) {
        workoutQuery = query(workoutQuery, where('difficulty', '==', filters['difficulty']));
      }

      // Apply sorting
      if (sort) {
        workoutQuery = query(workoutQuery, orderBy(sort.field, sort.order));
      } else {
        workoutQuery = query(workoutQuery, orderBy('createdAt', 'desc'));
      }

      // Apply pagination
      workoutQuery = query(workoutQuery, firestoreLimit(pageLimit));

      const snapshot = await getDocs(workoutQuery);
      const workouts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as Workout[];

      return {
        data: workouts,
        total: workouts.length, // In a real app, you'd get the total count separately
        page,
        limit: pageLimit,
        hasMore: workouts.length === pageLimit,
      };
    } catch (error) {
      console.error('Error getting user workouts:', error);
      throw error;
    }
  }

  /**
   * Create a new workout
   */
  static async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const workoutRef = doc(collection(db, 'workouts'));
      const workout: Workout = {
        ...workoutData,
        id: workoutRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(workoutRef, {
        ...workout,
        createdAt: Timestamp.fromDate(workout.createdAt),
        updatedAt: Timestamp.fromDate(workout.updatedAt),
      });

      return workoutRef.id;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  }

  /**
   * Update a workout
   */
  static async updateWorkout(
    workoutId: string,
    updates: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }

  /**
   * Delete a workout
   */
  static async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }

  /**
   * Start a workout session
   */
  static async startWorkoutSession(
    workoutId: string,
    userId: string
  ): Promise<string> {
    try {
      const sessionRef = doc(collection(db, 'workoutSessions'));
      const session: WorkoutSession = {
        id: sessionRef.id,
        workoutId,
        userId,
        startTime: new Date(),
        exercises: [],
        status: 'in_progress',
      };

      await setDoc(sessionRef, {
        ...session,
        startTime: Timestamp.fromDate(session.startTime),
      });

      return sessionRef.id;
    } catch (error) {
      console.error('Error starting workout session:', error);
      throw error;
    }
  }

  /**
   * Complete a workout session
   */
  static async completeWorkoutSession(
    sessionId: string,
    sessionData: Partial<WorkoutSession>
  ): Promise<void> {
    try {
      const sessionRef = doc(db, 'workoutSessions', sessionId);
      const endTime = new Date();
      
      await updateDoc(sessionRef, {
        ...sessionData,
        endTime: Timestamp.fromDate(endTime),
        status: 'completed',
        duration: sessionData.duration || 0,
      });
    } catch (error) {
      console.error('Error completing workout session:', error);
      throw error;
    }
  }

  /**
   * Get workout sessions for a user
   */
  static async getUserWorkoutSessions(
    userId: string,
    options: { limit?: number; status?: string } = {}
  ): Promise<WorkoutSession[]> {
    try {
      const { limit: queryLimit = 20, status } = options;
      
      let sessionQuery = query(
        collection(db, 'workoutSessions'),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        firestoreLimit(queryLimit)
      );

      if (status) {
        sessionQuery = query(
          collection(db, 'workoutSessions'),
          where('userId', '==', userId),
          where('status', '==', status),
          orderBy('startTime', 'desc'),
          firestoreLimit(queryLimit)
        );
      }

      const snapshot = await getDocs(sessionQuery);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: doc.data()['startTime']?.toDate() || new Date(),
        endTime: doc.data()['endTime']?.toDate(),
      })) as WorkoutSession[];
    } catch (error) {
      console.error('Error getting user workout sessions:', error);
      throw error;
    }
  }

  /**
   * Get workout progress for an exercise
   */
  static async getExerciseProgress(
    userId: string,
    exerciseId: string,
    limit: number = 10
  ): Promise<WorkoutProgress[]> {
    try {
      const progressQuery = query(
        collection(db, 'workoutProgress'),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId),
        orderBy('date', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(progressQuery);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data()['date']?.toDate() || new Date(),
      })) as WorkoutProgress[];
    } catch (error) {
      console.error('Error getting exercise progress:', error);
      throw error;
    }
  }

  /**
   * Record workout progress
   */
  static async recordWorkoutProgress(
    userId: string,
    progressData: Omit<WorkoutProgress, 'date'> & { date?: Date }
  ): Promise<void> {
    try {
      const progressRef = doc(collection(db, 'workoutProgress'));
      const progress: WorkoutProgress = {
        ...progressData,
        date: progressData.date || new Date(),
      };

      await setDoc(progressRef, {
        ...progress,
        userId,
        date: Timestamp.fromDate(progress.date),
      });
    } catch (error) {
      console.error('Error recording workout progress:', error);
      throw error;
    }
  }

  /**
   * Get popular/featured workouts
   */
  static async getFeaturedWorkouts(limit: number = 10): Promise<Workout[]> {
    try {
      const workoutQuery = query(
        collection(db, 'workouts'),
        where('isTemplate', '==', true),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(workoutQuery);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as Workout[];
    } catch (error) {
      console.error('Error getting featured workouts:', error);
      throw error;
    }
  }
}
