import Link from "next/link";
import BrandMark from "../brand-mark/brand-mark";
import styles from "./site-footer.module.css";

const links = [
  ["Products", "/products"],
  ["Solutions", "/solutions"],
  ["About us", "/about"],
  ["Insights", "/blog"],
  ["Search", "/search"],
  ["Contact", "/contact"],
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div>
          <Link className={styles.brand} href="/">
            <span className={styles.brandLine}>
              <BrandMark className={styles.brandMark} />
              <span>omnext</span>
            </span>
            <small>technologies</small>
          </Link>
          <p>Build Digital. Grow Beyond.</p>
        </div>
        <div>
          <span className={styles.label}>Explore</span>
          <nav className={styles.links} aria-label="Footer navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <span className={styles.label}>Have a challenge in mind?</span>
          <Link className={styles.start} href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Omnext Technologies</span>
        <span>Thoughtful technology. Meaningful progress.</span>
      </div>
    </footer>
  );
}
