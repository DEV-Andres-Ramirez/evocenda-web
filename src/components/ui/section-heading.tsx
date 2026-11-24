import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Punto de nodo con halo: marca el inicio de cada sección de la senda. */
export function NodeDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-grid size-2.5 shrink-0 place-items-center", className)}>
      <span className="ring-pulse absolute size-full rounded-full bg-neon/40" />
      <span className="size-1.5 rounded-full bg-neon shadow-[0_0_10px_2px_var(--glow)]" />
    </span>
  );
}

export function Eyebrow({ nodo, children, className }: { nodo?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <NodeDot />
      {nodo ? (
        <>
          <span>nodo {nodo}</span>
          <span aria-hidden className="text-faint">
            /
          </span>
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  id,
  nodo,
  etiqueta,
  titulo,
  children,
  className,
}: {
  id: string;
  nodo: string;
  etiqueta: string;
  titulo: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <Eyebrow nodo={nodo} className="reveal">
        {etiqueta}
      </Eyebrow>
      <h2 id={id} className="display reveal mt-5 text-[clamp(2rem,4.4vw,3.4rem)]" style={{ "--i": 1 } as React.CSSProperties}>
        {titulo}
      </h2>
      {children ? (
        <p className="reveal mt-5 max-w-2xl text-[1.075rem] leading-relaxed text-muted" style={{ "--i": 2 } as React.CSSProperties}>
          {children}
        </p>
      ) : null}
    </header>
  );
}
