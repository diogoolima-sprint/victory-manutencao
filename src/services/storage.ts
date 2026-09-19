import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Uploads a photo picked via expo-image-picker (local file:// or
 * content:// URI) to Firebase Storage and returns its download URL.
 * `folder` groups uploads (e.g. `tickets/{ticketId}` or `drafts/{draftId}`
 * for photos attached before the ticket document exists yet).
 */
export async function uploadPhoto(localUri: string, folder: string): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const storageRef = ref(storage, `${folder}/${filename}`);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}
