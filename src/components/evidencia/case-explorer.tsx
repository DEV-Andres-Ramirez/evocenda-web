"use client";

import Link from "next/link";
import { useState, ViewTransition } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { kindLabel, tareaIds, tareas, type CasoKind, type TareaId } from "@/content/evidencia";
import { cn } from "@/lib/cn";
import { FlowGlyph } from "./flow-glyph";

export interface CasoCard {
  slug: string;
  kind: CasoKind;
  titulo: string;
  resumen: string;
  tareas: TareaId[];
  herramientas: string[];
  icon: IconName;
  pasos: { ia?: boolean; humano?: boolean }[];
  /** Solo un elemento por caso puede llevar el nombre de transición en la página. */
  morph: boolean;
}

type Filtro = TareaId | "todos";

/** Casos de evidencia filtrables por tarea de oficina. */
export function CaseExplorer({ casos }: { casos: CasoCard[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const visibles = filtro === "todos" ? casos : casos.filter((caso) => caso.tareas.includes(filtro));

  const opciones: { id: Filtro; label: string; icon: IconName; total: number }[] = [
    { id: "todos", label: "Todos", icon: "layers", total: casos.length },
    ...tareaIds.map((id) => ({
      id,
      label: tareas[id].label,
      icon: tareas[id].icon as IconName,
      total: casos.filter((caso) => caso.tareas.includes(id)).length,
    })),
  ];

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrar casos por tarea de oficina"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none]"
      >
        {opciones.map((opcion) => {
          const selected = filtro === opcion.id;
          return (
            <button
              key={opcion.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFiltro(opcion.id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.88rem] transition-[border-color,background-color,color,box-shadow] duration-300",
                selected
                  ? "border-neon bg-neon/15 text-ink shadow-[0_0_22px_-8px_var(--glow)]"
                  : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              <Icon name={opcion.icon} size={15} className={selected ? "text-accent" : undefined} />
              {opcion.label}
              <span className="font-mono text-[0.68rem] text-faint">{opcion.total}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visibles.length} casos visibles
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibles.map((caso) => (
          <li key={caso.slug} className="pop-in">
            <article className="panel spot group flex h-full flex-col p-5 transition-transform duration-500 ease-out-expo hover:-translate-y-1">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                <span className={cn("tag", caso.kind === "realizado" ? "tag-real" : "tag-design")}>
                  {caso.kind === "realizado" ? <Icon name="check" size={11} /> : <Icon name="book-open" size={11} />}
                  {kindLabel[caso.kind]}
                </span>
                <FlowGlyph steps={caso.pasos} className="shrink-0 opacity-90" />
              </div>

              <h3 className="display mt-5 text-[1.28rem] leading-[1.18]">
                <Link
                  href={`/evidencia/${caso.slug}`}
                  prefetch
                  transitionTypes={["nav-forward"]}
                  className="outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-neon"
                >
                  {caso.morph ? (
                    <ViewTransition name={`caso-${caso.slug}`} share="morph" default="none">
                      <span className="inline-block">{caso.titulo}</span>
                    </ViewTransition>
                  ) : (
                    caso.titulo
                  )}
                </Link>
              </h3>

              <p className="mt-3 line-clamp-3 text-[0.92rem] leading-relaxed text-muted">{caso.resumen}</p>

              <div className="mt-auto pt-5">
                <ul className="flex flex-wrap gap-1.5">
                  {caso.tareas.map((tarea) => (
                    <li key={tarea} className="chip">
                      <Icon name={tareas[tarea].icon as IconName} size={12} />
                      {tareas[tarea].label}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
                  <p className="font-mono text-[0.7rem] leading-relaxed text-faint">{caso.herramientas.join(" · ")}</p>
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-[border-color,color,transform] duration-300 group-hover:translate-x-0.5 group-hover:border-neon group-hover:text-ink"
                  >
                    <Icon name="arrow-up-right" size={16} />
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
