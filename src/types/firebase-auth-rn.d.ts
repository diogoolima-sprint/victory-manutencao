// `getReactNativePersistence` is real at runtime — Metro resolves
// `firebase/auth` through `@firebase/auth`'s "react-native" package.json
// condition, whose RN-specific build exports it. But `tsc` doesn't do
// platform-conditional resolution the way Metro does, so its type-only
// view of `firebase/auth` (the platform-agnostic default build) is
// missing this one export. This augmentation fills that gap without
// touching moduleResolution/customConditions project-wide.
import type { Persistence } from '@firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
