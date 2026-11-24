import { cn } from "@/lib/cn";

/** Miniatura de un flujo: sus pasos como una ruta con nodos. */
export function FlowGlyph({
  steps,
  className,
}: {
  steps: { ia?: boolean; humano?: boolean }[];
  className?: string;
}) {
  const gap = 13;
  const width = (steps.length - 1) * gap + 16;
  const points = steps.map((_, index) => ({ x: 8 + index * gap, y: index % 2 === 0 ? 9 : 23 }));

  return (
    <svg viewBox={`0 0 ${width} 32`} aria-hidden className={cn("h-7 w-auto", className)}>
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.1 4"
        className="stroke-line-strong"
      />
      {points.map((p, index) => {
        const step = steps[index];
        return (
          <circle
            key={index}
            cx={p.x}
            cy={p.y}
            r={step.ia ? 3.6 : 2.9}
            strokeWidth="1.4"
            className={cn(
              step.ia
                ? "fill-neon stroke-neon"
                : step.humano
                  ? "fill-surface stroke-signal"
                  : "fill-surface stroke-faint",
            )}
          />
        );
      })}
    </svg>
  );
}
