import { Timestamp } from 'firebase/firestore';

export interface Payment {
  paymentId: string;        // Dokument-ID
  userId: string;           // Referenz zu User.uid
  subscriptionId: string;   // Referenz zu Subscription.subscriptionId
  amountCents: number;
  currency: string;         // z.B. 'EUR'
  status: 'success' | 'failed' | 'pending';
  processedAt: Timestamp;
}
