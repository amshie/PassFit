import { Timestamp } from 'firebase/firestore';

export interface Plan {
  planId: string;          // Dokument-ID
  name: string;
  priceCents: number;      // Preis in Cent
  currency: string;        // z.B. 'EUR'
  durationDays: number;    // Laufzeit in Tagen
  features: string[];      // z.B. ['Gymzugang', 'GroupClasses']
  createdAt: Timestamp;
  /** Denormalisierte Zähler */
  activeSubscriberCount?: number;
}
