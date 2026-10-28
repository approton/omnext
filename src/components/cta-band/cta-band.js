import Link from "next/link";
import styles from "./cta-band.module.css";
export default function CtaBand({
  title = "Ready to move a good idea forward?",
  text = "Tell us where you want to go. We’ll help you map a practical path to get there.",
}) {
  return (
    <section className={`container ${styles.wrap}`} data-reveal>
      <div className={styles.band} data-interactive data-tilt data-depth="3">
        <div className={styles.copy}>
          <span className="eyebrow">Let&apos;s make progress</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className={styles.button} href="/contact">
          Talk to our team <span aria-hidden="true">↗</span>
        </Link>
        <span className={styles.orbit} aria-hidden="true" />
      </div>
    </section>
  );
}
