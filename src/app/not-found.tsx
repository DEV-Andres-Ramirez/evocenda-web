import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { NodeDot } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Te saliste de la senda",
  robots: { index: false, follow: true },
};

// Solo componentes de servidor: esta página se incluye en todas las rutas.
export default function NotFound() {
  return (
    <div className="relative isolate grid min-h-svh place-items-center overflow-hidden px-6 py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="lattice absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,#000_20%,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-soft),transparent)] blur-2xl" />
      </div>

      <div className="max-w-xl text-center">
        <p className="eyebrow inline-flex items-center gap-3">
          <NodeDot />
          Error 404 · nodo no encontrado
        </p>
        <h1 className="display mt-6 text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02]">
          Te saliste de la <span className="text-gradient">senda</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[1.08rem] leading-relaxed text-muted">
          Esta ruta no existe o cambió de lugar. Vuelve al inicio y retoma el recorrido.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Icon name="arrow-left" size={17} />
            Volver al inicio
          </Link>
          <Link href="/#evidencia" className="btn btn-ghost">
            Ver evidencia de IA aplicada
          </Link>
        </div>
      </div>
    </div>
  );
}
