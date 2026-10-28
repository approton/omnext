import styles from "./page-intro.module.css";
import Link from "next/link";

export default function PageIntro({ eyebrow, title, description, highlights = [], action }) {
  return (
    <section className={styles.intro} data-reveal data-page-chapter>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow" data-depth="1">
            {eyebrow}
          </span>
          <h1 data-depth="2">{title}</h1>
          <p data-depth="3">{description}</p>
          {highlights.length > 0 && (
            <ul className={styles.highlights} aria-label="Page topics" data-depth="4">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
          {action && (
            <div className={styles.actions} data-depth="5">
              <Link className={styles.action} href={action.href}>
                {action.label} <span aria-hidden="true">↓</span>
              </Link>
              <span className={styles.actionHint}>Explore this page at your own pace</span>
            </div>
          )}
        </div>
        <div className={styles.art} data-interactive aria-hidden="true">
          <span>OMNEXT</span>
          <i className={styles.nodeOne} />
          <i className={styles.nodeTwo} />
        </div>
      </div>
    </section>
  );
}
