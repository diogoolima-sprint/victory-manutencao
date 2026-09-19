import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Hotel } from '../types';

export function subscribeHotels(callback: (hotels: Hotel[]) => void): () => void {
  const q = query(collection(db, 'hotels'), orderBy('name'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Hotel, 'id'>) })));
  });
}
