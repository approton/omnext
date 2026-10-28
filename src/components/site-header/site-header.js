"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandMark from "../brand-mark/brand-mark";
import UserMenu from "../user-menu/user-menu";
import styles from "./site-header.module.css";

const nav = [
  ["Products", "/products"],
  ["Solutions", "/solutions"],
  ["About", "/about"],
  ["Insights", "/blog"],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const isCurrent = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const homeIsCurrent = pathname === "/";
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link
          className={`${styles.brand} ${homeIsCurrent ? styles.brandCurrent : ""}`}
          href="/"
          aria-label="Omnext Technologies home"
          aria-current={homeIsCurrent ? "page" : undefined}
          data-depth="1"
          onClick={close}
        >
          <span className={styles.mark}>
            <BrandMark />
          </span>
          <span className={styles.word}>
            omnext<small>technologies</small>
          </span>
        </Link>
        <button
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
        <nav
          id="primary-nav"
          aria-label="Primary navigation"
          className={`${styles.nav} ${open ? styles.open : ""}`}
        >
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              aria-current={isCurrent(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            className={styles.search}
            href="/search"
            aria-label="Search"
            aria-current={isCurrent("/search") ? "page" : undefined}
            onClick={close}
            data-depth="2"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </Link>
          <Link
            className={styles.contact}
            href="/contact"
            onClick={close}
            aria-current={isCurrent("/contact") ? "page" : undefined}
            data-depth="2"
          >
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
