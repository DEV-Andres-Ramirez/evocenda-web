"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnchorLink } from "@/components/ui/anchor-link";
import { Icon } from "@/components/ui/icon";
import { RichText } from "@/components/ui/rich-text";
import { capaIds, capas, type CapaId, type Hito } from "@/content/senda";
import { cn } from "@/lib/cn";

const TONO: Record<(typeof capas)[CapaId]["tono"], string> = {
  accent: "var(--neon)",
  signal: "var(--signal)",
  warm: "var(--warm)",
  ink: "var(--text)",
};

type Filtro = CapaId | "todas";

/**
 * La senda como ruta: cada hito es un nodo y el trazo serpentea de uno a otro.
 * El tramo recorrido se enciende a medida que avanza el scroll (cada tramo
 * expone su progreso en la variable --p). Sin JavaScript o con movimiento
 * reducido, la ruta queda encendida completa.
 */
export function SendaTimeline({ hitos }: { hitos: Hito[] }) {
  const list = useRef<HTMLOListElement>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const visibles = filtro === "todas" ? hitos : hitos.filter((hito) => hito.capa === filtro);

  useEffect(() => {
    const element = list.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Sin animación: la ruta queda encendida completa.
      for (const item of Array.from(element.children)) item.setAttribute("data-lit", "");
      return;
    }

    let frame = 0;
    let watching = false;

    const update = () => {
      frame = 0;
      const anchor = window.innerHeight * 0.6;
      for (const item of Array.from(element.children) as HTMLElement[]) {
        const rect = item.getBoundingClientRect();
        // El tramo empieza en el nodo, 28 px por debajo del borde superior del elemento.
        const start = rect.top + 28;
        const progress = Math.min(1, Math.max(0, (anchor - start) / Math.max(rect.height, 1)));
        item.style.setProperty("--p", progress.toFixed(3));
        item.toggleAttribute("data-lit", anchor >= start);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !watching) {
          watching = true;
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll, { passive: true });
          update();
        } else if (!entry.isIntersecting && watching) {
          watching = false;
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(element);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [filtro]);

  return (
    <div>
      <div role="group" aria-label="Filtrar la senda por capa" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none]">
        {(["todas", ...capaIds] as Filtro[]).map((id) => {
          const selected = filtro === id;
          const total = id === "todas" ? hitos.length : hitos.filter((hito) => hito.capa === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFiltro(id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border px-4 text-[0.88rem] transition-[border-color,background-color,color] duration-300",
                selected ? "border-line-strong bg-surface text-ink" : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{
                  background: id === "todas" ? "linear-gradient(135deg, var(--neon), var(--signal))" : TONO[capas[id].tono],
                }}
              />
              {id === "todas" ? "Toda la senda" : capas[id].label}
              <span className="font-mono text-[0.68rem] text-faint">{total}</span>
            </button>
          );
        })}
      </div>

      <ol ref={list} className="relative mt-10">
        {/* Próximo nodo: la senda sigue abierta */}
        <li className="senda-item group relative grid grid-cols-[3rem_1fr] pb-10 lg:grid-cols-[1fr_7rem_1fr]" style={{ "--tone": "var(--faint)" } as CSSProperties}>
          <Segmento desde="derecha" punteado />
          <div className="col-start-2 lg:col-start-3">
            <div className="rounded-[1.25rem] border border-dashed border-line-strong p-5">
              <p className="eyebrow text-[0.64rem]">Próximo nodo</p>
              <p className="display mt-2 text-[1.3rem] leading-tight">La senda sigue abierta.</p>
              <AnchorLink
                to="contacto"
                className="group/link mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-accent transition-colors hover:text-ink"
              >
                ¿El siguiente hito es con tu organización?
                <Icon name="arrow-right" size={14} className="transition-transform group-hover/link:translate-x-0.5" />
              </AnchorLink>
            </div>
          </div>
        </li>

        {visibles.map((hito, index) => {
          const izquierda = index % 2 === 0;
          const ultimo = index === visibles.length - 1;
          return (
            <li
              key={hito.id}
              className="senda-item group relative grid grid-cols-[3rem_1fr] pb-10 last:pb-0 lg:grid-cols-[1fr_7rem_1fr]"
              style={{ "--tone": TONO[capas[hito.capa].tono] } as CSSProperties}
            >
              {ultimo ? <Nodo desde={izquierda ? "izquierda" : "derecha"} /> : <Segmento desde={izquierda ? "izquierda" : "derecha"} />}
              <div className={cn("col-start-2", izquierda ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3")}>
                <Tarjeta hito={hito} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const X = { izquierda: 24, derecha: 76 } as const;

function Nodo({ desde }: { desde: keyof typeof X }) {
  // En escritorio la columna central mide 7rem y está centrada en el elemento.
  return (
    <span
      aria-hidden
      style={{ "--xr": X[desde] / 100 } as CSSProperties}
      className="senda-node absolute left-6 top-7 z-10 grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 bg-bg lg:left-[calc(50%-3.5rem+7rem*var(--xr))]"
    >
      <span className="size-1.5 rounded-full" />
    </span>
  );
}

/** Tramo de ruta entre un nodo y el siguiente, más el nodo de partida. */
function Segmento({ desde, punteado = false }: { desde: keyof typeof X; punteado?: boolean }) {
  const from = X[desde];
  const to = desde === "izquierda" ? X.derecha : X.izquierda;
  const d = `M${from} 0C${from} 55 ${to} 45 ${to} 100`;

  return (
    <>
      {/* Móvil: línea recta a la izquierda */}
      <span aria-hidden className="absolute bottom-[-1.75rem] left-6 top-7 w-px -translate-x-1/2 bg-line-strong lg:hidden" />
      <span
        aria-hidden
        className="senda-lit absolute bottom-[-1.75rem] left-6 top-7 w-0.5 -translate-x-1/2 origin-top lg:hidden"
      />
      {/* Escritorio: curva que serpentea entre ambos lados.
          El SVG va dentro de un contenedor porque, al ser un elemento reemplazado,
          no se estira entre top y bottom por sí solo. */}
      <span aria-hidden className="absolute bottom-[-1.75rem] left-[calc(50%-3.5rem)] top-7 hidden w-28 lg:block">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full overflow-visible">
          <path
            d={d}
            fill="none"
            strokeWidth="1.5"
            strokeDasharray={punteado ? "2 7" : "3 6"}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-line-strong"
          />
        </svg>
      </span>
      {punteado ? null : (
        // El tramo encendido va en su propia capa: se recorta según el progreso (--p).
        <span aria-hidden className="senda-lit-svg absolute bottom-[-1.75rem] left-[calc(50%-3.5rem)] top-7 hidden w-28 lg:block">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full overflow-visible">
            <path d={d} fill="none" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </span>
      )}
      <Nodo desde={desde} />
    </>
  );
}

function Tarjeta({ hito }: { hito: Hito }) {
  const capa = capas[hito.capa];
  return (
    <article className="panel spot p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="font-mono text-[0.72rem] tracking-[0.1em] text-faint">{hito.fecha}</p>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--tone)]" />
          {capa.label}
        </span>
        {hito.actual ? <span className="tag tag-real">Actual</span> : null}
        {hito.origen ? <span className="tag tag-design">Origen</span> : null}
      </div>
      <h3 className="display mt-3 text-[1.3rem] leading-[1.18]">{hito.titulo}</h3>
      <p className="mt-1.5 text-[0.92rem] text-muted">
        <strong>{hito.organizacion}</strong>
        <span aria-hidden className="mx-2 text-faint">
          ·
        </span>
        {hito.lugar}
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{hito.resumen}</p>

      {hito.tecnologias ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {hito.tecnologias.map((tecnologia) => (
            <li key={tecnologia} className="chip">
              {tecnologia}
            </li>
          ))}
        </ul>
      ) : null}

      {hito.puntos ? (
        <details className="group/details mt-4 border-t border-line pt-4">
          <summary className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-accent transition-colors hover:text-ink">
            <Icon name="chevron-down" size={15} className="transition-transform duration-300 group-open/details:rotate-180" />
            <span className="group-open/details:hidden">Ver funciones y logros ({hito.puntos.length})</span>
            <span className="hidden group-open/details:inline">Ocultar funciones y logros</span>
          </summary>
          <ul className="node-list mt-4 text-[0.9rem] leading-relaxed text-muted">
            {hito.puntos.map((punto) => (
              <li key={punto}>
                <RichText text={punto} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}
