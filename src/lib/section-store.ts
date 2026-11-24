import { useSyncExternalStore } from "react";

/**
 * Sección activa de la home.
 *
 * El scroll-spy vive dentro de la ruta home (que Next conserva montada pero
 * oculta al navegar) y publica aquí la sección visible. La cabecera, que vive
 * en el layout raíz, solo lee. Así el layout no necesita conocer la ruta.
 */
let active: string | null = null;
const listeners = new Set<() => void>();

export function setActiveSection(id: string | null) {
  if (id === active) return;
  active = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useActiveSection(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}
