"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { isPublicPage } from "../../features/auth/route-access";

const AuthContext = createContext(null);
const API_BASE = "/api/v1";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();

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
    const onPageShow = (event) => {
      // Browser Back can restore a document from before login/logout, including its old state.
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refreshSession]);

  useEffect(() => {
    if (!ready || session || isPublicPage(pathname)) return;
    const returnPath = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(`/login?next=${encodeURIComponent(returnPath)}`);
  }, [pathname, ready, session]);

  useEffect(() => {
    if (!ready || !session?.expiresAt) return undefined;
    const expiryDelay = new Date(session.expiresAt).getTime() - Date.now();
    const expiryTimer = window.setTimeout(
      () => {
        setSession(null);
        // Expiry also invalidates previously visited/prefetched protected routes.
        if (isPublicPage(window.location.pathname)) {
          window.location.reload();
        } else {
          const returnPath =
            window.location.pathname + window.location.search + window.location.hash;
          window.location.replace(`/login?next=${encodeURIComponent(returnPath)}`);
        }
      },
      Math.max(0, expiryDelay),
    );
    return () => window.clearTimeout(expiryTimer);
  }, [pathname, ready, session]);

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
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");
      // A Route Handler clears the cookie, but does not invalidate cached client routes.
      // Start a new document so previously visited protected pages cannot be reused.
      window.location.replace("/");
    } catch {
      setError("We couldn’t end your session. Please try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo(
    () => ({ session, ready, busy, error, setError, startGuestSession, signOut, refreshSession }),
    [session, ready, busy, error, startGuestSession, signOut, refreshSession],
  );

  // Cached/history navigation can bypass Proxy. Never display a protected page
  // until the session endpoint has confirmed access for this document.
  const checkingAccess = !isPublicPage(pathname) && (!ready || !session);

  return (
    <AuthContext.Provider value={value}>
      {checkingAccess ? (
        <main id="main-content" className="container" role="status" aria-live="polite">
          <p>Checking your session…</p>
        </main>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
