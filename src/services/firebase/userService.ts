// src/services/firebase/userService.ts
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import { User } from '../../models';

/**
 * Lädt das User-Dokument anhand der UID.
 */
export async function loadUserProfile(uid: string): Promise<User> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('User nicht gefunden');
  
  const userData = snap.data() as User;
  
  // Ensure subscriptionStatus is always defined, default to 'free'
  if (!userData.subscriptionStatus) {
    userData.subscriptionStatus = 'free';
  }
  
  return userData;
}

/**
 * Legt ein neues User-Dokument an.
 * @param uid  die eindeutige User-ID (gleich Dokument-ID)
 * @param data alle weiteren Felder außer uid und createdAt
 */
export async function createUserProfile(
  uid: string,
  data: Omit<User, 'uid' | 'createdAt'>
): Promise<void> {
  const payload: Partial<User> = {
    uid,
    ...data,
    createdAt: Timestamp.now(),
  };

  // Only add age if birthdate is provided
  if (data.birthdate) {
    payload.age = Math.floor(
      (Timestamp.now().toMillis() - data.birthdate.toMillis()) /
        (1000 * 60 * 60 * 24 * 365)
    );
  }

  await setDoc(doc(db, 'users', uid), payload);
}

/**
 * Updated einzelne Felder des User-Dokuments.
 * Merge sorgt dafür, dass nur gegebene Felder überschrieben werden.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<User, 'uid' | 'createdAt'>>
): Promise<void> {
  const payload: Partial<User> = { ...data };

  if (data.birthdate instanceof Date) {
    payload.birthdate = Timestamp.fromDate(data.birthdate);
  }

  if (payload.birthdate instanceof Timestamp) {
    payload.age = Math.floor(
      (Timestamp.now().toMillis() - payload.birthdate.toMillis()) /
        (1000 * 60 * 60 * 24 * 365)
    );
  }

  await setDoc(doc(db, 'users', uid), payload, { merge: true });
}

/**
 * Löscht das User-Dokument.
 */
export async function deleteUserProfile(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid));
}

/**
 * Abonniert Änderungen am User-Dokument in Echtzeit.
 * @param uid die eindeutige User-ID
 * @param onUpdate Callback-Funktion, die bei Änderungen aufgerufen wird
 * @param onError Callback-Funktion für Fehlerbehandlung
 * @returns Unsubscribe-Funktion zum Beenden des Listeners
 */
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (user: User | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const userRef = doc(db, 'users', uid);
  
  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data() as User;
        onUpdate(userData);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error in user profile listener:', error);
      if (onError) {
        onError(error);
      }
    }
  );
}

/**
 * Synchronisiert den subscriptionStatus im User-Dokument.
 * Diese Funktion wird verwendet, um den denormalisierten Status zu aktualisieren.
 */
export async function syncUserSubscriptionStatus(
  uid: string,
  subscriptionStatus: User['subscriptionStatus']
): Promise<void> {
  try {
    await setDoc(
      doc(db, 'users', uid),
      { subscriptionStatus },
      { merge: true }
    );
  } catch (error) {
    console.error('Error syncing user subscription status:', error);
    throw error;
  }
}
