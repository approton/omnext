import Link from "next/link";
import styles from "./service-card.module.css";
export default function ServiceCard({ number, title, description, href = "/products" }) {
  return (
    <Link className={styles.card} href={href} data-reveal data-interactive data-tilt data-depth="2">
      <span className={styles.number}>{number}</span>
      <span className={styles.arrow} aria-hidden="true">
        ↗
      </span>
      <span className={styles.motif} aria-hidden="true">
        <i />
        <b />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={styles.learn}>
        Explore capability <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
