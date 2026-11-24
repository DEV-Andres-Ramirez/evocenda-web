import type { CSSProperties } from "react";
import type { Diagrama } from "@/content/proyectos";
import { cn } from "@/lib/cn";

const W = 150;
const H = 50;
const GAP_X = 62;
const GAP_Y = 30;
const PAD = 8;

const tonos = {
  base: "stroke-line-strong",
  neon: "stroke-neon",
  signal: "stroke-signal",
  muted: "stroke-line-strong",
} as const;

/** Diagrama de arquitectura: cajas conectadas por trazos que fluyen en la dirección de los datos. */
export function GraphDiagram({ diagrama, className }: { diagrama: Diagrama; className?: string }) {
  const position = (col: number, row: number) => ({
    x: PAD + col * (W + GAP_X),
    y: PAD + row * (H + GAP_Y),
  });
  const maxCol = Math.max(...diagrama.nodos.map((n) => n.col));
  const maxRow = Math.max(...diagrama.nodos.map((n) => n.row));
  const width = PAD * 2 + (maxCol + 1) * W + maxCol * GAP_X;
  const height = PAD * 2 + (maxRow + 1) * H + maxRow * GAP_Y;
  const byId = new Map(diagrama.nodos.map((n) => [n.id, { ...n, ...position(n.col, n.row) }]));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={diagrama.descripcion} className={cn("h-auto w-full", className)}>
      {diagrama.enlaces.map(([fromId, toId]) => {
        const from = byId.get(fromId);
        const to = byId.get(toId);
        if (!from || !to) return null;
        let d: string;
        if (from.col === to.col) {
          // Misma columna: conector vertical.
          const down = to.row > from.row;
          const x = from.x + W / 2;
          d = `M${x} ${down ? from.y + H : from.y}L${x} ${down ? to.y : to.y + H}`;
        } else {
          const forward = to.col > from.col;
          const x1 = forward ? from.x + W : from.x;
          const x2 = forward ? to.x : to.x + W;
          const y1 = from.y + H / 2;
          const y2 = to.y + H / 2;
          const mid = (x1 + x2) / 2;
          d = `M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
        }
        return (
          <path
            key={`${fromId}-${toId}`}
            d={d}
            fill="none"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="1 7"
            style={{ "--dash-step": 8 } as CSSProperties}
            className="flow-dash stroke-neon"
          />
        );
      })}

      {diagrama.nodos.map((nodo) => {
        const { x, y } = position(nodo.col, nodo.row);
        const tono = nodo.tono ?? "base";
        return (
          <g key={nodo.id}>
            <rect
              x={x}
              y={y}
              width={W}
              height={H}
              rx="13"
              strokeWidth="1.3"
              strokeDasharray={tono === "muted" ? "4 4" : undefined}
              className={cn("fill-surface-2", tonos[tono])}
            />
            <text
              x={x + W / 2}
              y={y + (nodo.sub ? 21 : 30)}
              textAnchor="middle"
              className={cn("font-sans text-[12.5px] font-semibold", tono === "muted" ? "fill-muted" : "fill-ink")}
            >
              {nodo.label}
            </text>
            {nodo.sub ? (
              <text x={x + W / 2} y={y + 37} textAnchor="middle" className="fill-faint font-mono text-[9.5px]">
                {nodo.sub}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
