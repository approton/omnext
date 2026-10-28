"use client";

import { useEffect, useRef } from "react";
import styles from "./scroll-progress.module.css";

export default function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return undefined;
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
      const percentage = Math.min(amount, 1) * 100;
      progress.style.setProperty("--scroll-progress", `${percentage}%`);
      progress.setAttribute("aria-valuenow", String(Math.round(percentage)));
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={progressRef}
      className={styles.progress}
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
    />
  );
}
