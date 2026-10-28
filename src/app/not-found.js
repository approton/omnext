import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        <span className="eyebrow">404 / Page not found</span>
        <h1>This path doesn’t lead anywhere.</h1>
        <p>The page may have moved, or the link may be out of date. Let’s get you back on track.</p>
        <div>
          <Link href="/" className={styles.primary}>
            Go to home <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/search" className={styles.secondary}>
            Search the site
          </Link>
        </div>
      </div>
    </main>
  );
}
