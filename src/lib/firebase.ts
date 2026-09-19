import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  connectAuthEmulator,
  type Auth,
} from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const USE_EMULATOR = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
export const EMULATOR_HOST = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST || '127.0.0.1';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth must be called exactly once per app instance, with RN
// persistence wired up front — getAuth() alone falls back to in-memory
// persistence on React Native and silently drops sessions on reload.
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Fast-refresh in dev can re-run this module; initializeAuth throws if
  // already initialized for this app instance, so reuse it instead.
  auth = getAuth(app);
}

const db: Firestore = initializeFirestore(app, {
  // Avoids WebChannel streaming hiccups when talking to the local emulator.
  experimentalForceLongPolling: USE_EMULATOR,
});

const storage: FirebaseStorage = getStorage(app);

// Connect emulators once, before any network call is made. Guarded by a
// global flag so Fast Refresh re-running this module doesn't try to
// reconnect (the SDKs throw if you do).
const g = globalThis as unknown as { __victoryEmulatorsConnected?: boolean };
if (USE_EMULATOR && !g.__victoryEmulatorsConnected) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
  connectStorageEmulator(storage, EMULATOR_HOST, 9199);
  g.__victoryEmulatorsConnected = true;
}

export { app, auth, db, storage };
