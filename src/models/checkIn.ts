import { Timestamp } from 'firebase/firestore';

export interface CheckIn {
  checkInId: string;       // Dokument-ID
  userId: string;          // Referenz zu User.uid
  studioId: string;        // Referenz zu Studio.studioId
  checkinTime: Timestamp;
}
