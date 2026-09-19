import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category } from '../types';

export function subscribeCategories(callback: (categories: Category[]) => void): () => void {
  const q = query(collection(db, 'categories'), orderBy('name'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) })));
  });
}
