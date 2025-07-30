import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Subscription } from '../../models/subscription';

export class SubscriptionService {
  private static readonly COLLECTION = 'subscriptions';

  /**
   * Get a single subscription by ID
   */
  static async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const docRef = doc(db, this.COLLECTION, subscriptionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          subscriptionId: docSnap.id,
          ...docSnap.data()
        } as Subscription;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  /**
   * Get all subscriptions for a user
   */
  static async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      // Use simpler query and sort in code to avoid index requirement
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const subscriptions = querySnapshot.docs.map(doc => ({
        subscriptionId: doc.id,
        ...doc.data()
      })) as Subscription[];
      
      // Sort by startedAt in descending order
      subscriptions.sort((a, b) => {
        const aTime = a.startedAt.toMillis();
        const bTime = b.startedAt.toMillis();
        return bTime - aTime; // Descending order
      });
      
      return subscriptions;
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      throw error;
    }
  }

  /**
   * Get active subscription for a user
   */
  static async getActiveUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      // Use a simpler query to avoid composite index requirement
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      // Convert to array and sort by expiresAt in descending order (most recent first)
      const subscriptions = querySnapshot.docs.map(doc => ({
        subscriptionId: doc.id,
        ...doc.data()
      })) as Subscription[];
      
      // Sort by expiresAt in descending order and return the first (most recent)
      subscriptions.sort((a, b) => {
        const aTime = a.expiresAt.toMillis();
        const bTime = b.expiresAt.toMillis();
        return bTime - aTime; // Descending order
      });
      
      return subscriptions[0] || null;
    } catch (error) {
      console.error('Error getting active user subscription:', error);
      throw error;
    }
  }

  /**
   * Get subscriptions by plan
   */
  static async getSubscriptionsByPlan(planId: string): Promise<Subscription[]> {
    try {
      // Use simpler query and sort in code to avoid index requirement
      const q = query(
        collection(db, this.COLLECTION),
        where('planId', '==', planId)
      );
      
      const querySnapshot = await getDocs(q);
      const subscriptions = querySnapshot.docs.map(doc => ({
        subscriptionId: doc.id,
        ...doc.data()
      })) as Subscription[];
      
      // Sort by startedAt in descending order
      subscriptions.sort((a, b) => {
        const aTime = a.startedAt.toMillis();
        const bTime = b.startedAt.toMillis();
        return bTime - aTime; // Descending order
      });
      
      return subscriptions;
    } catch (error) {
      console.error('Error getting subscriptions by plan:', error);
      throw error;
    }
  }

  /**
   * Get subscriptions by status
   */
  static async getSubscriptionsByStatus(
    status: Subscription['status']
  ): Promise<Subscription[]> {
    try {
      // Use simpler query and sort in code to avoid index requirement
      const q = query(
        collection(db, this.COLLECTION),
        where('status', '==', status)
      );
      
      const querySnapshot = await getDocs(q);
      const subscriptions = querySnapshot.docs.map(doc => ({
        subscriptionId: doc.id,
        ...doc.data()
      })) as Subscription[];
      
      // Sort by startedAt in descending order
      subscriptions.sort((a, b) => {
        const aTime = a.startedAt.toMillis();
        const bTime = b.startedAt.toMillis();
        return bTime - aTime; // Descending order
      });
      
      return subscriptions;
    } catch (error) {
      console.error('Error getting subscriptions by status:', error);
      throw error;
    }
  }

  /**
   * Get expiring subscriptions (within specified days)
   */
  static async getExpiringSubscriptions(withinDays: number = 7): Promise<Subscription[]> {
    try {
      const now = Timestamp.now();
      const futureDate = Timestamp.fromDate(
        new Date(Date.now() + withinDays * 24 * 60 * 60 * 1000)
      );
      
      // Use simpler query and filter/sort in code to avoid complex index requirement
      const q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const subscriptions = querySnapshot.docs.map(doc => ({
        subscriptionId: doc.id,
        ...doc.data()
      })) as Subscription[];
      
      // Filter by expiration date range and sort
      const expiringSubscriptions = subscriptions
        .filter(sub => {
          const expiresAtMillis = sub.expiresAt.toMillis();
          const nowMillis = now.toMillis();
          const futureDateMillis = futureDate.toMillis();
          return expiresAtMillis >= nowMillis && expiresAtMillis <= futureDateMillis;
        })
        .sort((a, b) => {
          const aTime = a.expiresAt.toMillis();
          const bTime = b.expiresAt.toMillis();
          return aTime - bTime; // Ascending order (earliest expiration first)
        });
      
      return expiringSubscriptions;
    } catch (error) {
      console.error('Error getting expiring subscriptions:', error);
      throw error;
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(
    subscriptionData: Omit<Subscription, 'subscriptionId'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), subscriptionData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscription status
   */
  static async updateSubscriptionStatus(
    subscriptionId: string,
    status: Subscription['status']
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, subscriptionId);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    subscriptionId: string,
    updates: Partial<Omit<Subscription, 'subscriptionId'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, subscriptionId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.updateSubscriptionStatus(subscriptionId, 'canceled');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Renew a subscription (extend expiry date)
   */
  static async renewSubscription(
    subscriptionId: string,
    extensionDays: number
  ): Promise<void> {
    try {
      const subscription = await this.getSubscription(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const currentExpiry = subscription.expiresAt.toDate();
      const newExpiry = new Date(currentExpiry.getTime() + extensionDays * 24 * 60 * 60 * 1000);

      await this.updateSubscription(subscriptionId, {
        expiresAt: Timestamp.fromDate(newExpiry),
        status: 'active'
      });
    } catch (error) {
      console.error('Error renewing subscription:', error);
      throw error;
    }
  }

  /**
   * Delete a subscription
   */
  static async deleteSubscription(subscriptionId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, subscriptionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const activeSubscription = await this.getActiveUserSubscription(userId);
      return activeSubscription !== null;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      throw error;
    }
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    canceled: number;
    pending: number;
  }> {
    try {
      const [active, expired, canceled, pending] = await Promise.all([
        this.getSubscriptionsByStatus('active'),
        this.getSubscriptionsByStatus('expired'),
        this.getSubscriptionsByStatus('canceled'),
        this.getSubscriptionsByStatus('pending')
      ]);

      return {
        total: active.length + expired.length + canceled.length + pending.length,
        active: active.length,
        expired: expired.length,
        canceled: canceled.length,
        pending: pending.length
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      throw error;
    }
  }
}
