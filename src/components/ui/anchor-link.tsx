"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { scrollToSection } from "@/lib/anchor";

/**
 * Enlace a un ancla de la home. Si el destino está visible se desplaza con
 * suavidad; si no (por ejemplo, desde una página de caso), navega a "/#id".
 */
export function AnchorLink({
  to,
  children,
  ...props
}: { to: string } & Omit<ComponentProps<typeof Link>, "href" | "onClick">) {
  return (
    <Link href={`/#${to}`} onClick={(event) => scrollToSection(event, to)} {...props}>
      {children}
    </Link>
  );
}
