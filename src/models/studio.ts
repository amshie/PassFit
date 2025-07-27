import { Timestamp } from 'firebase/firestore';

export interface Studio {
  studioId: string;           // Dokument-ID
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
    /** Optional: Geohash für GeoFire-Abfragen */
    geohash?: string;
  };
  createdAt: Timestamp;
  /** Denormalisierter Durchschnitts-Rating */
  averageRating?: number;
  /** Studio amenities and features */
  amenities?: string[];
  /** Studio description */
  description?: string;
  /** Contact information */
  phone?: string;
  email?: string;
  website?: string;
  /** Opening hours */
  openingHours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  /** Studio images */
  images?: string[];
  /** Studio type (gym, pool, wellness, etc.) */
  type?: string;
  /** Price range indicator */
  priceRange?: 'low' | 'medium' | 'high';
  /** Total number of ratings */
  totalRatings?: number;
  /** Whether studio is currently active */
  isActive?: boolean;
}

export interface StudioFilters {
  searchTerm?: string;
  radiusKm?: number;
  minRating?: number;
  amenities?: string[];
  type?: string;
  priceRange?: 'low' | 'medium' | 'high';
  isOpen?: boolean;
}
