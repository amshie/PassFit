import { Timestamp } from 'firebase/firestore';

export interface GymPass {
  passId: string;          // Dokument-ID
  userId: string;
  planId: string;
  issuedAt: Timestamp;
  validUntil: Timestamp;
  usedCount: number;
}
