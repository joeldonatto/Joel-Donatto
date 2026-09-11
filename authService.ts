import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { UserProfile } from './types';

/**
 * Maps a Firebase User object to an application UserProfile
 */
export const mapFirebaseUser = (user: User, role: 'admin' | 'editor' | 'viewer' = 'admin'): UserProfile => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Usuário CSSJD'),
    photoURL: user.photoURL,
    role
  };
};

/**
 * Saves or updates user profile in Firestore
 */
export async function syncUserProfileToFirestore(user: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        ...user,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, {
        lastLoginAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.warn('Firestore user profile sync error:', error);
  }
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const profile = mapFirebaseUser(cred.user);
  await syncUserProfileToFirestore(profile);
  return profile;
}

/**
 * Sign up a new user with email and password
 */
export async function registerWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (name.trim()) {
    try {
      await updateProfile(cred.user, { displayName: name.trim() });
    } catch (e) {
      console.warn('Profile name update error:', e);
    }
  }
  const profile = mapFirebaseUser(cred.user);
  if (name.trim()) profile.displayName = name.trim();
  await syncUserProfileToFirestore(profile);
  return profile;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const cred = await signInWithPopup(auth, googleProvider);
  const profile = mapFirebaseUser(cred.user);
  await syncUserProfileToFirestore(profile);
  return profile;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe to Auth State changes
 */
export function subscribeToAuth(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = mapFirebaseUser(firebaseUser);
      callback(profile);
    } else {
      callback(null);
    }
  });
}
