import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { usernameToSyntheticEmail } from '../lib/username';
import { getStaffUser } from './staff';
import { StaffUser } from '../types';

export class LoginError extends Error {}

/**
 * Username + password login (no email shown anywhere in the UI — see
 * chats/chat5.md, "Não quero e-mail, quero nome de usuário"). Internally
 * this signs in with a synthetic email 1:1 mapped from the username.
 */
export async function loginWithUsername(username: string, password: string): Promise<StaffUser> {
  const email = usernameToSyntheticEmail(username);
  let firebaseUser: FirebaseUser;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    firebaseUser = cred.user;
  } catch {
    // Firebase reports several distinct codes (user-not-found, wrong-password,
    // invalid-credential...) — the prototype never distinguished them to the
    // user, and neither do we (avoids leaking which usernames exist).
    throw new LoginError('Usuário ou senha inválidos.');
  }

  const profile = await getStaffUser(firebaseUser.uid);
  if (!profile || !profile.ativo) {
    await signOut(auth);
    throw new LoginError('Usuário ou senha inválidos.');
  }
  return profile;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * First-login password reset (6-digit numeric password, enforced by the
 * caller). Updates the Firebase Auth credential and clears the
 * mustChangePassword flag on the user's profile doc in the same step.
 */
export async function completeForcePasswordChange(uid: string, newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Not signed in');
  await updatePassword(auth.currentUser, newPassword);
  await updateDoc(doc(db, 'users', uid), { mustChangePassword: false });
}

export function subscribeAuthUser(callback: (user: StaffUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    const profile = await getStaffUser(firebaseUser.uid);
    callback(profile && profile.ativo ? profile : null);
  });
}
