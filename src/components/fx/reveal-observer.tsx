"use client";

import { useEffect, useRef } from "react";

/**
 * Activa los revelados `.reveal` de la página que lo contiene.
 *
 * Cada elemento se revela una sola vez (data-in nunca se quita), así no se
 * repite la animación cuando Next vuelve a mostrar una ruta que estaba oculta.
 * También observa los nodos que agregan después los componentes de cliente.
 */
export function RevealObserver() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchor.current?.parentElement;
    if (!root) return;

    // Avisa al script del <head> de que la página se hidrató (ver layout).
    (window as Window & { __evoReveal?: boolean }).__evoReveal = true;

    const reveal = (element: Element) => element.setAttribute("data-in", "");

    if (!("IntersectionObserver" in window)) {
      root.querySelectorAll(".reveal").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const track = (scope: ParentNode) => {
      scope.querySelectorAll(".reveal:not([data-in])").forEach((element) => io.observe(element));
    };

    track(root);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(".reveal:not([data-in])")) io.observe(node);
          track(node);
        });
      }
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <span ref={anchor} hidden />;
}
