"use client";

import { useEffect } from "react";
import { sections } from "@/content/site";
import { setActiveSection } from "@/lib/section-store";

/**
 * Publica la sección de la home que cruza la franja central de la pantalla.
 * Vive dentro de la ruta home: cuando Next oculta la ruta, el efecto se limpia
 * y la cabecera deja de resaltar una sección.
 */
export function ScrollSpy() {
  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );

    elements.forEach((element) => io.observe(element));

    return () => {
      io.disconnect();
      setActiveSection(null);
    };
  }, []);

  return null;
}
