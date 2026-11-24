"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { defaultWhatsappMessage, sections, site, whatsappUrl } from "@/content/site";
import { scrollToSection } from "@/lib/anchor";
import { cn } from "@/lib/cn";

/** Menú a pantalla completa: la lista de secciones dibujada como una senda. */
export function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-label="Menú de navegación"
      className="dialog-fade fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-bg p-0 text-ink"
    >
      <div className="lattice pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative flex min-h-full flex-col px-6 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <LogoMark className="size-10" />
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Cerrar el menú">
            <Icon name="x" />
          </button>
        </div>

        <nav aria-label="Secciones" className="mt-8 flex-1">
          <ol className="relative">
            <span aria-hidden className="absolute bottom-6 left-[0.6875rem] top-6 w-px bg-line-strong" />
            {sections.map((section) => {
              const current = active === section.id;
              return (
                <li key={section.id}>
                  <Link
                    href={`/#${section.id}`}
                    onClick={(event) => {
                      onClose();
                      scrollToSection(event, section.id);
                    }}
                    aria-current={current ? "location" : undefined}
                    className="group flex items-center gap-5 py-3"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "relative z-10 grid size-[1.4375rem] shrink-0 place-items-center rounded-full border bg-bg transition-colors",
                        current ? "border-neon" : "border-line-strong group-hover:border-neon",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full transition-colors",
                          current ? "bg-neon shadow-[0_0_12px_3px_var(--glow)]" : "bg-faint group-hover:bg-neon",
                        )}
                      />
                    </span>
                    <span className="flex flex-1 items-baseline justify-between gap-4">
                      <span
                        className={cn(
                          "display text-[1.75rem] transition-colors",
                          current ? "text-ink" : "text-muted group-hover:text-ink",
                        )}
                      >
                        {section.label}
                      </span>
                      <span className="font-mono text-xs tracking-[0.18em] text-faint">{section.nodo}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <a
            href={whatsappUrl(defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Icon name="whatsapp" />
            WhatsApp
          </a>
          <a href={site.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <Icon name="linkedin" />
            LinkedIn
          </a>
        </div>
      </div>
    </dialog>
  );
}
