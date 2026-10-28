import { articles } from "../features/articles/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const pages = ["", "/about", "/blog", "/contact", "/website-development", "/software-development"];

export default function sitemap() {
  const staticPages = pages.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const articlePages = articles.map((article) => ({
    url: new URL(`/blog/${article.slug}`, baseUrl).toString(),
    lastModified: new Date(`${article.date}T12:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.5,
  }));
  return [...staticPages, ...articlePages];
}
