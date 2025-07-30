import { Timestamp } from 'firebase/firestore';

export interface User {
  /** UID des Users (gleich Dokument-ID) */
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  /** Denormalisierter Abo-Status für schnelle UI-Abfragen */
  subscriptionStatus?: 'active' | 'free' | 'expired';
  /** Optional: zusätzliche Profildaten */
  firstName?: string;
  lastName?: string;
  sex?: 'M' | 'F' | 'D';
  birthdate?: Timestamp;
  age?: number;
}
