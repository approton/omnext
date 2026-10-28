"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandMark from "../brand-mark/brand-mark";
import { useAuth } from "../auth-provider/auth-provider";
import { getSafeReturnPath } from "../../features/auth/return-path";
import AuthMethods from "../auth-methods/auth-methods";
import styles from "./auth-portal.module.css";

export default function AuthPortal({ mode }) {
  const [providerReady, setProviderReady] = useState(false);
  const [checkingProvider, setCheckingProvider] = useState(true);
  const [startingSignIn, setStartingSignIn] = useState(false);
  const { busy, error, setError, startGuestSession } = useAuth();
  const router = useRouter();
  const isSignup = mode === "signup";

  useEffect(() => {
    fetch("/api/v1/auth/configuration", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => setProviderReady(result?.data?.registeredSignInConfigured === true))
      .catch(() => setProviderReady(false))
      .finally(() => setCheckingProvider(false));
    if (new URLSearchParams(window.location.search).has("authError")) {
      setError("We couldn’t complete sign-in. Please try again.");
    }
  }, [setError]);

  function startRegisteredSignIn() {
    setStartingSignIn(true);
    setError("");
    const loginUrl = new URL("/api/v1/auth/login", window.location.origin);
    loginUrl.searchParams.set("next", getSafeReturnPath(window.location.search));
    window.location.assign(loginUrl.toString());
  }

  async function continueAsGuest() {
    if (await startGuestSession()) {
      // Force a document request so the protected route checks the newly issued session cookie.
      window.location.assign(getSafeReturnPath(window.location.search));
    }
  }

  function preserveReturnPath(event) {
    const destination = isSignup ? "/login" : "/signup";
    const returnPath = getSafeReturnPath(window.location.search, null);
    if (!returnPath) return;

    event.preventDefault();
    router.push(`${destination}?next=${encodeURIComponent(returnPath)}`);
  }

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.scene} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <section className={styles.card} data-depth="1">
        <Link className={styles.brand} href="/" aria-label="Omnext home">
          <span>
            <BrandMark />
          </span>
          Omnext
        </Link>
        <p className="eyebrow">{isSignup ? "START WITH OMNEXT" : "WELCOME BACK"}</p>
        <h1>{isSignup ? "Make your next move." : "Step back in."}</h1>
        <p className={styles.description}>
          Sign in with your email and password, Google, or Microsoft. Omnext protects supported
          methods with a second verification step.
        </p>

        <AuthMethods />

        <div className={styles.providerState} role="status" aria-live="polite">
          <span className={providerReady ? styles.ready : styles.pending} aria-hidden="true" />
          {checkingProvider
            ? "Preparing secure sign-in…"
            : providerReady
              ? "Choose a sign-in method on the secure Microsoft-hosted page. Your password is never sent to Omnext."
              : "Email, Google, and Microsoft sign-in become available after identity setup in Azure."}
        </div>

        <button
          className={styles.identityButton}
          type="button"
          disabled={checkingProvider || !providerReady || startingSignIn}
          onClick={startRegisteredSignIn}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.8 20 6v5.3c0 5-3.4 8.2-8 9.9-4.6-1.7-8-4.9-8-9.9V6l8-3.2Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="m8.7 12.2 2.1 2.1 4.6-4.7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {startingSignIn
            ? "Opening secure sign-in…"
            : isSignup
              ? "Sign up or sign in securely"
              : "Continue to secure sign-in"}
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button
          className={styles.guestButton}
          type="button"
          disabled={busy}
          onClick={continueAsGuest}
        >
          {busy ? "Preparing your guest session…" : "Explore as a 2-minute guest"}
          <span aria-hidden="true">↗</span>
        </button>
        <p className={styles.guestNote}>
          Read-only access. Your session ends automatically after two minutes.
        </p>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <p className={styles.switchMode}>
          {isSignup ? "Already have an account?" : "New to Omnext?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"} onClick={preserveReturnPath}>
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>

        <p className={styles.accessibilityNote}>
          You can change the site theme from the account icon. Motion follows your device’s
          reduced-motion setting.
        </p>
      </section>
    </main>
  );
}
