import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { UserProfile, UserStats } from '@/types';

export class UserService {
  /**
   * Get user profile by UID
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'userProfiles', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          dateOfBirth: data['dateOfBirth']?.toDate(),
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date(),
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Create or update user profile
   */
  static async updateUserProfile(
    uid: string,
    profileData: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'userProfiles', uid);
      const updateData = {
        ...profileData,
        updatedAt: Timestamp.now(),
        ...(profileData.dateOfBirth && {
          dateOfBirth: Timestamp.fromDate(profileData.dateOfBirth),
        }),
      };

      await setDoc(userRef, updateData, { merge: true });

      // Update Firebase Auth profile if display name or photo changed
      const currentUser = auth.currentUser;
      if (currentUser) {
        const authUpdates: { displayName?: string; photoURL?: string } = {};
        
        if (profileData.displayName) {
          authUpdates.displayName = profileData.displayName;
        }
        
        if (profileData.photoURL) {
          authUpdates.photoURL = profileData.photoURL;
        }

        if (Object.keys(authUpdates).length > 0) {
          await updateProfile(currentUser, authUpdates);
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user email
   */
  static async updateUserEmail(newEmail: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      await updateEmail(currentUser, newEmail);
      
      // Update email in user profile
      await this.updateUserProfile(currentUser.uid, { email: newEmail });
    } catch (error) {
      console.error('Error updating user email:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      await updatePassword(currentUser, newPassword);
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(uid: string): Promise<UserStats> {
    try {
      // Get workout sessions for the user
      const sessionsQuery = query(
        collection(db, 'workoutSessions'),
        where('userId', '==', uid),
        where('status', '==', 'completed')
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessions = sessionsSnapshot.docs.map(doc => doc.data());

      // Calculate statistics
      const totalWorkouts = sessions.length;
      const totalDuration = sessions.reduce(
        (sum, session) => sum + (session['duration'] || 0),
        0
      );

      // Calculate current streak
      const sortedSessions = sessions
        .filter(session => session['startTime'])
        .sort((a, b) => b['startTime'].toDate().getTime() - a['startTime'].toDate().getTime());
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sortedSessions.length; i++) {
        const startTime = sortedSessions[i]?.['startTime'];
        if (!startTime) continue;
        
        const sessionDate = startTime.toDate();
        sessionDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor(
          (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (i === 0 && (daysDiff === 0 || daysDiff === 1)) {
          currentStreak = 1;
          tempStreak = 1;
        } else if (i > 0) {
          const prevStartTime = sortedSessions[i - 1]?.['startTime'];
          if (!prevStartTime) continue;
          
          const prevSessionDate = prevStartTime.toDate();
          prevSessionDate.setHours(0, 0, 0, 0);
          
          const daysBetween = Math.floor(
            (prevSessionDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysBetween === 1) {
            tempStreak++;
            if (i === 1 && currentStreak > 0) {
              currentStreak = tempStreak;
            }
          } else {
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            tempStreak = 1;
          }
        }
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }

      // Get favorite exercises (placeholder - would need more complex logic)
      const favoriteExercises: string[] = [];

      const lastWorkout = sortedSessions.length > 0 && sortedSessions[0]?.['startTime']
        ? sortedSessions[0]['startTime'].toDate() 
        : undefined;

      return {
        totalWorkouts,
        totalDuration,
        currentStreak,
        longestStreak,
        favoriteExercises,
        lastWorkout,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Delete user account and all associated data
   */
  static async deleteUserAccount(uid: string): Promise<void> {
    try {
      // Delete user profile
      await setDoc(doc(db, 'userProfiles', uid), { deleted: true }, { merge: true });
      
      // Note: In a production app, you'd want to delete all user data
      // This is a simplified version
      
      console.log('User account marked for deletion:', uid);
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }
}
