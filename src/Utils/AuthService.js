// src/utils/AuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class AuthService {
  /**
   * Registriert einen neuen Nutzer, sendet Verifizierungs-Mail
   * und legt Name, Username, E-Mail in Firestore ab.
   */
  async signUp(name, username, email, password) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(user);
    await setDoc(doc(db, 'users', user.uid), { name, username, email });
    return user;
  }

  /**
   * Loggt einen Nutzer ein und wirft Fehler,
   * wenn die E-Mail nicht verifiziert ist.
   */
  async login(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (!user.emailVerified) {
      throw new Error('Bitte bestätige zuerst deine E-Mail.');
    }
    return user;
  }

  /**
   * Sendet eine Passwort-Reset-Mail an die angegebene E-Mail.
   */
  resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  /**
   * Loggt den aktuellen Nutzer aus.
   */
  logout() {
    return signOut(auth);
  }
}

// Singleton-Export, überall dieselbe Instanz:
export default new AuthService();
