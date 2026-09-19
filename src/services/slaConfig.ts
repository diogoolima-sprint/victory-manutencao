import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SlaConfig } from '../types';

export function subscribeSlaConfig(callback: (config: SlaConfig) => void): () => void {
  return onSnapshot(doc(db, 'slaConfig', 'default'), (snap) => {
    if (snap.exists()) callback(snap.data() as SlaConfig);
  });
}
