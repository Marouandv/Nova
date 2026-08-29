"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import * as mockAuth from "@/lib/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// There is no session during server rendering (no backend to ask), so the
// server snapshot is always "signed out"; the client re-syncs with the real
// localStorage value right after hydration via useSyncExternalStore.
function getServerSnapshot() {
  return false;
}

// Thin React wrapper around the mock `src/lib/auth.ts` module (see that
// file for why this is an MVP placeholder without real security).
// `useSyncExternalStore` keeps this in sync with the localStorage-backed
// session so consumers (route guard, logout button) re-render on
// login/logout without manually reading localStorage on every render.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSyncExternalStore(
    mockAuth.subscribe,
    mockAuth.isAuthenticated,
    getServerSnapshot,
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: mockAuth.login,
        logout: mockAuth.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
