import type { AuthSession } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ─── Storage Key ──────────────────────────────────────────────────────────────
const SESSION_KEY = '@trackandgo:session';

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore persisted session on mount
  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((raw) => {
        if (raw) setSession(JSON.parse(raw) as AuthSession);
      })
      .catch((err) => console.error('[AuthContext] Failed to restore session:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (newSession: AuthSession) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
