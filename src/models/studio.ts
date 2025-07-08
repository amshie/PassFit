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
}
