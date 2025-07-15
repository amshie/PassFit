import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Studio } from '../../models/studio';

export class StudioService {
  private static readonly COLLECTION = 'studios';

  /**
   * Get a single studio by ID
   */
  static async getStudio(studioId: string): Promise<Studio | null> {
    try {
      const docRef = doc(db, this.COLLECTION, studioId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          studioId: docSnap.id,
          ...docSnap.data()
        } as Studio;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting studio:', error);
      throw error;
    }
  }

  /**
   * Get all studios
   */
  static async getStudios(): Promise<Studio[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        studioId: doc.id,
        ...doc.data()
      })) as Studio[];
    } catch (error) {
      console.error('Error getting studios:', error);
      throw error;
    }
  }

  /**
   * Get studios by location (within a certain radius)
   */
  static async getStudiosByLocation(
    centerLat: number,
    centerLng: number,
    radiusKm: number = 10
  ): Promise<Studio[]> {
    try {
      // Note: For production, you'd want to use geohash queries for better performance
      // This is a simplified version that gets all studios and filters client-side
      const studios = await this.getStudios();
      
      return studios.filter(studio => {
        if (!studio.location) return false;
        
        const distance = this.calculateDistance(
          centerLat,
          centerLng,
          studio.location.lat,
          studio.location.lng
        );
        
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error getting studios by location:', error);
      throw error;
    }
  }

  /**
   * Search studios by name
   */
  static async searchStudios(searchTerm: string): Promise<Studio[]> {
    try {
      // Firestore doesn't support full-text search natively
      // This is a simplified version - for production, consider using Algolia or similar
      const studios = await this.getStudios();
      
      return studios.filter(studio =>
        studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching studios:', error);
      throw error;
    }
  }

  /**
   * Create a new studio
   */
  static async createStudio(studioData: Omit<Studio, 'studioId'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...studioData,
        createdAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating studio:', error);
      throw error;
    }
  }

  /**
   * Update an existing studio
   */
  static async updateStudio(
    studioId: string,
    updates: Partial<Omit<Studio, 'studioId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, studioId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating studio:', error);
      throw error;
    }
  }

  /**
   * Delete a studio
   */
  static async deleteStudio(studioId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, studioId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting studio:', error);
      throw error;
    }
  }

  /**
   * Get studios with high ratings
   */
  static async getTopRatedStudios(limitCount: number = 10): Promise<Studio[]> {
    try {
      const studios = await this.getStudios();
      
      return studios
        .filter(studio => studio.averageRating !== undefined)
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting top rated studios:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
