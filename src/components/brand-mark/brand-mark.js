import styles from "./brand-mark.module.css";

export default function BrandMark({ className = "" }) {
  return (
    <svg
      className={`${styles.mark} ${className}`.trim()}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.monogram} d="M27 7A20 20 0 1 0 41 41V7V41L57 7V41" />
    </svg>
  );
}
