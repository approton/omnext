"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { searchItems } from "../../features/articles/content";
import styles from "./search-interface.module.css";

export default function SearchInterface() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      normalized
        ? searchItems.filter((item) =>
            `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(normalized),
          )
        : [],
    [normalized],
  );
  return (
    <>
      <section className={styles.hero} data-reveal data-interactive data-page-chapter>
        <div className="container">
          <span className="eyebrow">Search Omnext</span>
          <h1>What are you looking for?</h1>
          <label className={styles.searchBox} data-depth="2">
            <span className={styles.magnify} aria-hidden="true" />
            <span className={styles.srOnly}>Search services, solutions and insights</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “digital product” or “cloud”…"
            />
            <span className={styles.shortcut} aria-hidden="true">
              ⌕
            </span>
          </label>
          <p>Search our capabilities, solutions and published insights.</p>
        </div>
      </section>
      <section className={styles.results} data-reveal>
        <div className="container">
          <div className={styles.resultTop}>
            <h2>
              {normalized
                ? `${results.length} ${results.length === 1 ? "result" : "results"}`
                : "Explore Omnext"}
            </h2>
            {normalized && (
              <button type="button" onClick={() => setQuery("")}>
                Clear search
              </button>
            )}
          </div>
          {!normalized ? (
            <div className={styles.suggestions}>
              <span className="eyebrow">Popular places to start</span>
              <div>
                <Link href="/products">
                  Digital product engineering <span>↗</span>
                </Link>
                <Link href="/solutions">
                  Modernization solutions <span>↗</span>
                </Link>
                <Link href="/blog">
                  Ideas & insights <span>↗</span>
                </Link>
              </div>
            </div>
          ) : results.length ? (
            <ul className={styles.list}>
              {results.map((item) => (
                <li key={item.href + item.title}>
                  <Link href={item.href}>
                    <span>{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <b aria-hidden="true">↗</b>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <span aria-hidden="true">⌕</span>
              <h3>No matching content yet</h3>
              <p>
                Try a broader term, or browse our <Link href="/products">capabilities</Link> and{" "}
                <Link href="/blog">insights</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
