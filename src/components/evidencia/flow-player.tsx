"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { FlowStep } from "@/content/evidencia";
import { cn } from "@/lib/cn";

/**
 * Reproductor de un flujo de automatización.
 *
 * Dibuja los módulos como una ruta con nodos (igual que en un editor de
 * escenarios) y los recorre uno a uno. Los conectores son puntos que fluyen;
 * el tramo ya recorrido queda encendido. La lista de pasos es el control
 * accesible: el diagrama es su representación visual.
 */

const UNIT_X = 140;
const UNIT_Y = 104;
const PAD_X = 82;
const PAD_TOP = 54;
const PAD_BOTTOM = 80;
const RADIUS = 27;
const STEP_MS = 2600;

function layout(steps: FlowStep[]) {
  const points = steps.map((step, index) => ({
    x: step.x ?? index * 0.84,
    y: step.y ?? (index % 2 === 0 ? 0.12 : 0.92),
  }));
  const maxX = Math.max(...points.map((p) => p.x));
  const maxY = Math.max(...points.map((p) => p.y));
  return {
    width: maxX * UNIT_X + PAD_X * 2,
    height: maxY * UNIT_Y + PAD_TOP + PAD_BOTTOM,
    nodes: points.map((p) => ({ cx: PAD_X + p.x * UNIT_X, cy: PAD_TOP + p.y * UNIT_Y })),
  };
}

/** Parte una etiqueta en dos líneas equilibradas si es larga. */
function splitLabel(text: string): string[] {
  if (text.length <= 15) return [text];
  const words = text.split(" ");
  let best = [text];
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const first = words.slice(0, i).join(" ");
    const second = words.slice(i).join(" ");
    const score = Math.max(first.length, second.length);
    if (score < bestScore) {
      bestScore = score;
      best = [first, second];
    }
  }
  return best;
}

export function FlowPlayer({
  steps,
  variant = "compact",
  label,
}: {
  steps: FlowStep[];
  /** `compact`: detalle del paso activo. `full`: lista completa de pasos. */
  variant?: "compact" | "full";
  label: string;
}) {
  const gradientId = useId();
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);

  const geometry = useMemo(() => layout(steps), [steps]);
  const current = steps[active];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(element);
    return () => io.disconnect();
  }, []);

  // Avance automático: solo en pantalla y sin movimiento reducido.
  useEffect(() => {
    if (!playing || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [playing, inView, steps.length]);

  // En pantallas angostas el diagrama se desplaza para mantener visible el nodo activo.
  useEffect(() => {
    const element = scroller.current;
    if (!element || element.scrollWidth <= element.clientWidth) return;
    const ratio = geometry.nodes[active].cx / geometry.width;
    const left = ratio * element.scrollWidth - element.clientWidth / 2;
    element.scrollTo({ left, behavior: "smooth" });
  }, [active, geometry]);

  const select = (index: number) => {
    setActive(index);
    setPlaying(false);
  };

  return (
    <div ref={root} className="relative">
      <div
        ref={scroller}
        className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]"
      >
        <svg
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          role="img"
          aria-label={label}
          style={{ minWidth: Math.round(geometry.width * 0.8), maxWidth: Math.round(geometry.width * 1.12) }}
          className="mx-auto block h-auto w-full"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--neon)" />
            </linearGradient>
          </defs>

          {/* Conectores */}
          {geometry.nodes.slice(0, -1).map((from, index) => {
            const to = geometry.nodes[index + 1];
            const dx = to.cx - from.cx;
            const dy = to.cy - from.cy;
            const length = Math.hypot(dx, dy) || 1;
            const gap = RADIUS + 9;
            const lit = index < active;
            return (
              <line
                key={steps[index].id}
                x1={from.cx + (dx / length) * gap}
                y1={from.cy + (dy / length) * gap}
                x2={to.cx - (dx / length) * gap}
                y2={to.cy - (dy / length) * gap}
                strokeWidth={lit ? 5 : 4}
                strokeLinecap="round"
                strokeDasharray="0.1 13"
                style={{ "--dash-step": 13.1 } as React.CSSProperties}
                className={cn(
                  "flow-dash transition-[stroke] duration-500",
                  lit ? "stroke-neon" : "stroke-line-strong",
                )}
              />
            );
          })}

          {/* Nodos */}
          {steps.map((step, index) => {
            const { cx, cy } = geometry.nodes[index];
            const isActive = index === active;
            const done = index < active;
            const lines = splitLabel(step.titulo);
            const next = geometry.nodes[index + 1];
            // Si el conector sale hacia abajo, la etiqueta va al lado para que no la cruce.
            const side = next !== undefined && next.cy - cy > 60 && Math.abs(next.cx - cx) < 40;
            return (
              <g
                key={step.id}
                onClick={() => select(index)}
                className="cursor-pointer"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                {isActive ? (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={RADIUS + 7}
                    fill="none"
                    strokeWidth="1.5"
                    className="ring-pulse stroke-neon"
                  />
                ) : null}
                <circle
                  cx={cx}
                  cy={cy}
                  r={RADIUS}
                  fill={step.ia ? `url(#${gradientId})` : "var(--surface-2)"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "transition-[stroke,filter] duration-500",
                    isActive
                      ? "stroke-neon [filter:drop-shadow(0_0_14px_var(--glow))]"
                      : step.humano
                        ? "stroke-signal"
                        : done
                          ? "stroke-neon"
                          : "stroke-line-strong",
                  )}
                />
                <Icon
                  name={step.icon}
                  x={cx - 11}
                  y={cy - 11}
                  size={22}
                  className={step.ia ? "text-on-accent" : step.humano ? "text-signal" : isActive ? "text-ink" : "text-muted"}
                />
                {/* Número de módulo */}
                <circle cx={cx + RADIUS * 0.74} cy={cy - RADIUS * 0.74} r="9.5" className="fill-surface stroke-line-strong" strokeWidth="1" />
                <text
                  x={cx + RADIUS * 0.74}
                  y={cy - RADIUS * 0.74 + 3.4}
                  textAnchor="middle"
                  className="fill-muted font-mono text-[9.5px] font-medium"
                >
                  {index + 1}
                </text>
                {/* Etiqueta: el trazo del color de fondo la mantiene legible sobre los conectores */}
                <text
                  textAnchor={side ? "start" : "middle"}
                  strokeWidth="5"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  className={cn(
                    "stroke-surface font-sans text-[12.5px] font-medium transition-[fill] duration-300",
                    isActive ? "fill-ink" : "fill-muted",
                  )}
                >
                  {lines.map((line, lineIndex) => (
                    <tspan
                      key={line}
                      x={side ? cx + RADIUS + 14 : cx}
                      y={side ? cy + 4.5 + (lineIndex - (lines.length - 1) / 2) * 15.5 : cy + RADIUS + 21 + lineIndex * 15.5}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controles */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="icon-btn"
          aria-label={playing ? "Pausar el recorrido del flujo" : "Reproducir el recorrido del flujo"}
        >
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            setActive(0);
            setPlaying(true);
          }}
          className="icon-btn"
          aria-label="Reiniciar el recorrido"
        >
          <Icon name="restart" size={16} />
        </button>
        <p className="font-mono text-[0.72rem] tracking-[0.14em] text-faint">
          <span className="text-ink">{String(active + 1).padStart(2, "0")}</span> / {String(steps.length).padStart(2, "0")}
        </p>
        <ol className="ml-auto flex items-center gap-1.5" aria-label="Pasos del flujo">
          {steps.map((step, index) => (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => select(index)}
                aria-label={`Paso ${index + 1}: ${step.titulo}`}
                aria-current={index === active ? "step" : undefined}
                className="grid size-6 place-items-center rounded-full"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    index === active
                      ? "h-2 w-5 bg-neon shadow-[0_0_10px_1px_var(--glow)]"
                      : index < active
                        ? "size-2 bg-neon/60"
                        : "size-2 bg-line-strong",
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>

      {variant === "compact" ? (
        <div className="mt-4 min-h-[6.5rem] rounded-2xl border border-line bg-surface-2/60 p-4 sm:p-5" aria-live={playing ? "off" : "polite"}>
          <StepDetail step={current} index={active} />
        </div>
      ) : (
        <ol className="mt-6 grid gap-2.5 md:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => select(index)}
                aria-current={index === active ? "step" : undefined}
                className={cn(
                  "h-full w-full rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-300",
                  index === active
                    ? "border-neon bg-surface shadow-[0_0_30px_-12px_var(--glow)]"
                    : "border-line bg-surface-2/50 hover:border-line-strong",
                )}
              >
                <StepDetail step={step} index={index} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function StepDetail({ step, index }: { step: FlowStep; index: number }) {
  // Solo elementos en línea: este bloque también se usa dentro de un <button>.
  return (
    <span className="flex gap-4">
      <span className="font-mono text-[0.72rem] tracking-[0.14em] text-faint">{String(index + 1).padStart(2, "0")}</span>
      <span className="block min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-display text-[1.02rem] font-semibold tracking-tight text-ink">{step.titulo}</span>
          {step.ia ? (
            <span className="tag tag-design">
              <Icon name="sparkles" size={11} />
              IA
            </span>
          ) : null}
          {step.humano ? (
            <span className="tag tag-real">
              <Icon name="users" size={11} />
              Revisión humana
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block font-mono text-[0.72rem] text-faint">{step.app}</span>
        <span className="mt-2 block text-[0.92rem] leading-relaxed text-muted">{step.detalle}</span>
      </span>
    </span>
  );
}
