// src/services/firebase/userService.ts
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../../models';

/**
 * Lädt das User-Dokument anhand der UID.
 */
export async function loadUserProfile(uid: string): Promise<User> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('User nicht gefunden');
  return snap.data() as User;
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
