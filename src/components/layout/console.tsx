"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import type { Pregunta } from "@/content/consola";
import { defaultWhatsappMessage, sections, site, whatsappUrl } from "@/content/site";
import { goToSection } from "@/lib/anchor";
import { cn } from "@/lib/cn";
import type { CasoNav } from "./site-header";
import { toggleTheme } from "./theme-toggle";

type Item = {
  id: string;
  group: "Ir a" | "Evidencia" | "Acciones" | "Preguntas";
  label: string;
  hint?: string;
  icon: IconName;
  keywords: string;
  run: () => void;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Consola (⌘K): saltar a una sección, abrir un caso, ejecutar acciones de
 * contacto y leer respuestas preparadas. No hay un modelo respondiendo en vivo.
 */
export function Console({
  open,
  onClose,
  casos,
  preguntas,
}: {
  open: boolean;
  onClose: () => void;
  casos: CasoNav[];
  preguntas: Pregunta[];
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [answer, setAnswer] = useState<Pregunta | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      input.current?.focus();
    }
    if (!open && element.open) element.close();
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string, sectionId?: string) => () => {
      onClose();
      if (sectionId && goToSection(sectionId)) return;
      router.push(href);
    };

    return [
      ...sections.map<Item>((section) => ({
        id: `seccion-${section.id}`,
        group: "Ir a",
        label: section.label,
        hint: `nodo ${section.nodo}`,
        icon: "route",
        keywords: section.label,
        run: go(`/#${section.id}`, section.id),
      })),
      ...casos.map<Item>((caso) => ({
        id: `caso-${caso.slug}`,
        group: "Evidencia",
        label: caso.titulo,
        hint: caso.realizado ? "proyecto realizado" : "caso práctico",
        icon: caso.realizado ? "workflow" : "book-open",
        keywords: `${caso.titulo} evidencia caso automatizacion ia`,
        run: go(`/evidencia/${caso.slug}`),
      })),
      {
        id: "accion-correo",
        group: "Acciones",
        label: "Copiar mi correo",
        hint: site.contact.email,
        icon: "copy",
        keywords: "correo email mail copiar contacto",
        run: () => {
          navigator.clipboard
            ?.writeText(site.contact.email)
            .then(() => setCopied(true))
            .catch(() => undefined);
        },
      },
      {
        id: "accion-whatsapp",
        group: "Acciones",
        label: "Escribirme por WhatsApp",
        hint: site.contact.phoneDisplay,
        icon: "whatsapp",
        keywords: "whatsapp telefono celular escribir contacto",
        run: () => {
          onClose();
          window.open(whatsappUrl(defaultWhatsappMessage), "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "accion-linkedin",
        group: "Acciones",
        label: "Abrir mi LinkedIn",
        hint: site.contact.linkedinLabel,
        icon: "linkedin",
        keywords: "linkedin perfil red contacto",
        run: () => {
          onClose();
          window.open(site.contact.linkedinUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "accion-cv",
        group: "Acciones",
        label: "Descargar mi hoja de vida",
        hint: "PDF",
        icon: "download",
        keywords: "cv hoja de vida curriculum descargar pdf",
        run: () => {
          onClose();
          window.open(site.cv, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "accion-tema",
        group: "Acciones",
        label: "Cambiar entre tema claro y oscuro",
        icon: "palette",
        keywords: "tema claro oscuro dark light modo",
        run: () => toggleTheme(),
      },
      ...preguntas.map<Item>((pregunta) => ({
        id: `pregunta-${pregunta.id}`,
        group: "Preguntas",
        label: pregunta.pregunta,
        icon: "sparkles",
        keywords: `${pregunta.pregunta} ${pregunta.respuesta} ${pregunta.destino.label}`,
        run: () => setAnswer(pregunta),
      })),
    ];
  }, [casos, onClose, preguntas, router]);

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return items;
    const words = needle.split(/\s+/);
    return items.filter((item) => {
      const haystack = normalize(`${item.label} ${item.keywords} ${item.group}`);
      return words.every((word) => haystack.includes(word));
    });
  }, [items, query]);

  const activeIndex = Math.min(cursor, Math.max(visible.length - 1, 0));
  const activeItem = visible[activeIndex];

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, visible.length]);

  function handleClose() {
    setQuery("");
    setCursor(0);
    setAnswer(null);
    setCopied(false);
    onClose();
  }

  function goTo(href: string) {
    const hash = href.split("#")[1];
    dialog.current?.close();
    if (hash && goToSection(hash)) return;
    router.push(href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor(visible.length ? (activeIndex + 1) % visible.length : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor(visible.length ? (activeIndex - 1 + visible.length) % visible.length : 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      activeItem?.run();
    }
  }

  const groups = ["Ir a", "Evidencia", "Acciones", "Preguntas"] as const;

  return (
    <dialog
      ref={dialog}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      aria-label="Consola de Evocenda"
      className="dialog-pop m-0 mx-auto mt-[10vh] w-[min(42rem,calc(100vw-1.5rem))] max-w-none overflow-hidden rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-[var(--shadow-float)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Icon name="search" className="shrink-0 text-muted" />
        <input
          ref={input}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setCursor(0);
            setAnswer(null);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
          aria-label="Buscar secciones, casos, acciones o preguntas"
          placeholder="Busca una sección, un caso o haz una pregunta…"
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full bg-transparent text-[0.95rem] outline-none placeholder:text-faint"
        />
        <kbd className="shrink-0 rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.68rem] text-muted">
          Esc
        </kbd>
      </div>

      {answer ? (
        <Answer key={answer.id} pregunta={answer} onBack={() => setAnswer(null)} onGo={goTo} />
      ) : (
        <div ref={list} id={listId} role="listbox" aria-label="Resultados" className="max-h-[min(26rem,60vh)] overflow-y-auto p-2">
          {visible.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">
              Sin resultados. Prueba con «evidencia», «docencia» o «contacto».
            </p>
          ) : (
            groups.map((group) => {
              const entries = visible.filter((item) => item.group === group);
              if (entries.length === 0) return null;
              return (
                <div key={group} role="group" aria-label={group} className="mb-1">
                  <p className="eyebrow px-3 pb-1.5 pt-3 text-[0.62rem]">{group}</p>
                  {entries.map((item) => {
                    const selected = item === activeItem;
                    return (
                      <button
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        tabIndex={-1}
                        onClick={item.run}
                        onPointerMove={() => setCursor(visible.indexOf(item))}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.92rem] transition-colors",
                          selected ? "bg-surface-2 text-ink" : "text-muted",
                        )}
                      >
                        <Icon name={item.icon} size={16} className={selected ? "text-accent" : "text-faint"} />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.id === "accion-correo" && copied ? (
                          <span className="tag tag-real">Copiado</span>
                        ) : item.hint ? (
                          <span className="hidden shrink-0 font-mono text-[0.68rem] text-faint sm:inline">{item.hint}</span>
                        ) : null}
                        {selected ? <Icon name="enter" size={14} className="shrink-0 text-faint" /> : null}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 font-mono text-[0.66rem] text-faint">
        <span>↑ ↓ navegar · ↵ abrir</span>
        <span className="text-right">Las respuestas son preparadas, no un modelo en vivo</span>
      </div>
    </dialog>
  );
}

/** Respuesta preparada, revelada con efecto de escritura. */
function Answer({
  pregunta,
  onBack,
  onGo,
}: {
  pregunta: Pregunta;
  onBack: () => void;
  onGo: (href: string) => void;
}) {
  const total = pregunta.respuesta.length;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => setShown(total));
      return () => window.cancelAnimationFrame(frame);
    }
    const timer = window.setInterval(() => {
      setShown((current) => {
        if (current >= total) {
          window.clearInterval(timer);
          return current;
        }
        return Math.min(total, current + 3);
      });
    }, 16);
    return () => window.clearInterval(timer);
  }, [total]);

  const done = shown >= total;

  return (
    <div className="max-h-[min(26rem,60vh)] overflow-y-auto p-5">
      <button type="button" onClick={onBack} className="eyebrow inline-flex items-center gap-2 text-[0.64rem] hover:text-ink">
        <Icon name="arrow-left" size={13} />
        Volver
      </button>
      <p className="mt-4 font-display text-lg font-semibold tracking-tight">{pregunta.pregunta}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-accent">
        <Icon name="sparkles" size={12} />
        Respuesta preparada a partir de mi hoja de vida
      </p>
      {/* El texto completo está siempre disponible para lectores de pantalla. */}
      <p className="sr-only" aria-live="polite">
        {done ? pregunta.respuesta : ""}
      </p>
      <p aria-hidden className={cn("mt-4 text-[0.95rem] leading-relaxed text-muted", !done && "caret")}>
        {pregunta.respuesta.slice(0, shown)}
      </p>
      <button
        type="button"
        onClick={() => onGo(pregunta.destino.href)}
        className={cn("btn btn-ghost btn-sm mt-5 transition-opacity", done ? "opacity-100" : "opacity-0")}
        tabIndex={done ? 0 : -1}
      >
        {pregunta.destino.label}
        <Icon name="arrow-right" size={15} />
      </button>
    </div>
  );
}
