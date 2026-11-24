import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-heading";
import { defaultMailSubject, defaultWhatsappMessage, mailtoUrl, site, whatsappUrl } from "@/content/site";
import { ContactComposer, CopyButton } from "./contact-composer";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export function Contacto() {
  const canales: { id: string; etiqueta: string; valor: string; href: string; icon: IconName; externo?: boolean; copiar?: string }[] = [
    {
      id: "whatsapp",
      etiqueta: "WhatsApp",
      valor: site.contact.phoneDisplay,
      href: whatsappUrl(defaultWhatsappMessage),
      icon: "whatsapp",
      externo: true,
    },
    { id: "telefono", etiqueta: "Teléfono", valor: site.contact.phoneDisplay, href: site.contact.phoneHref, icon: "phone" },
    {
      id: "correo",
      etiqueta: "Correo",
      valor: site.contact.email,
      href: mailtoUrl(defaultMailSubject),
      icon: "mail",
      copiar: site.contact.email,
    },
    {
      id: "linkedin",
      etiqueta: "LinkedIn",
      valor: site.contact.linkedinLabel,
      href: site.contact.linkedinUrl,
      icon: "linkedin",
      externo: true,
    },
  ];

  return (
    <section id="contacto" tabIndex={-1} aria-labelledby="contacto-titulo" className="relative py-[clamp(5rem,10vw,8.5rem)]">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-line-strong bg-surface px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="lattice absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_20%_10%,#000,transparent_75%)]" />
            <div className="aurora-drift absolute -left-40 -top-40 size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-60 blur-2xl" />
            <div className="absolute -bottom-52 -right-40 size-[32rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--signal)_22%,transparent),transparent)] blur-2xl" />
          </div>

          <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[1fr_0.95fr]">
            <div className="min-w-0">
              <Eyebrow nodo="08" className="reveal">
                Contacto
              </Eyebrow>
              <h2 id="contacto-titulo" className="display reveal mt-5 text-[clamp(2.2rem,5.4vw,4.2rem)] leading-[1.02]" style={delay(1)}>
                ¿Construimos el <span className="text-gradient">siguiente nodo</span>?
              </h2>
              <p className="reveal mt-6 max-w-lg text-[1.08rem] leading-relaxed text-muted" style={delay(2)}>
                Conversemos sobre formación en inteligencia artificial, automatización de procesos o desarrollo de
                software. Elige el canal que prefieras.
              </p>

              <ul className="reveal mt-9 border-t border-line" style={delay(3)}>
                {canales.map((canal) => (
                  <li key={canal.id} className="group relative flex items-center gap-4 border-b border-line py-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent transition-[border-color,box-shadow] duration-300 group-hover:border-neon group-hover:shadow-[0_0_22px_-6px_var(--glow)]">
                      <Icon name={canal.icon} size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-[0.62rem]">{canal.etiqueta}</p>
                      <a
                        href={canal.href}
                        {...(canal.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-0.5 block truncate font-display text-[1.08rem] font-semibold tracking-tight text-ink outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-neon"
                      >
                        {canal.valor}
                      </a>
                    </div>
                    {canal.copiar ? <CopyButton value={canal.copiar} label="Copiar el correo" /> : null}
                    <Icon
                      name={canal.externo ? "arrow-up-right" : "arrow-right"}
                      size={17}
                      className="shrink-0 text-faint transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </li>
                ))}
              </ul>

              <div className="reveal mt-7" style={delay(4)}>
                <a href={site.cv} download className="btn btn-ghost">
                  <Icon name="download" size={17} />
                  Descargar hoja de vida
                  <span className="font-mono text-[0.68rem] text-faint">PDF</span>
                </a>
              </div>
            </div>

            <div className="reveal min-w-0 lg:pt-14" style={delay(3)}>
              <ContactComposer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
