import { Timestamp } from 'firebase/firestore';

export interface Subscription {
  subscriptionId: string;      // Dokument-ID
  userId: string;              // Referenz zu User.uid
  planId: string;              // Referenz zu Plan.planId
  startedAt: Timestamp;
  expiresAt: Timestamp;
  status: 'pending' | 'active' | 'canceled' | 'expired';
}
