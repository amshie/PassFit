// src/models/workoutShare.ts
import { Timestamp } from 'firebase/firestore';

export interface WorkoutShare {
  shareId: string;
  fromUserId: string;
  toUserId: string;
  workoutData: Record<string, any>;
  sharedAt: Timestamp;
}
