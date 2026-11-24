"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Capa } from "@/content/perfil";
import { cn } from "@/lib/cn";

/**
 * Las áreas de enfoque como capas apiladas en 3D.
 * La lista es el control accesible; la pila es su representación visual y
 * responde al cursor y al foco. Todo el contenido está siempre visible.
 */
export function LayerStack({ capas }: { capas: Capa[] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid items-start gap-x-8 gap-y-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div aria-hidden className="relative mx-auto mt-24 aspect-square w-full max-w-[19rem] [perspective:1500px] xl:sticky xl:top-44 xl:mt-28 xl:max-w-[24rem]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,var(--glow-soft),transparent)] blur-xl" />
        <div className="absolute inset-[17%] [transform-style:preserve-3d] [transform:rotateX(57deg)_rotateZ(-42deg)]">
          {capas.map((capa, index) => {
            const level = capas.length - 1 - index;
            const active = selected === index;
            return (
              <button
                key={capa.id}
                type="button"
                tabIndex={-1}
                onClick={() => setSelected(index)}
                onPointerEnter={() => setSelected(index)}
                style={{ transform: `translateZ(${level * 2.7 + (active ? 1.1 : index < selected ? 2.2 : 0)}rem)` }}
                className={cn(
                  "absolute inset-0 rounded-[1.75rem] border backdrop-blur-[2px] transition-[transform,border-color,background-color,box-shadow,opacity] duration-700 ease-out-expo",
                  active
                    ? "border-neon bg-neon/20 shadow-[0_0_44px_-4px_var(--glow)]"
                    : "border-line-strong bg-surface-2/70 opacity-80",
                )}
              >
                <span className="lattice absolute inset-0 rounded-[inherit] opacity-70" />
                <span
                  className={cn(
                    "absolute left-4 top-3 font-mono text-[0.7rem] tracking-[0.2em] transition-colors",
                    active ? "text-ink" : "text-faint",
                  )}
                >
                  {capa.numero}
                </span>
                <span
                  className={cn(
                    "absolute bottom-3 right-4 size-2 rounded-full transition-colors",
                    active ? "bg-signal shadow-[0_0_12px_3px_color-mix(in_oklab,var(--signal)_60%,transparent)]" : "bg-faint",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {capas.map((capa, index) => {
          const active = selected === index;
          return (
            <li key={capa.id}>
              <div
                tabIndex={0}
                onPointerEnter={() => setSelected(index)}
                onFocus={() => setSelected(index)}
                className={cn(
                  "group rounded-2xl border p-4 transition-[border-color,background-color] duration-300",
                  active ? "border-line-strong bg-surface" : "border-transparent hover:border-line",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl border transition-colors",
                      active ? "border-neon bg-neon/15 text-accent" : "border-line text-muted",
                    )}
                  >
                    <Icon name={capa.icon} size={17} />
                  </span>
                  <h3 className="font-display text-[1.05rem] font-semibold tracking-tight">
                    <span className="mr-2 font-mono text-[0.7rem] font-medium tracking-[0.16em] text-faint">
                      {capa.numero}
                    </span>
                    {capa.titulo}
                  </h3>
                </div>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">{capa.texto}</p>
                <ul
                  className={cn(
                    "flex flex-wrap gap-1.5 overflow-hidden transition-[max-height,margin,opacity] duration-500 ease-out-expo",
                    active ? "mt-3 max-h-24 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {capa.herramientas.map((herramienta) => (
                    <li key={herramienta} className="chip">
                      {herramienta}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
