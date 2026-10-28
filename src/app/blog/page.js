import ArticleCard from "../../components/article-card/article-card";
import PageIntro from "../../components/page-intro/page-intro";
import { articles } from "../../features/articles/content";
import styles from "./blog.module.css";

export const metadata = {
  title: "Insights on Website, Software & Product Development",
  description: "Ideas on digital products, technology and meaningful progress.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Insights on Website, Software & Product Development | Omnext Technologies",
    description: "Practical ideas for building websites, software and digital products.",
  },
};
export default function BlogPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="The journal"
        title="Ideas for what’s next."
        description="Perspectives on building useful digital products, resilient systems and technology with intent."
        highlights={["Digital products", "Resilient systems", "Technology with intent"]}
        action={{ href: "#latest-insights", label: "Read the latest" }}
      />
      <section className={styles.list} id="latest-insights" data-reveal>
        <div className="container">
          <div className={styles.listIntro}>
            <span className="eyebrow">Latest insights</span>
            <span>{articles.length} articles</span>
          </div>
          <div className={styles.grid}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
