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
  onSnapshot,
  Timestamp,
  Unsubscribe
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
        const data = docSnap.data() as any;
        return this.mapFirestoreDataToStudio(docSnap.id, data);
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return this.mapFirestoreDataToStudio(doc.id, data);
      });
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
    radiusKm: number = 10000
  ): Promise<Studio[]> {
    try {
      console.log(`📍 Getting studios by location: center(${centerLat}, ${centerLng}), radius: ${radiusKm}km`);
      
      // Note: For production, you'd want to use geohash queries for better performance
      // This is a simplified version that gets all studios and filters client-side
      const studios = await this.getStudios();
      console.log(`📊 Total studios fetched: ${studios.length}`);
      
      const filteredStudios = studios.filter(studio => {
        if (!studio.location) {
          console.log(`❌ Studio ${studio.name} filtered out: no location data`);
          return false;
        }
        
        const distance = this.calculateDistance(
          centerLat,
          centerLng,
          studio.location.lat,
          studio.location.lng
        );
        
        const withinRadius = distance <= radiusKm;
        console.log(`📏 Studio ${studio.name}: distance=${distance.toFixed(2)}km, withinRadius=${withinRadius}`);
        
        return withinRadius;
      });
      
      console.log(`✅ Studios within radius: ${filteredStudios.length}`);
      return filteredStudios;
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
      
      return studios.filter(studio => {
        const name = (studio.name ?? '').toLowerCase();
        const address = (studio.address ?? '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || address.includes(term);
      });
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
   * Subscribe to all studios with realtime updates
   */
  static subscribeToStudios(
    onUpdate: (studios: Studio[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('name', 'asc')
      );

      return onSnapshot(
        q,
        (querySnapshot) => {
          const studios = querySnapshot.docs.map(doc => {
            const data = doc.data() as any;
            return this.mapFirestoreDataToStudio(doc.id, data);
          });
          
          console.log(`🔄 Realtime update: ${studios.length} studios received`);
          onUpdate(studios);
        },
        (error) => {
          console.error('Error in studios realtime listener:', error);
          if (onError) {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error('Error setting up studios realtime listener:', error);
      if (onError) {
        onError(error as Error);
      }
      // Return a no-op unsubscribe function
      return () => {};
    }
  }

  /**
   * Subscribe to studios by location with realtime updates
   */
  static subscribeToStudiosByLocation(
    centerLat: number,
    centerLng: number,
    radiusKm: number = 10000,
    onUpdate: (studios: Studio[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      console.log(`📍 Setting up realtime listener for location: center(${centerLat}, ${centerLng}), radius: ${radiusKm}km`);
      
      // Subscribe to all studios and filter client-side
      // Note: For production, consider using geohash queries for better performance
      return this.subscribeToStudios(
        (allStudios) => {
          const filteredStudios = allStudios.filter(studio => {
            if (!studio.location) {
              console.log(`❌ Studio ${studio.name} filtered out: no location data`);
              return false;
            }
            
            const distance = this.calculateDistance(
              centerLat,
              centerLng,
              studio.location.lat,
              studio.location.lng
            );
            
            const withinRadius = distance <= radiusKm;
            console.log(`📏 Studio ${studio.name}: distance=${distance.toFixed(2)}km, withinRadius=${withinRadius}`);
            
            return withinRadius;
          });
          
          console.log(`✅ Realtime studios within radius: ${filteredStudios.length}`);
          onUpdate(filteredStudios);
        },
        onError
      );
    } catch (error) {
      console.error('Error setting up studios by location realtime listener:', error);
      if (onError) {
        onError(error as Error);
      }
      // Return a no-op unsubscribe function
      return () => {};
    }
  }

  /**
   * Subscribe to a single studio with realtime updates
   */
  static subscribeToStudio(
    studioId: string,
    onUpdate: (studio: Studio | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const docRef = doc(db, this.COLLECTION, studioId);
      
      return onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as any;
            const studio = this.mapFirestoreDataToStudio(docSnap.id, data);
            console.log(`🔄 Realtime update for studio ${studioId}:`, studio.name);
            onUpdate(studio);
          } else {
            console.log(`❌ Studio ${studioId} no longer exists`);
            onUpdate(null);
          }
        },
        (error) => {
          console.error(`Error in studio ${studioId} realtime listener:`, error);
          if (onError) {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error(`Error setting up studio ${studioId} realtime listener:`, error);
      if (onError) {
        onError(error as Error);
      }
      // Return a no-op unsubscribe function
      return () => {};
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

  /**
   * Map Firestore document data to Studio interface
   * Handles the schema mismatch between Firestore 'Map' (GeoPoint) and expected 'location'
   */
  private static mapFirestoreDataToStudio(studioId: string, data: any): Studio {
    console.log(`🏢 Mapping studio ${studioId}:`, JSON.stringify(data, null, 2));
    
    // Handle GeoPoint mapping from 'Map' field (primary source)
    let location = data.location;
    
    // First, check for the 'Map' field which contains the GeoPoint
    if (!location && data.Map) {
      const geoPoint = data.Map;
      location = {
        lat: geoPoint.latitude,
        lng: geoPoint.longitude,
        geohash: data.geohash // preserve geohash if it exists separately
      };
      console.log(`🗺️ Mapped GeoPoint from 'Map' field to location for ${studioId}:`, location);
    }
    // Fallback: If location doesn't exist but coordinates does, map it (backward compatibility)
    else if (!location && data.coordinates) {
      location = {
        lat: data.coordinates.lat,
        lng: data.coordinates.lng,
        geohash: data.coordinates.geohash // preserve geohash if it exists
      };
      console.log(`🔄 Mapped coordinates to location for ${studioId}:`, location);
    } else if (location) {
      console.log(`✅ Location already exists for ${studioId}:`, location);
    }
    
    // If none of the location sources exist, log a warning
    if (!location) {
      console.warn(`❌ Studio ${studioId} has no location data (checked: Map, location, coordinates)`);
    }

    const mappedStudio = {
      studioId,
      name: data.name ?? '',
      address: data.address ?? '',
      location,
      createdAt: data.createdAt,
      averageRating: data.averageRating,
      amenities: data.amenities,
      description: data.description,
      phone: data.phone,
      email: data.email,
      website: data.website,
      openingHours: data.openingHours,
      images: data.images,
      type: data.type,
      priceRange: data.priceRange,
      totalRatings: data.totalRatings,
      isActive: data.isActive
    } as Studio;

    console.log(`📍 Final mapped studio ${studioId}:`, {
      name: mappedStudio.name,
      location: mappedStudio.location
    });

    return mappedStudio;
  }
}
