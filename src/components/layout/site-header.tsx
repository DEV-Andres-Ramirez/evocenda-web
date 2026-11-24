"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import type { Pregunta } from "@/content/consola";
import { navSections } from "@/content/site";
import { scrollToSection } from "@/lib/anchor";
import { cn } from "@/lib/cn";
import { useActiveSection } from "@/lib/section-store";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

// La consola solo se descarga la primera vez que se abre.
const Console = dynamic(() => import("./console").then((module) => module.Console), { ssr: false });

export interface CasoNav {
  slug: string;
  titulo: string;
  realizado: boolean;
}

const noopSubscribe = () => () => undefined;

/** Atajo de teclado según la plataforma, sin desajuste de hidratación. */
function useShortcutLabel() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (/mac|iphone|ipad/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => "⌘K",
  );
}

export function SiteHeader({ casos, preguntas }: { casos: CasoNav[]; preguntas: Pregunta[] }) {
  const active = useActiveSection();
  const shortcut = useShortcutLabel();
  const bar = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleReady, setConsoleReady] = useState(false);

  const openConsole = () => {
    setConsoleReady(true);
    setConsoleOpen(true);
  };

  // Estado "con scroll": se escribe como atributo para no re-renderizar en cada evento.
  useEffect(() => {
    const element = bar.current;
    if (!element) return;
    const sync = () => {
      element.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setConsoleReady(true);
        setConsoleOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50" style={{ viewTransitionName: "site-header" }}>
        <div className="shell pt-3">
          <div
            ref={bar}
            data-scrolled="false"
            className="glass flex h-14 items-center justify-between gap-3 rounded-2xl pl-3 pr-2 transition-shadow duration-300 data-[scrolled=true]:bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] data-[scrolled=true]:shadow-[var(--shadow-float)]"
          >
            <Link
              href="/#inicio"
              onClick={(event) => scrollToSection(event, "inicio")}
              aria-label="Evocenda by Andrés, ir al inicio"
              className="rounded-xl"
            >
              <Logo />
            </Link>

            <nav aria-label="Secciones" className="hidden xl:block">
              <ul className="flex items-center">
                {navSections.map((section) => {
                  const current = active === section.id;
                  return (
                    <li key={section.id}>
                      <Link
                        href={`/#${section.id}`}
                        onClick={(event) => scrollToSection(event, section.id)}
                        aria-current={current ? "location" : undefined}
                        className={cn(
                          "group relative flex h-10 items-center rounded-full px-3.5 text-[0.9rem] transition-colors",
                          current ? "text-ink" : "text-muted hover:text-ink",
                        )}
                      >
                        {section.label}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_10px_2px_var(--glow)] transition-all duration-300",
                            current ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-60",
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openConsole}
                className="hidden h-10 items-center gap-2 rounded-full border border-line pl-3 pr-2 text-[0.85rem] text-muted transition-colors hover:border-neon hover:text-ink sm:inline-flex"
                aria-label="Abrir la consola de búsqueda y acciones"
              >
                <Icon name="search" size={15} />
                <span>Buscar</span>
                <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.68rem] text-muted">
                  {shortcut}
                </kbd>
              </button>
              <button
                type="button"
                onClick={openConsole}
                className="icon-btn sm:hidden"
                aria-label="Abrir la consola de búsqueda y acciones"
              >
                <Icon name="search" />
              </button>
              <ThemeToggle />
              <Link
                href="/#contacto"
                onClick={(event) => scrollToSection(event, "contacto")}
                className="btn btn-primary btn-sm max-sm:hidden"
              >
                Contacto
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="icon-btn xl:hidden"
                aria-label="Abrir el menú"
                aria-haspopup="dialog"
              >
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />

      {consoleReady ? (
        <Console open={consoleOpen} onClose={() => setConsoleOpen(false)} casos={casos} preguntas={preguntas} />
      ) : null}
    </>
  );
}
