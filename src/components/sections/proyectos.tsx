import Link from "next/link";
import type { CSSProperties } from "react";
import { GraphDiagram } from "@/components/ui/graph-diagram";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProyectos, type Proyecto } from "@/content/proyectos";
import { cn } from "@/lib/cn";

export async function Proyectos() {
  const proyectos = await getProyectos();
  const [principal, ...resto] = proyectos;

  return (
    <section id="proyectos" tabIndex={-1} aria-labelledby="proyectos-titulo" className="relative py-[clamp(5rem,10vw,8.5rem)]">
      <div className="shell">
        <SectionHeading id="proyectos-titulo" nodo="05" etiqueta="Proyectos" titulo="Del reto a la arquitectura.">
          Software empresarial contado como lo que es: un problema, una solución y las decisiones técnicas que la
          sostienen. Cada proyecto se explica con su arquitectura, no con capturas de sistemas internos.
        </SectionHeading>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Tarjeta proyecto={principal} ancho />
          {resto.map((proyecto, index) => (
            <Tarjeta key={proyecto.id} proyecto={proyecto} indice={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tarjeta({ proyecto, ancho = false, indice = 0 }: { proyecto: Proyecto; ancho?: boolean; indice?: number }) {
  return (
    <div className={cn("reveal", ancho && "lg:col-span-2")} style={{ "--i": indice % 2 } as CSSProperties}>
      <article
        className={cn(
          "panel spot grid h-full gap-x-10 gap-y-6 p-5 sm:p-7",
          ancho ? "lg:grid-cols-[1fr_1.05fr] lg:items-center" : "content-start",
        )}
      >
        <div className={cn(ancho ? "lg:order-2" : "")}>
          <figure className="rounded-2xl border border-line bg-bg-deep/60 p-3 sm:p-5">
            <GraphDiagram diagrama={proyecto.diagrama} />
            <figcaption className="mt-4 border-t border-line pt-3 font-mono text-[0.7rem] leading-relaxed text-faint">
              {proyecto.diagrama.descripcion}
            </figcaption>
          </figure>
        </div>

        <div>
          <p className="eyebrow text-[0.66rem]">{proyecto.contexto}</p>
          <h3 className={cn("display mt-3 leading-[1.14]", ancho ? "text-[clamp(1.6rem,2.8vw,2.2rem)]" : "text-[1.45rem]")}>
            {proyecto.titulo}
          </h3>

          <dl className="mt-5 space-y-3 text-[0.95rem] leading-relaxed">
            <div className="grid grid-cols-[4.75rem_1fr] gap-3">
              <dt className="pt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Reto</dt>
              <dd className="text-muted">{proyecto.reto}</dd>
            </div>
            <div className="grid grid-cols-[4.75rem_1fr] gap-3">
              <dt className="pt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Solución</dt>
              <dd className="text-muted">{proyecto.solucion}</dd>
            </div>
          </dl>

          <ul className="mt-5 space-y-2 border-t border-line pt-5 text-[0.9rem] leading-relaxed text-muted">
            {proyecto.puntos.map((punto) => (
              <li key={punto} className="flex gap-2.5">
                <Icon name="check" size={15} className="mt-1 shrink-0 text-signal" />
                {punto}
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {proyecto.stack.map((tecnologia) => (
              <li key={tecnologia} className="chip">
                {tecnologia}
              </li>
            ))}
          </ul>

          {proyecto.enlace ? (
            <Link
              href={proyecto.enlace.href}
              transitionTypes={["nav-forward"]}
              className="group mt-5 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-accent transition-colors hover:text-ink"
            >
              {proyecto.enlace.label}
              <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </article>
    </div>
  );
}
