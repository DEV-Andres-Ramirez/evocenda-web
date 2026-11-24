"use client";

import { useLayoutEffect, type MouseEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

/** El tema de marca es el oscuro; el claro se elige de forma explícita. */
function storedTheme(): Theme {
  try {
    return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

type ViewTransitionLike = { ready: Promise<unknown>; finished: Promise<unknown> };

/**
 * Cambia el tema con un revelado circular desde el punto indicado.
 * Sin soporte de View Transitions, con movimiento reducido o si ya hay una
 * transición en curso (por ejemplo, una navegación), aplica el cambio directo.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";

  const apply = () => {
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Almacenamiento no disponible: el cambio aplica solo a esta visita.
    }
  };

  const start = (document as Document & { startViewTransition?: (cb: () => void) => ViewTransitionLike })
    .startViewTransition;

  let busy = false;
  try {
    busy = root.matches(":active-view-transition");
  } catch {
    busy = false;
  }

  if (!start || busy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }

  root.style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth / 2}px`);
  root.style.setProperty("--vt-y", `${origin?.y ?? 0}px`);
  root.dataset.vt = "theme";

  const transition = start.call(document, apply);
  transition.ready.catch(() => undefined);
  transition.finished.finally(() => {
    delete root.dataset.vt;
  });
}

export function ThemeToggle({ className }: { className?: string }) {
  useLayoutEffect(() => {
    // En desarrollo, el remontaje de Strict Mode restablece los atributos de
    // <html> que escribió el script del <head>. En producción no hace nada.
    const root = document.documentElement;
    root.setAttribute("data-theme", storedTheme());
    root.setAttribute("data-js", "");
  }, []);

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("icon-btn", className)}
      aria-label="Cambiar entre tema claro y oscuro"
      title="Cambiar tema"
    >
      {/* El icono lo decide CSS según data-theme: sin estado, sin desajuste de hidratación. */}
      <Icon name="sun" className="hidden dark:block" />
      <Icon name="moon" className="dark:hidden" />
    </button>
  );
}
