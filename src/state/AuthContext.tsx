import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StaffUser } from '../types';
import { subscribeAuthUser } from '../services/auth';
import { auth } from '../lib/firebase';
import { getStaffUser } from '../services/staff';

interface AuthContextValue {
  user: StaffUser | null;
  loading: boolean;
  /** Re-reads the Firestore profile for the current session — needed after
   *  flows like the force-password-change that mutate the profile doc but
   *  don't fire a Firebase Auth state change on their own. */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, refreshUser: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthUser((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUser = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const profile = await getStaffUser(uid);
    setUser(profile && profile.ativo ? profile : null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
