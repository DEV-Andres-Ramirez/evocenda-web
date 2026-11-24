"use client";

import Link from "next/link";
import { sections } from "@/content/site";
import { scrollToSection } from "@/lib/anchor";
import { cn } from "@/lib/cn";
import { useActiveSection } from "@/lib/section-store";

const WIDTH = 44;
const TOP = 14;
const STEP = 40;
const HEIGHT = TOP * 2 + STEP * (sections.length - 1);

/** Posición de cada nodo: la ruta ondula suavemente de arriba abajo. */
const nodes = sections.map((section, index) => ({
  ...section,
  x: WIDTH / 2 + Math.sin((index / (sections.length - 1)) * Math.PI * 2.5) * 9,
  y: TOP + index * STEP,
}));

const path = nodes
  .map((node, index) => {
    if (index === 0) return `M${node.x.toFixed(1)} ${node.y}`;
    const previous = nodes[index - 1];
    const mid = (previous.y + node.y) / 2;
    return `C${previous.x.toFixed(1)} ${mid} ${node.x.toFixed(1)} ${mid} ${node.x.toFixed(1)} ${node.y}`;
  })
  .join("");

/**
 * Riel de la senda (pantallas anchas): un nodo por sección de la home y un
 * trazo que se enciende hasta la sección activa.
 */
export function SendaRail() {
  const active = useActiveSection();
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === active),
  );
  const progress = activeIndex / (sections.length - 1);

  return (
    <nav
      aria-label="Recorrido de la página"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 3xl:block"
      style={{ width: WIDTH, height: HEIGHT }}
    >
      <svg aria-hidden viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 size-full overflow-visible">
        <path d={path} fill="none" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" className="stroke-line-strong" />
        <path
          d={path}
          fill="none"
          pathLength={1}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          className="stroke-neon transition-[stroke-dashoffset] duration-700 ease-out-expo [filter:drop-shadow(0_0_5px_var(--glow))]"
        />
      </svg>
      <ol>
        {nodes.map((node, index) => {
          const current = index === activeIndex;
          const passed = index < activeIndex;
          return (
            <li key={node.id} className="absolute" style={{ left: node.x, top: node.y }}>
              <Link
                href={`/#${node.id}`}
                onClick={(event) => scrollToSection(event, node.id)}
                aria-label={node.label}
                aria-current={current ? "location" : undefined}
                className="group absolute left-0 top-0 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
              >
                <span
                  className={cn(
                    "block rounded-full border-2 transition-all duration-500 ease-out-expo",
                    current
                      ? "size-3.5 border-neon bg-neon shadow-[0_0_0_4px_var(--glow-soft),0_0_16px_2px_var(--glow)]"
                      : passed
                        ? "size-2.5 border-neon bg-bg"
                        : "size-2.5 border-line-strong bg-bg group-hover:border-neon",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-[opacity,transform] duration-300",
                    "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                    current ? "text-ink" : "text-muted",
                  )}
                >
                  <span className="mr-1.5 text-faint">{node.nodo}</span>
                  {node.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
