import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Monograma AR de Evocenda.
 *
 * La A (diagonal + asta) comparte el asta con la R: una sola ruta con nodos en
 * el origen, en el vértice y en el punto de llegada, que queda encendido.
 * `detail` quita los nodos huecos para tamaños muy pequeños.
 */
export function LogoMark({
  className,
  detail = true,
  title,
}: {
  className?: string;
  detail?: boolean;
  title?: string;
}) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="56" x2="56" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--logo-a)" />
          <stop offset="0.55" stopColor="var(--logo-b)" />
          <stop offset="1" stopColor="var(--logo-c)" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={detail ? 4.8 : 6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 54 31 11V54" />
        <path d="M18.9 37H31" />
        <path d="M31 11H41.5a10.5 10.5 0 0 1 0 21H31" />
        <path d="M40 32 53 54" />
      </g>
      {detail ? (
        <>
          <g stroke={`url(#${gradientId})`} strokeWidth="2.4" fill="var(--bg)">
            <circle cx="11" cy="54" r="4" />
            <circle cx="31" cy="11" r="4" />
          </g>
          <circle cx="53" cy="54" r="8.6" fill="none" stroke="var(--logo-c)" strokeOpacity="0.35" strokeWidth="1.3" />
        </>
      ) : null}
      <circle cx="53" cy="54" r={detail ? 5 : 5.4} fill="var(--logo-c)" />
    </svg>
  );
}

/** Monograma + nombre "evocenda · by Andrés". */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0" />
      <span className={cn("flex flex-col leading-none", compact && "max-sm:hidden")}>
        <span className="font-display text-[1.3rem] font-semibold tracking-[-0.03em] text-ink">evocenda</span>
        <span className="mt-1 font-mono text-[0.58rem] font-medium uppercase tracking-[0.24em] text-muted">
          by Andrés
        </span>
      </span>
    </span>
  );
}
