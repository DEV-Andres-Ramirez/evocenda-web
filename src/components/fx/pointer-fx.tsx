"use client";

import { useEffect } from "react";

/**
 * Escribe la posición del cursor (--mx / --my) en la tarjeta `.spot` que está
 * debajo, para el foco y el borde luminoso que lo siguen. Un único listener
 * pasivo para todo el sitio.
 */
export function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const flush = () => {
      frame = 0;
      if (!last) return;
      const target = last.target instanceof Element ? last.target.closest<HTMLElement>(".spot") : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = window.requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
