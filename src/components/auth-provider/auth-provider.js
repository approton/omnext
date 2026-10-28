"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext(null);
const API_BASE = "/api/v1";
const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/session`, {
        credentials: "include",
        cache: "no-store",
      });
      const result = response.ok ? await response.json() : null;
      const currentSession = result?.data?.session ?? null;
      setSession(currentSession);
      return currentSession;
    } catch {
      setSession(null);
      return null;
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(refreshSession);
  }, [refreshSession]);

  useEffect(() => {
    if (!ready || !session?.expiresAt) return undefined;
    const expiryDelay = new Date(session.expiresAt).getTime() - Date.now();
    if (expiryDelay <= 0) {
      if (!PUBLIC_PATHS.has(pathname))
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      const expiredSessionTimer = window.setTimeout(() => setSession(null), 0);
      return () => window.clearTimeout(expiredSessionTimer);
    }

    const expiryTimer = window.setTimeout(() => {
      setSession(null);
      if (!PUBLIC_PATHS.has(pathname))
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }, expiryDelay);
    return () => window.clearTimeout(expiryTimer);
  }, [pathname, ready, router, session]);

  const startGuestSession = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/auth/guest`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error?.message || "The guest session could not be started.");
        return false;
      }
      const session = await refreshSession();
      if (session?.type !== "guest") {
        setError("We could not confirm the guest session. Please try again.");
        return false;
      }
      return true;
    } catch {
      setError("The authentication service is unavailable. Please try again in a moment.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setSession(null);
      router.replace("/");
    }
  }, [router]);

  const value = useMemo(
    () => ({ session, ready, busy, error, setError, startGuestSession, signOut, refreshSession }),
    [session, ready, busy, error, startGuestSession, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
