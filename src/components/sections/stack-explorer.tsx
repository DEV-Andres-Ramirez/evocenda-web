"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Categoria } from "@/content/stack";
import { cn } from "@/lib/cn";

const SIZE = 580;
const CENTER = SIZE / 2;
const HUB_RADIUS = 136;
const ORBIT = 38;

const SHORT: Record<string, string> = {
  ia: "IA",
  automatizacion: "Automatización",
  front: "Front-End",
  back: "Back-End",
  datos: "Datos",
  cloud: "Cloud",
  calidad: "Calidad",
};

/**
 * Constelación de habilidades: cada categoría es un nodo central con sus
 * habilidades en órbita. La constelación y las tarjetas comparten el foco:
 * al recorrer una tarjeta se enciende su cúmulo, y viceversa.
 */
export function StackExplorer({ categorias }: { categorias: Categoria[] }) {
  const gradientId = useId();
  const [active, setActive] = useState<string | null>(null);

  const hubs = categorias.map((categoria, index) => {
    const angle = -Math.PI / 2 + (index / categorias.length) * Math.PI * 2;
    const x = CENTER + Math.cos(angle) * HUB_RADIUS;
    const y = CENTER + Math.sin(angle) * HUB_RADIUS;
    const satellites = categoria.habilidades.map((_, skillIndex) => {
      const a = angle + (skillIndex / categoria.habilidades.length) * Math.PI * 2;
      return { x: x + Math.cos(a) * ORBIT, y: y + Math.sin(a) * ORBIT };
    });
    const labelDistance = HUB_RADIUS + ORBIT + 20;
    const cos = Math.cos(angle);
    return {
      categoria,
      x,
      y,
      satellites,
      labelX: CENTER + cos * labelDistance,
      labelY: CENTER + Math.sin(angle) * labelDistance + 4,
      anchor: (Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end") as "middle" | "start" | "end",
    };
  });

  return (
    <div className="grid items-start gap-x-10 gap-y-8 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="relative mx-auto w-full max-w-[22rem] lg:sticky lg:top-28 lg:max-w-none">
        <div aria-hidden className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,var(--glow-soft),transparent)] blur-xl" />
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="relative h-auto w-full">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="var(--logo-a)" />
              <stop offset="0.55" stopColor="var(--logo-b)" />
              <stop offset="1" stopColor="var(--logo-c)" />
            </linearGradient>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS} fill="none" strokeDasharray="2 8" className="stroke-line-strong" />

          {hubs.map(({ categoria, x, y, satellites, labelX, labelY, anchor }) => {
            const on = active === categoria.id;
            const dim = active !== null && !on;
            return (
              <g
                key={categoria.id}
                onPointerEnter={() => setActive(categoria.id)}
                onPointerLeave={() => setActive(null)}
                className={cn("cursor-pointer transition-opacity duration-500", dim ? "opacity-35" : "opacity-100")}
              >
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  strokeWidth={on ? 1.6 : 1}
                  className={cn("transition-[stroke] duration-500", on ? "stroke-neon" : "stroke-line-strong")}
                />
                {/* Área de contacto generosa alrededor del cúmulo */}
                <circle cx={x} cy={y} r={ORBIT + 12} fill="transparent" />
                <g className="orbit-spin" style={{ "--orbit-duration": `${70 + satellites.length * 6}s` } as React.CSSProperties}>
                  <circle cx={x} cy={y} r={ORBIT} fill="none" strokeWidth="1" className={on ? "stroke-neon/60" : "stroke-line"} />
                  {satellites.map((satellite, index) => (
                    <circle
                      key={index}
                      cx={satellite.x}
                      cy={satellite.y}
                      r={on ? 4.4 : 3}
                      className={cn("transition-all duration-500", on ? "fill-signal" : "fill-faint")}
                    />
                  ))}
                </g>
                <circle
                  cx={x}
                  cy={y}
                  r={on ? 12 : 9.5}
                  strokeWidth="2"
                  className={cn(
                    "transition-all duration-500",
                    on ? "fill-neon stroke-neon [filter:drop-shadow(0_0_12px_var(--glow))]" : "fill-surface-2 stroke-neon/70",
                  )}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  className={cn(
                    "font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-[fill] duration-300",
                    on ? "fill-ink" : "fill-muted",
                  )}
                >
                  {SHORT[categoria.id] ?? categoria.titulo}
                </text>
              </g>
            );
          })}

          {/* Núcleo */}
          <circle cx={CENTER} cy={CENTER} r="30" className="fill-surface" stroke={`url(#${gradientId})`} strokeWidth="2" />
          <text x={CENTER} y={CENTER + 6.5} textAnchor="middle" className="fill-ink font-display text-[18px] font-semibold tracking-[-0.02em]">
            AR
          </text>
        </svg>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {categorias.map((categoria) => {
          const on = active === categoria.id;
          return (
            <li
              key={categoria.id}
              onPointerEnter={() => setActive(categoria.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(categoria.id)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              className={cn(
                "panel spot p-5 transition-[border-color,box-shadow] duration-300",
                on && "border-line-strong shadow-[0_0_34px_-14px_var(--glow)]",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300",
                    on ? "border-neon bg-neon/15 text-accent" : "border-line bg-surface-2 text-muted",
                  )}
                >
                  <Icon name={categoria.icon} size={16} />
                </span>
                <h3 className="font-display text-[1.02rem] font-semibold tracking-tight">{categoria.titulo}</h3>
                <span className="ml-auto font-mono text-[0.68rem] text-faint">{String(categoria.habilidades.length).padStart(2, "0")}</span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {categoria.habilidades.map((habilidad) => (
                  <li key={habilidad} className="chip">
                    {habilidad}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
