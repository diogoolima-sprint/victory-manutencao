import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Sector } from '../types';

export function subscribeSectors(callback: (sectors: Sector[]) => void): () => void {
  const q = query(collection(db, 'sectors'), orderBy('name'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sector, 'id'>) })));
  });
}
