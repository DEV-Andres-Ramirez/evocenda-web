import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { CaseExplorer, type CasoCard } from "@/components/evidencia/case-explorer";
import { FlowPlayer } from "@/components/evidencia/flow-player";
import { AnchorLink } from "@/components/ui/anchor-link";
import { Icon } from "@/components/ui/icon";
import { Lightbox } from "@/components/ui/lightbox";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { getCasos, getMatrizEvidencia, kindLabel, tareas } from "@/content/evidencia";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export async function Evidencia() {
  const [casos, matriz] = await Promise.all([getCasos(), getMatrizEvidencia()]);
  const destacado = casos[0];

  const tarjetas: CasoCard[] = casos.map((caso) => ({
    slug: caso.slug,
    kind: caso.kind,
    titulo: caso.tituloCorto,
    resumen: caso.resumen,
    tareas: caso.tareas,
    herramientas: caso.herramientas,
    icon: caso.icon,
    pasos: caso.flujo.map(({ ia, humano }) => ({ ia, humano })),
    // El caso destacado ya lleva el nombre de transición en su panel.
    morph: caso.slug !== destacado.slug,
  }));

  return (
    <section
      id="evidencia"
      tabIndex={-1}
      aria-labelledby="evidencia-titulo"
      className="relative py-[clamp(5rem,10vw,8.5rem)]"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(60%_60%_at_70%_0%,var(--glow-soft),transparent)]" />

      <div className="shell">
        <SectionHeading
          id="evidencia-titulo"
          nodo="02"
          etiqueta="IA aplicada"
          titulo="IA generativa y automatización, aplicadas al trabajo de oficina."
        >
          Evidencia del uso aplicado de herramientas de IA generativa y de automatización de tareas de oficina: correo,
          documentos, hojas de cálculo, presentaciones, reuniones y síntesis de información.
        </SectionHeading>

        {/* El requisito, respondido uno a uno */}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {matriz.map((tipo, index) => (
            <li key={tipo.id} className="panel spot reveal flex flex-col p-5" style={delay(index)}>
              <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                <Icon name={tipo.icon} size={19} />
              </span>
              <h3 className="mt-4 font-display text-[1.05rem] font-semibold tracking-tight">{tipo.titulo}</h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{tipo.descripcion}</p>
              <ul className="mt-auto space-y-1.5 pt-4">
                {tipo.enlaces.map((enlace) => {
                  const hash = enlace.href.startsWith("/#") ? enlace.href.slice(2) : null;
                  const className =
                    "group inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-accent transition-colors hover:text-ink";
                  return (
                    <li key={enlace.label}>
                      {hash ? (
                        <AnchorLink to={hash} className={className}>
                          {enlace.label}
                          <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </AnchorLink>
                      ) : (
                        <Link href={enlace.href} transitionTypes={["nav-forward"]} className={className}>
                          {enlace.label}
                          <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        {/* Caso real destacado */}
        <article className="panel reveal mt-6 overflow-hidden">
          <div className="grid gap-x-10 gap-y-6 p-5 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-real">
                  <Icon name="check" size={11} />
                  {kindLabel[destacado.kind]}
                </span>
                {destacado.tareas.map((tarea) => (
                  <span key={tarea} className="chip">
                    <Icon name={tareas[tarea].icon} size={12} />
                    {tareas[tarea].label}
                  </span>
                ))}
              </div>
              <h3 className="display mt-5 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.1]">
                <ViewTransition name={`caso-${destacado.slug}`} share="morph" default="none">
                  <span className="inline-block">{destacado.titulo}</span>
                </ViewTransition>
              </h3>
              <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted">{destacado.resumen}</p>
            </div>

            <div className="flex flex-col justify-between gap-5">
              <div>
                <p className="eyebrow text-[0.64rem]">Herramientas</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {destacado.herramientas.map((herramienta) => (
                    <li key={herramienta} className="chip">
                      {herramienta}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href={`/evidencia/${destacado.slug}`}
                  prefetch
                  transitionTypes={["nav-forward"]}
                  className="btn btn-primary btn-sm"
                >
                  Ver el caso completo
                  <Icon name="arrow-right" size={16} />
                </Link>
                {destacado.captura ? (
                  <Lightbox
                    src={destacado.captura.src}
                    alt={destacado.captura.alt}
                    width={destacado.captura.width}
                    height={destacado.captura.height}
                    caption={destacado.captura.pie}
                    label="Ver la captura original del escenario en Make"
                    className="btn btn-ghost btn-sm"
                  >
                    <Icon name="maximize" size={15} />
                    Ver captura original
                  </Lightbox>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-line p-4 sm:p-6">
            <FlowPlayer
              steps={destacado.flujo}
              label={`Flujo de ${destacado.flujo.length} módulos: ${destacado.flujo.map((paso) => paso.titulo).join(", ")}.`}
            />
          </div>

        </article>

        {/* Casos por tarea de oficina */}
        <div id="casos" tabIndex={-1} className="mt-16 scroll-mt-28">
          <Eyebrow className="reveal">Casos por tarea de oficina</Eyebrow>
          <p className="reveal mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted" style={delay(1)}>
            Los <strong>proyectos realizados</strong> existen y pueden revisarse. Los{" "}
            <strong>casos prácticos diseñados</strong> son material de formación: arquitecturas de referencia para
            enseñar y replicar cada automatización.
          </p>
          <div className="reveal mt-7" style={delay(2)}>
            <CaseExplorer casos={tarjetas} />
          </div>
        </div>
      </div>
    </section>
  );
}
