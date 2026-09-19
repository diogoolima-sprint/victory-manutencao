// Firebase Auth requires an email identifier for password auth, but the
// product only ever asks for a username (some staff have no email of
// their own — see chats/chat5.md). We map 1:1 to a synthetic address on a
// non-routable internal domain; it's never sent anywhere, only used as
// the Auth SDK's account key.
const SYNTHETIC_DOMAIN = 'victory.internal';

export function usernameToSyntheticEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${SYNTHETIC_DOMAIN}`;
}

export function isSyntheticEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${SYNTHETIC_DOMAIN}`);
}
