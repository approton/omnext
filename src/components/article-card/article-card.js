import Link from "next/link";
import styles from "./article-card.module.css";
export default function ArticleCard({ article }) {
  return (
    <article className={styles.card} data-reveal data-interactive data-tilt data-depth="2">
      <Link
        className={styles.art}
        href={`/blog/${article.slug}`}
        aria-label={`Read ${article.title}`}
      >
        <span>{article.category}</span>
        <i aria-hidden="true" />
        <small>OM / INSIGHT</small>
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{article.category}</span>
          <span>{article.readTime}</span>
        </div>
        <h3>
          <Link href={`/blog/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.description}</p>
        <Link className={styles.read} href={`/blog/${article.slug}`}>
          Read insight <b aria-hidden="true">→</b>
        </Link>
      </div>
    </article>
  );
}
