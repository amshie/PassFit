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
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Plan } from '../../models/plan';

export class PlanService {
  private static readonly COLLECTION = 'plans';

  /**
   * Get a single plan by ID
   */
  static async getPlan(planId: string): Promise<Plan | null> {
    try {
      const docRef = doc(db, this.COLLECTION, planId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          planId: docSnap.id,
          ...docSnap.data()
        } as Plan;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting plan:', error);
      throw error;
    }
  }

  /**
   * Get all plans
   */
  static async getPlans(): Promise<Plan[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('priceCents', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        planId: doc.id,
        ...doc.data()
      })) as Plan[];
    } catch (error) {
      console.error('Error getting plans:', error);
      throw error;
    }
  }

  /**
   * Get plans by price range
   */
  static async getPlansByPriceRange(
    minPriceCents: number,
    maxPriceCents: number
  ): Promise<Plan[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('priceCents', '>=', minPriceCents),
        where('priceCents', '<=', maxPriceCents),
        orderBy('priceCents', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        planId: doc.id,
        ...doc.data()
      })) as Plan[];
    } catch (error) {
      console.error('Error getting plans by price range:', error);
      throw error;
    }
  }

  /**
   * Get plans by duration
   */
  static async getPlansByDuration(durationDays: number): Promise<Plan[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('durationDays', '==', durationDays),
        orderBy('priceCents', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        planId: doc.id,
        ...doc.data()
      })) as Plan[];
    } catch (error) {
      console.error('Error getting plans by duration:', error);
      throw error;
    }
  }

  /**
   * Get plans by currency
   */
  static async getPlansByCurrency(currency: string): Promise<Plan[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('currency', '==', currency),
        orderBy('priceCents', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        planId: doc.id,
        ...doc.data()
      })) as Plan[];
    } catch (error) {
      console.error('Error getting plans by currency:', error);
      throw error;
    }
  }

  /**
   * Get most popular plans (by active subscriber count)
   */
  static async getPopularPlans(limitCount: number = 5): Promise<Plan[]> {
    try {
      const plans = await this.getPlans();
      
      return plans
        .filter(plan => plan.activeSubscriberCount !== undefined)
        .sort((a, b) => (b.activeSubscriberCount || 0) - (a.activeSubscriberCount || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting popular plans:', error);
      throw error;
    }
  }

  /**
   * Search plans by name or features
   */
  static async searchPlans(searchTerm: string): Promise<Plan[]> {
    try {
      const plans = await this.getPlans();
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return plans.filter(plan =>
        plan.name.toLowerCase().includes(lowerSearchTerm) ||
        plan.features.some(feature => 
          feature.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } catch (error) {
      console.error('Error searching plans:', error);
      throw error;
    }
  }

  /**
   * Create a new plan
   */
  static async createPlan(planData: Omit<Plan, 'planId'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...planData,
        createdAt: Timestamp.now(),
        activeSubscriberCount: 0
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  /**
   * Update an existing plan
   */
  static async updatePlan(
    planId: string,
    updates: Partial<Omit<Plan, 'planId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, planId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  /**
   * Delete a plan
   */
  static async deletePlan(planId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, planId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  /**
   * Update active subscriber count
   */
  static async updateActiveSubscriberCount(
    planId: string,
    count: number
  ): Promise<void> {
    try {
      await this.updatePlan(planId, { activeSubscriberCount: count });
    } catch (error) {
      console.error('Error updating active subscriber count:', error);
      throw error;
    }
  }

  /**
   * Increment active subscriber count
   */
  static async incrementActiveSubscriberCount(planId: string): Promise<void> {
    try {
      const plan = await this.getPlan(planId);
      if (plan) {
        const newCount = (plan.activeSubscriberCount || 0) + 1;
        await this.updateActiveSubscriberCount(planId, newCount);
      }
    } catch (error) {
      console.error('Error incrementing active subscriber count:', error);
      throw error;
    }
  }

  /**
   * Decrement active subscriber count
   */
  static async decrementActiveSubscriberCount(planId: string): Promise<void> {
    try {
      const plan = await this.getPlan(planId);
      if (plan) {
        const newCount = Math.max((plan.activeSubscriberCount || 0) - 1, 0);
        await this.updateActiveSubscriberCount(planId, newCount);
      }
    } catch (error) {
      console.error('Error decrementing active subscriber count:', error);
      throw error;
    }
  }

  /**
   * Get plan statistics
   */
  static async getPlanStats(): Promise<{
    totalPlans: number;
    totalActiveSubscribers: number;
    averagePrice: number;
    mostPopularPlan: Plan | null;
    priceRange: { min: number; max: number };
  }> {
    try {
      const plans = await this.getPlans();
      
      if (plans.length === 0) {
        return {
          totalPlans: 0,
          totalActiveSubscribers: 0,
          averagePrice: 0,
          mostPopularPlan: null,
          priceRange: { min: 0, max: 0 }
        };
      }

      const totalActiveSubscribers = plans.reduce(
        (sum, plan) => sum + (plan.activeSubscriberCount || 0),
        0
      );

      const averagePrice = plans.reduce(
        (sum, plan) => sum + plan.priceCents,
        0
      ) / plans.length;

      const mostPopularPlan = plans.reduce((prev, current) =>
        (current.activeSubscriberCount || 0) > (prev.activeSubscriberCount || 0)
          ? current
          : prev
      );

      const prices = plans.map(plan => plan.priceCents);
      const priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };

      return {
        totalPlans: plans.length,
        totalActiveSubscribers,
        averagePrice,
        mostPopularPlan,
        priceRange
      };
    } catch (error) {
      console.error('Error getting plan stats:', error);
      throw error;
    }
  }

  /**
   * Format price for display
   */
  static formatPrice(priceCents: number, currency: string = 'EUR'): string {
    const price = priceCents / 100;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Calculate monthly price for plans with different durations
   */
  static calculateMonthlyPrice(priceCents: number, durationDays: number): number {
    const monthsInDuration = durationDays / 30.44; // Average days per month
    return Math.round(priceCents / monthsInDuration);
  }
}
