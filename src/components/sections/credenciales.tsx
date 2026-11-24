import Image from "next/image";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import { Lightbox } from "@/components/ui/lightbox";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { getCredenciales } from "@/content/credenciales";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export async function Credenciales() {
  const { titulos, certificados, logros, insignias, referencias } = await getCredenciales();

  return (
    <section
      id="credenciales"
      tabIndex={-1}
      aria-labelledby="credenciales-titulo"
      className="relative py-[clamp(5rem,10vw,8.5rem)]"
    >
      <div className="shell">
        <SectionHeading id="credenciales-titulo" nodo="07" etiqueta="Credenciales" titulo="Formación, certificados y logros.">
          Cada dato de esta sección sale de un documento. Las vistas previas muestran los certificados con los datos
          personales protegidos.
        </SectionHeading>

        {/* Formación académica */}
        <div className="mt-12">
          <Eyebrow className="reveal">Formación académica</Eyebrow>
          <ol className="mt-5 border-t border-line">
            {titulos.map((titulo, index) => (
              <li
                key={titulo.id}
                className="reveal grid gap-x-10 gap-y-3 border-b border-line py-7 lg:grid-cols-[13rem_1fr]"
                style={delay(index)}
              >
                <div>
                  <p className="font-mono text-[0.76rem] tracking-[0.08em] text-muted">{titulo.periodo}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[0.82rem] text-faint">
                    <Icon name="map-pin" size={12} />
                    {titulo.lugar}
                  </p>
                </div>
                <div>
                  <h3 className="display text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.16]">{titulo.titulo}</h3>
                  <p className="mt-1.5 text-[1rem] font-medium text-accent">{titulo.institucion}</p>
                  <ul className="mt-3 max-w-3xl space-y-1.5 text-[0.94rem] leading-relaxed text-muted">
                    {titulo.notas.map((nota) => (
                      <li key={nota}>{nota}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Certificados: ancla propia para llegar directo desde la matriz de evidencia */}
        <div id="certificados" tabIndex={-1} className="mt-16 scroll-mt-28">
          <Eyebrow className="reveal">Certificados</Eyebrow>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {certificados.map((certificado, index) => (
              <li
                key={certificado.id}
                className={index < 2 ? "reveal lg:col-span-3" : "reveal lg:col-span-2"}
                style={delay(index % 3)}
              >
                <article className="panel spot flex h-full flex-col overflow-hidden">
                  {certificado.imagen ? (
                    <Lightbox
                      src={certificado.imagen.src}
                      alt={certificado.imagen.alt}
                      width={certificado.imagen.width}
                      height={certificado.imagen.height}
                      caption={`${certificado.titulo} · ${certificado.emisor}`}
                      label={`Ampliar: ${certificado.titulo}`}
                      className="group relative block aspect-[16/10] w-full overflow-hidden border-b border-line bg-white"
                    >
                      <Image
                        src={certificado.imagen.src}
                        alt=""
                        width={certificado.imagen.width}
                        height={certificado.imagen.height}
                        sizes="(min-width: 1024px) 560px, (min-width: 640px) 46vw, 92vw"
                        className="size-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                      />
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#120d1e]/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        <Icon name="maximize" size={12} />
                        Ver documento
                      </span>
                    </Lightbox>
                  ) : (
                    <div
                      aria-hidden
                      className="relative grid aspect-[16/10] place-items-center overflow-hidden border-b border-line bg-bg-deep"
                    >
                      <div className="lattice absolute inset-0" />
                      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,var(--glow-soft),transparent)]" />
                      <div className="relative grid justify-items-center text-center">
                        <Icon name={certificado.icon} size={44} className="text-accent" />
                        <p className="eyebrow mt-4 text-[0.64rem]">{certificado.emisor}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                        <Icon name={certificado.icon} size={16} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.02rem] font-semibold leading-snug tracking-tight">
                          {certificado.titulo}
                        </h3>
                        <p className="mt-0.5 text-[0.88rem] text-muted">{certificado.emisor}</p>
                      </div>
                    </div>
                    <dl className="mt-auto space-y-1 pt-4 font-mono text-[0.72rem] leading-relaxed text-faint">
                      <div>
                        <dt className="sr-only">Fecha</dt>
                        <dd className="text-muted">{certificado.fecha}</dd>
                      </div>
                      {certificado.datos.map((dato) => (
                        <div key={dato}>
                          <dt className="sr-only">Dato</dt>
                          <dd>{dato}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {/* Logros verificables */}
        <div className="mt-16">
          <Eyebrow className="reveal">Logros verificables</Eyebrow>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {logros.map((logro, index) => (
              <li key={logro.id} className="reveal" style={delay(index)}>
                <div className="panel spot h-full p-5 text-center">
                  <span className="relative mx-auto grid size-16 place-items-center">
                    <svg aria-hidden viewBox="0 0 64 64" className="absolute inset-0 size-full">
                      <path
                        d="M32 3 57 17.5v29L32 61 7 46.5v-29z"
                        className="fill-neon/12 stroke-neon"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path d="M32 10 51 21v22L32 54 13 43V21z" fill="none" className="stroke-neon/35" strokeWidth="1" strokeDasharray="2 4" />
                    </svg>
                    <Icon name={logro.icon} size={22} className="relative text-accent" />
                  </span>
                  <h3 className="mt-4 font-display text-[0.98rem] font-semibold leading-snug tracking-tight">{logro.titulo}</h3>
                  <p className="mt-1 text-[0.86rem] leading-snug text-muted">{logro.detalle}</p>
                  <p className="mt-3 border-t border-line pt-3 font-mono text-[0.66rem] leading-relaxed text-faint">{logro.fuente}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Insignias digitales de terceros: solo aparece cuando hay alguna registrada */}
        {insignias.length > 0 ? (
          <div className="mt-16">
            <Eyebrow className="reveal">Insignias digitales</Eyebrow>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {insignias.map((insignia) => (
                <li key={insignia.id} className="reveal">
                  <a href={insignia.url} target="_blank" rel="noopener noreferrer" className="panel spot block h-full p-5">
                    <h3 className="font-display text-[1rem] font-semibold tracking-tight">{insignia.titulo}</h3>
                    <p className="mt-1 text-[0.86rem] text-muted">{insignia.emisor}</p>
                    <p className="mt-3 font-mono text-[0.68rem] text-faint">{insignia.fecha}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Referencias */}
        <div className="mt-16">
          <Eyebrow className="reveal">Referencias profesionales</Eyebrow>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {referencias.map((referencia, index) => (
              <li key={referencia.nombre} className="reveal rounded-[1.25rem] border border-line p-5" style={delay(index)}>
                <p className="font-display text-[1.02rem] font-semibold leading-snug tracking-tight">{referencia.nombre}</p>
                <p className="mt-1.5 text-[0.9rem] leading-snug text-muted">{referencia.cargo}</p>
              </li>
            ))}
          </ul>
          <p className="reveal mt-4 inline-flex items-center gap-2 text-[0.86rem] text-faint">
            <Icon name="lock" size={13} />
            Datos de contacto de las referencias disponibles a solicitud.
          </p>
        </div>
      </div>
    </section>
  );
}
