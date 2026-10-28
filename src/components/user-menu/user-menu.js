"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-provider/auth-provider";
import { useTheme } from "../theme-provider/theme-provider";
import { getSafeReturnPath } from "../../features/auth/return-path";
import styles from "./user-menu.module.css";

function formatTimeLeft(expiresAt, now) {
  if (!expiresAt) return "";
  const seconds = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(0);
  const menuRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const { session, ready, busy, error, setError, startGuestSession, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (session?.type !== "guest") return undefined;
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, [session]);

  async function enterAsGuest() {
    const defaultPath = ["/", "/login", "/signup"].includes(window.location.pathname)
      ? "/products"
      : window.location.pathname;
    const destination = getSafeReturnPath(window.location.search, defaultPath);

    if (await startGuestSession()) {
      setOpen(false);
      window.location.assign(destination);
    }
  }

  const displayName = session?.name || session?.email || "Omnext member";

  return (
    <div className={styles.root} ref={menuRef}>
      <button
        className={styles.trigger}
        type="button"
        aria-label="Account and preferences"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-popover"
        data-depth="2"
        onClick={() => {
          setError("");
          setOpen((value) => !value);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
        {session && <i className={styles.statusDot} aria-label="Signed in" />}
      </button>

      {open && (
        <section className={styles.panel} id="account-popover" aria-label="Account and preferences">
          <div className={styles.panelTop}>
            <div className={styles.avatar} aria-hidden="true">
              {session ? displayName.slice(0, 1).toUpperCase() : "O"}
            </div>
            <div>
              <p className={styles.overline}>{session ? "SIGNED IN" : "YOUR OMNEXT"}</p>
              <p className={styles.name}>
                {!ready ? "Checking session…" : session ? displayName : "Welcome"}
              </p>
              {session?.type === "guest" && (
                <p className={styles.sessionTime}>
                  Read-only guest · {formatTimeLeft(session.expiresAt, now)} left
                </p>
              )}
              {session?.type === "user" && session.email && (
                <p className={styles.sessionTime}>{session.email}</p>
              )}
            </div>
          </div>

          {!session && (
            <div className={styles.authActions}>
              <Link href="/login" className={styles.signIn} onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/signup" className={styles.signUp} onClick={() => setOpen(false)}>
                Sign up
              </Link>
              <button className={styles.guest} type="button" disabled={busy} onClick={enterAsGuest}>
                {busy ? "Starting 2-minute guest session…" : "Continue as a 2-minute guest"}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.preferences}>
            <div>
              <p className={styles.sectionTitle}>Preferences</p>
              <label htmlFor="theme-choice">Appearance</label>
            </div>
            <select
              id="theme-choice"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {session && (
            <button className={styles.signOut} type="button" onClick={signOut}>
              End session <span aria-hidden="true">→</span>
            </button>
          )}
        </section>
      )}
    </div>
  );
}
