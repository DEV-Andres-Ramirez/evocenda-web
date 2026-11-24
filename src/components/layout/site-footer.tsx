import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { defaultMailSubject, defaultWhatsappMessage, mailtoUrl, sections, site, whatsappUrl } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-bg-deep">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-muted">
            {site.tagline}. Una ruta con nodos, hitos y capas que se siguen construyendo.
          </p>
          <div className="mt-6 flex gap-2">
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
          </div>
        </div>

        <nav aria-label="Mapa del sitio">
          <p className="eyebrow">La senda</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <Link href={`/#${section.id}`} className="link-underline text-muted transition-colors hover:text-ink">
                  <span className="mr-2 font-mono text-[0.68rem] text-faint">{section.nodo}</span>
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a href={site.contact.phoneHref} className="link-underline transition-colors hover:text-ink">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailtoUrl(defaultMailSubject)} className="link-underline break-all transition-colors hover:text-ink">
                {site.contact.email}
              </a>
            </li>
            <li>{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.displayName}
          </p>
          <p>Diseñado y desarrollado con Next.js y Claude Code</p>
        </div>
      </div>
    </footer>
  );
}
