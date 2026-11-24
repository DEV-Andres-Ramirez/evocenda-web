"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Visor de imagen a pantalla completa (capturas y certificados).
 * La imagen grande solo se descarga cuando se abre por primera vez.
 */
export function Lightbox({
  src,
  alt,
  width,
  height,
  caption,
  children,
  className,
  label,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpened(true);
          dialog.current?.showModal();
        }}
        aria-haspopup="dialog"
        aria-label={label}
        className={className}
      >
        {children}
      </button>

      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="dialog-pop fixed inset-0 m-auto max-h-[94dvh] w-[min(72rem,calc(100vw-1.5rem))] max-w-none overflow-hidden rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-[var(--shadow-float)]"
      >
        <div className="flex max-h-[94dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
            <p className="min-w-0 truncate text-sm text-muted">{caption ?? alt}</p>
            <button type="button" onClick={() => dialog.current?.close()} className="icon-btn shrink-0" aria-label="Cerrar el visor">
              <Icon name="x" size={16} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-white p-2 sm:p-4">
            {opened ? (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(min-width: 1200px) 1100px, 96vw"
                className={cn("mx-auto h-auto max-w-full", height > width ? "max-h-none w-auto sm:max-w-[46rem]" : "w-full")}
              />
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
