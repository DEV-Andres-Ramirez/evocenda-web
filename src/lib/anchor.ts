import type { MouseEvent } from "react";

/**
 * Desplazamiento suave a una sección de la home.
 *
 * Si la sección está visible en el documento actual, se desplaza hasta ella
 * sin navegar. Si no lo está (por ejemplo, desde una página de caso, donde la
 * home sigue montada pero oculta), deja que <Link> navegue a "/#id".
 */
export function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = document.getElementById(id);
  if (!target || target.offsetParent === null) return;

  event.preventDefault();
  goToSection(id);
}

export function goToSection(id: string): boolean {
  const target = document.getElementById(id);
  if (!target || target.offsetParent === null) return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
  window.history.replaceState(null, "", `#${id}`);
  return true;
}
