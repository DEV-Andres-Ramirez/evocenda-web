import type { CSSProperties } from "react";
import { AnchorLink } from "@/components/ui/anchor-link";
import { Icon } from "@/components/ui/icon";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDocencia } from "@/content/docencia";
import { cn } from "@/lib/cn";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export async function Docencia() {
  const docencia = await getDocencia();
  const { cafam, procesos } = docencia;

  return (
    <section id="docencia" tabIndex={-1} aria-labelledby="docencia-titulo" className="relative py-[clamp(5rem,10vw,8.5rem)]">
      <div className="shell">
        <SectionHeading id="docencia-titulo" nodo="03" etiqueta="Docencia" titulo={docencia.titular}>
          {docencia.entrada}
        </SectionHeading>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* Cafam */}
          <article className="panel reveal overflow-hidden lg:col-span-7">
            <div className="relative p-5 sm:p-8">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_0%,var(--glow-soft),transparent)]" />
              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-[0.66rem]">Formación empresarial</p>
                    <h3 className="display mt-3 text-[clamp(2rem,4vw,2.9rem)]">{cafam.organizacion}</h3>
                  </div>
                  <span className="chip">
                    <Icon name="map-pin" size={12} />
                    {cafam.lugar}
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-[1.08rem] font-medium leading-snug text-accent">{cafam.rol}</p>

                {/* Los cuatro ciclos de 2026 sobre la franja del año */}
                <div className="mt-8">
                  <div className="flex items-baseline justify-between">
                    <p className="font-mono text-[0.72rem] tracking-[0.16em] text-faint">{cafam.anio}</p>
                    <p className="font-mono text-[0.72rem] tracking-[0.1em] text-faint">
                      {cafam.meses.length} ciclos dictados
                    </p>
                  </div>
                  <ol
                    aria-label={`Meses dictados en ${cafam.anio}: ${cafam.periodo}`}
                    className="mt-2 grid grid-cols-12 gap-1 sm:gap-1.5"
                  >
                    {MESES.map((mes, index) => {
                      const dictado = cafam.meses.includes(index + 1);
                      return (
                        <li
                          key={mes}
                          className={cn(
                            "relative grid h-12 place-items-center rounded-lg border font-mono text-[0.62rem] uppercase tracking-[0.06em] sm:h-14 sm:text-[0.7rem]",
                            dictado
                              ? "border-neon bg-neon/20 font-medium text-ink shadow-[0_0_24px_-6px_var(--glow)]"
                              : "border-line text-faint",
                          )}
                        >
                          <span aria-hidden>{mes}</span>
                          <span className="sr-only">
                            {MESES_LARGOS[index]}
                            {dictado ? ": dictado" : ""}
                          </span>
                          {dictado ? (
                            <span aria-hidden className="absolute -top-1 right-1 size-1.5 rounded-full bg-signal shadow-[0_0_8px_2px_color-mix(in_oklab,var(--signal)_60%,transparent)]" />
                          ) : null}
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <ul className="node-list mt-8 text-[0.98rem] leading-relaxed text-muted">
                  {cafam.puntos.map((punto) => (
                    <li key={punto}>
                      <RichText text={punto} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <div className="grid gap-4 lg:col-span-5">
            {/* Ejes de formación */}
            <div className="panel reveal p-5 sm:p-6" style={delay(1)}>
              <p className="eyebrow text-[0.66rem]">Lo que enseño</p>
              <ul className="mt-4 grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {docencia.ejes.map((eje) => (
                  <li key={eje.titulo} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                      <Icon name={eje.icon} size={16} />
                    </span>
                    <div>
                      <h3 className="font-display text-[0.98rem] font-semibold leading-snug tracking-tight">{eje.titulo}</h3>
                      <p className="mt-1 text-[0.86rem] leading-relaxed text-muted">{eje.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Procesos Sostenibles */}
            <article className="panel reveal p-5 sm:p-6" style={delay(2)}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="display text-[1.35rem]">{procesos.organizacion}</h3>
                <p className="font-mono text-[0.72rem] tracking-[0.1em] text-faint">{procesos.periodo}</p>
              </div>
              <p className="mt-1.5 text-[0.95rem] font-medium leading-snug text-accent">{procesos.rol}</p>
              <ul className="node-list mt-4 text-[0.9rem] leading-relaxed text-muted">
                {procesos.puntos.map((punto) => (
                  <li key={punto}>
                    <RichText text={punto} />
                  </li>
                ))}
              </ul>
              <AnchorLink
                to="credenciales"
                className="group mt-5 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-accent transition-colors hover:text-ink"
              >
                Ver el certificado de experiencia
                <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
              </AnchorLink>
            </article>
          </div>
        </div>

        {/* Formación de usuarios dentro de proyectos de software */}
        <div className="reveal mt-4 grid gap-x-8 gap-y-5 rounded-[1.25rem] border border-line p-5 sm:p-6 lg:grid-cols-[1fr_2fr_auto] lg:items-center">
          <p className="font-display text-[1.02rem] font-semibold leading-snug tracking-tight">
            También formo a los usuarios de lo que construyo.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {docencia.capacitaciones.map((item) => (
              <li key={item.organizacion} className="text-[0.9rem] leading-relaxed text-muted">
                <strong className="mr-1.5">{item.organizacion}.</strong>
                {item.texto}
              </li>
            ))}
          </ul>
          <AnchorLink to="casos" className="btn btn-ghost btn-sm">
            <Icon name="book-open" size={15} />
            Material de formación
          </AnchorLink>
        </div>
      </div>
    </section>
  );
}
