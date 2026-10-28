import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "../../../features/articles/content";
import styles from "./article.module.css";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <main id="main-content">
      <header className={styles.cover} data-reveal data-page-chapter>
        <div className={`container ${styles.coverInner}`}>
          <Link href="/blog" className={styles.back}>
            ← All insights
          </Link>
          <span className={styles.category}>{article.category}</span>
          <h1 data-depth="1">{article.title}</h1>
          <p>{article.description}</p>
          <div className={styles.meta}>
            <time dateTime={article.date}>
              {new Date(`${article.date}T12:00:00`).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>
      <article className={styles.article} data-reveal>
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <aside>
          <span className="eyebrow">Continue the conversation</span>
          <p>Have a question about putting this into practice?</p>
          <Link href="/contact">
            Talk with Omnext <span aria-hidden="true">↗</span>
          </Link>
        </aside>
        <Link className={styles.backBottom} href="/blog">
          ← Back to all insights
        </Link>
      </article>
    </main>
  );
}
