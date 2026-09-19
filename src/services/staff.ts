import { collection, doc, onSnapshot, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StaffUser } from '../types';

export function subscribeStaff(callback: (staff: StaffUser[]) => void): () => void {
  const q = query(collection(db, 'users'), orderBy('name'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StaffUser, 'id'>) })));
  });
}

export async function getStaffUser(uid: string): Promise<StaffUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<StaffUser, 'id'>) };
}
