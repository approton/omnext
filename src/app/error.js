"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Omnext page error", error);
  }, [error]);
  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        <span className="eyebrow">Something went wrong</span>
        <h1>That didn’t go as planned.</h1>
        <p>
          Please try loading this page again. If the issue continues, return to the home page and
          try another route.
        </p>
        <button type="button" onClick={() => reset()}>
          Try again <span aria-hidden="true">↻</span>
        </button>
      </div>
    </main>
  );
}
