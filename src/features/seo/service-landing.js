import Link from "next/link";
import styles from "./service-landing.module.css";

export default function ServiceLanding({ eyebrow, title, description, points, searchPhrase }) {
  return (
    <main id="main-content">
      <section className={`container ${styles.page}`} data-page-chapter>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className={styles.lead}>{description}</p>
        <div className={styles.grid}>
          {points.map((point, index) => (
            <article key={point.title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{point.title}</h2>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
        <section className={styles.next}>
          <h2>Start with the outcome you need.</h2>
          <p>
            Tell us what you are trying to improve. We will help you choose a practical next step
            for {searchPhrase}.
          </p>
          <div>
            <Link href="/contact">Discuss your project <span aria-hidden="true">↗</span></Link>
            <Link href="/products">Explore our capabilities <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </section>
    </main>
  );
}
