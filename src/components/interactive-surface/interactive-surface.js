"use client";

import { useEffect } from "react";

export default function InteractiveSurface() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let activeSurface;
    let nextPoint;

    const renderPointer = () => {
      frame = 0;
      if (!activeSurface || !nextPoint) return;

      const bounds = activeSurface.getBoundingClientRect();
      activeSurface.style.setProperty("--pointer-x", `${nextPoint.x - bounds.left}px`);
      activeSurface.style.setProperty("--pointer-y", `${nextPoint.y - bounds.top}px`);

      if (!reducedMotion.matches && activeSurface.hasAttribute("data-tilt")) {
        const x = (nextPoint.x - bounds.left) / Math.max(bounds.width, 1) - 0.5;
        const y = (nextPoint.y - bounds.top) / Math.max(bounds.height, 1) - 0.5;
        activeSurface.style.setProperty("--tilt-x", `${(x * 5).toFixed(2)}deg`);
        activeSurface.style.setProperty("--tilt-y", `${(y * -5).toFixed(2)}deg`);
      }
    };

    const onPointerMove = (event) => {
      if (!finePointer.matches) return;
      if (!(event.target instanceof Element)) return;
      const surface = event.target.closest("[data-interactive]");
      if (!surface) {
        activeSurface?.removeAttribute("data-pointer-active");
        activeSurface = undefined;
        return;
      }

      if (activeSurface !== surface) {
        activeSurface?.removeAttribute("data-pointer-active");
        activeSurface = surface;
        activeSurface.setAttribute("data-pointer-active", "true");
      }

      nextPoint = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(renderPointer);
    };

    const onPointerLeave = () => {
      activeSurface?.removeAttribute("data-pointer-active");
      activeSurface?.style.removeProperty("--tilt-x");
      activeSurface?.style.removeProperty("--tilt-y");
      activeSurface = undefined;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
