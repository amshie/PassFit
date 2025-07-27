import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CheckIn } from '../../models/checkIn';

export class CheckInService {
  private static readonly COLLECTION = 'checkIn';

  /**
   * Create a new check-in
   */
  static async createCheckIn(
    userId: string,
    studioId: string
  ): Promise<string> {
    try {
      // Check if user already checked in today at this studio
      const hasCheckedInToday = await this.hasCheckedInToday(userId, studioId);
      if (hasCheckedInToday) {
        throw new Error('Sie haben bereits heute in diesem Studio eingecheckt.');
      }

      const checkInData: Omit<CheckIn, 'checkInId'> = {
        userId,
        studioId,
        checkinTime: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), checkInData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  }

  /**
   * Get all check-ins for a user
   */
  static async getUserCheckIns(
    userId: string,
    limitCount: number = 50
  ): Promise<CheckIn[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('checkinTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        checkInId: doc.id,
        ...doc.data()
      })) as CheckIn[];
    } catch (error) {
      console.error('Error getting user check-ins:', error);
      throw error;
    }
  }

  /**
   * Get check-ins for a specific studio
   */
  static async getStudioCheckIns(
    studioId: string,
    limitCount: number = 100
  ): Promise<CheckIn[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('studioId', '==', studioId),
        orderBy('checkinTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        checkInId: doc.id,
        ...doc.data()
      })) as CheckIn[];
    } catch (error) {
      console.error('Error getting studio check-ins:', error);
      throw error;
    }
  }

  /**
   * Check if user has checked in today at a specific studio
   */
  static async hasCheckedInToday(
    userId: string,
    studioId: string
  ): Promise<boolean> {
    try {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('checkinTime', '>=', Timestamp.fromDate(startOfToday)),
        where('checkinTime', '<', Timestamp.fromDate(endOfToday))
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking today\'s check-in:', error);
      throw error;
    }
  }

  /**
   * Get user's check-in history for a specific date range
   */
  static async getUserCheckInHistory(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CheckIn[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('checkinTime', '>=', Timestamp.fromDate(startDate)),
        where('checkinTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('checkinTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        checkInId: doc.id,
        ...doc.data()
      })) as CheckIn[];
    } catch (error) {
      console.error('Error getting user check-in history:', error);
      throw error;
    }
  }

  /**
   * Get user's total check-in count
   */
  static async getUserCheckInCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting user check-in count:', error);
      throw error;
    }
  }

  /**
   * Get studio's total check-in count
   */
  static async getStudioCheckInCount(studioId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('studioId', '==', studioId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting studio check-in count:', error);
      throw error;
    }
  }

  /**
   * Get user's most visited studios
   */
  static async getUserMostVisitedStudios(
    userId: string,
    limitCount: number = 5
  ): Promise<{ studioId: string; count: number }[]> {
    try {
      const checkIns = await this.getUserCheckIns(userId, 1000); // Get more records for analysis
      
      // Count check-ins per studio
      const studioCount: { [studioId: string]: number } = {};
      checkIns.forEach(checkIn => {
        studioCount[checkIn.studioId] = (studioCount[checkIn.studioId] || 0) + 1;
      });

      // Sort by count and return top studios
      return Object.entries(studioCount)
        .map(([studioId, count]) => ({ studioId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting most visited studios:', error);
      throw error;
    }
  }
/**
 * Gibt Info zurück, ob ein neuer Check-in angelegt wurde
 */
static async checkAndCreate(
  data: Omit<CheckIn, 'checkInId' | 'checkinTime'>
): Promise<{ success: boolean; alreadyCheckedIn?: boolean; checkInId?: string }> {
  try {
    const { userId, studioId } = data;

    // Nutze zwei getrennte Date-Objekte, um Mutation zu vermeiden
    const now = new Date();
    const startOfDayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const startOfDay = Timestamp.fromDate(startOfDayDate);
    const endOfDay = Timestamp.fromDate(endOfDayDate);

    // Suche nach bestehendem Check-in für heute
    const existing = await getDocs(
      query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('checkinTime', '>=', startOfDay),
        where('checkinTime', '<=', endOfDay)
      )
    );

    if (!existing.empty) {
      return {
        success: false,
        alreadyCheckedIn: true,
      };
    }

    // Erstelle neuen Check-in
    const payload: Omit<CheckIn, 'checkInId'> = {
      userId,
      studioId,
      checkinTime: Timestamp.now(),
    };

    const ref = await addDoc(collection(db, this.COLLECTION), payload);

    return {
      success: true,
      checkInId: ref.id,
    };
  } catch (error: any) {
    console.error('Fehler in checkAndCreate:', error);
    throw new Error(error.message || 'Fehler beim Erstellen des Check-Ins.');
  }
}




  /**
   * Get check-in statistics for a user
   */
  static async getUserCheckInStats(userId: string): Promise<{
    totalCheckIns: number;
    thisMonth: number;
    thisWeek: number;
    uniqueStudios: number;
    mostVisitedStudio: { studioId: string; count: number } | null;
  }> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [
        totalCheckIns,
        monthlyCheckIns,
        weeklyCheckIns,
        mostVisitedStudios
      ] = await Promise.all([
        this.getUserCheckInCount(userId),
        this.getUserCheckInHistory(userId, startOfMonth, now),
        this.getUserCheckInHistory(userId, startOfWeek, now),
        this.getUserMostVisitedStudios(userId, 1)
      ]);

      // Get unique studios from all check-ins
      const allCheckIns = await this.getUserCheckIns(userId, 1000);
      const uniqueStudios = new Set(allCheckIns.map(checkIn => checkIn.studioId)).size;

      return {
        totalCheckIns,
        thisMonth: monthlyCheckIns.length,
        thisWeek: weeklyCheckIns.length,
        uniqueStudios,
        mostVisitedStudio: mostVisitedStudios[0] || null,
      };
    } catch (error) {
      console.error('Error getting user check-in stats:', error);
      throw error;
    }
  }

  /**
   * Validate if user can check in (has active subscription)
   */
  static async canUserCheckIn(userId: string): Promise<boolean> {
    try {
      // This would typically check if user has an active subscription
      // For now, we'll assume all users can check in
      // In a real implementation, you'd check the subscription service
      return true;
    } catch (error) {
      console.error('Error validating user check-in permission:', error);
      return false;
    }
  }

  /**
   * Get recent check-ins across all studios (for admin dashboard)
   */
  static async getRecentCheckIns(limitCount: number = 50): Promise<CheckIn[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('checkinTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        checkInId: doc.id,
        ...doc.data()
      })) as CheckIn[];
    } catch (error) {
      console.error('Error getting recent check-ins:', error);
      throw error;
    }
  }
}
