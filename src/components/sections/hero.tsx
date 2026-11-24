import type { CSSProperties } from "react";
import { NeuralField } from "@/components/fx/neural-field";
import { AnchorLink } from "@/components/ui/anchor-link";
import { Icon } from "@/components/ui/icon";
import { NodeDot } from "@/components/ui/section-heading";
import { getPerfil } from "@/content/perfil";
import { defaultMailSubject, defaultWhatsappMessage, mailtoUrl, site, whatsappUrl } from "@/content/site";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export async function Hero() {
  const perfil = await getPerfil();

  return (
    <section
      id="inicio"
      tabIndex={-1}
      aria-labelledby="inicio-titulo"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      {/* Fondo: retícula, aurora lila y red neuronal */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="lattice absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_55%_38%,#000_20%,transparent_78%)]" />
        <div className="aurora-drift absolute -left-[12%] top-[8%] size-[46rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-soft),transparent)] blur-2xl" />
        <div className="aurora-drift absolute -right-[10%] top-[18%] size-[40rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-soft),transparent)] blur-2xl [animation-delay:-9s]" />
        <NeuralField className="absolute inset-0 size-full" />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-bg via-bg/75 to-transparent max-lg:w-full max-lg:bg-gradient-to-b max-lg:from-transparent max-lg:via-bg/70 max-lg:to-bg" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="shell flex flex-1 flex-col justify-center pb-10 pt-32">
        <div className="max-w-[46rem]">
          <p className="eyebrow rise flex flex-wrap items-center gap-x-3 gap-y-1" style={delay(0)}>
            <NodeDot />
            <span>Evocenda by Andrés</span>
            <span aria-hidden className="text-faint">
              /
            </span>
            <span>nodo 00 · inicio</span>
          </p>

          <h1
            id="inicio-titulo"
            className="display rise mt-6 text-[clamp(2.85rem,8vw,6.6rem)] leading-[0.98]"
            style={delay(1)}
          >
            Mi evolución,
            <br />
            hecha{" "}
            <span className="relative inline-block">
              <span className="text-gradient">senda</span>
              <svg
                aria-hidden
                viewBox="0 0 300 26"
                preserveAspectRatio="none"
                className="absolute -bottom-[0.14em] left-0 h-[0.2em] w-full overflow-visible"
              >
                <path
                  d="M2 17C52 3 96 25 150 13S252 4 298 15"
                  fill="none"
                  stroke="var(--neon)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.75"
                />
              </svg>
              <span className="absolute -bottom-[0.1em] -right-[0.06em] size-[0.14em] rounded-full bg-signal shadow-[0_0_18px_4px_color-mix(in_oklab,var(--signal)_55%,transparent)]" />
            </span>
            <span className="text-neon">.</span>
          </h1>

          <p className="rise mt-8 max-w-xl text-[1.1rem] leading-relaxed text-muted sm:text-[1.2rem]" style={delay(2)}>
            Soy <strong>{site.displayName}</strong>, ingeniero de sistemas, desarrollador full-stack senior y formador en
            inteligencia artificial. Construyo software, automatizo procesos y enseño a las empresas a usar la IA como
            herramienta de avance.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={delay(3)}>
            <AnchorLink to="evidencia" className="btn btn-primary">
              Ver evidencia de IA aplicada
              <Icon name="arrow-right" size={17} />
            </AnchorLink>
            <AnchorLink to="senda" className="btn btn-ghost">
              <Icon name="route" size={17} />
              Recorrer la senda
            </AnchorLink>
            <span className="ml-1 flex items-center gap-1.5">
              <a
                href={site.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="LinkedIn de Andrés Ramírez"
              >
                <Icon name="linkedin" />
              </a>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="Escribir por WhatsApp"
              >
                <Icon name="whatsapp" />
              </a>
              <a href={mailtoUrl(defaultMailSubject)} className="icon-btn" aria-label="Enviar un correo">
                <Icon name="mail" />
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Datos verificables, como lecturas de telemetría */}
      <div className="shell pb-8">
        <dl
          className="rise grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:grid-cols-4"
          style={delay(5)}
        >
          {perfil.datos.map((dato) => (
            <div key={dato.etiqueta} className="min-w-0">
              <dt className="eyebrow text-[0.64rem]">{dato.etiqueta}</dt>
              <dd className="mt-1.5">
                <span className="display block text-[1.45rem] tracking-[-0.02em]">{dato.valor}</span>
                <span className="mt-0.5 block text-[0.82rem] text-muted">{dato.detalle}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
