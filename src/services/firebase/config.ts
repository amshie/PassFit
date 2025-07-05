// Re-export the existing Firebase configuration
export { app, auth, analytics } from '../../../firebase';

import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { app } from '../../../firebase';

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Storage
export const storage: FirebaseStorage = getStorage(app);
