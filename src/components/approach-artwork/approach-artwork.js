"use client";

import { useEffect, useRef, useState } from "react";

export default function ApproachArtwork({ className, children }) {
  const artworkRef = useRef(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const artwork = artworkRef.current;
    if (!artwork || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setArrived(entry.isIntersecting);
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(artwork);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={artworkRef}
      className={className}
      data-interactive
      data-tilt
      data-arrived={arrived ? "true" : undefined}
    >
      {children}
    </div>
  );
}
