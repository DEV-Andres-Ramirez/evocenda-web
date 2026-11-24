import { SectionHeading } from "@/components/ui/section-heading";
import { getHitos } from "@/content/senda";
import { SendaTimeline } from "./senda-timeline";

export async function Senda() {
  const hitos = await getHitos();

  return (
    <section id="senda" tabIndex={-1} aria-labelledby="senda-titulo" className="relative py-[clamp(5rem,10vw,8.5rem)]">
      <div aria-hidden className="lattice absolute inset-0 -z-10 [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]" />
      <div className="shell">
        <SectionHeading id="senda-titulo" nodo="04" etiqueta="Senda" titulo="La senda, de hoy al origen.">
          No es una línea recta: es una ruta con nodos, hitos y capas. Experiencia profesional, docencia, formación e
          hitos, desde el presente hasta el punto de partida en 2018.
        </SectionHeading>
        <div className="reveal mt-10">
          <SendaTimeline hitos={hitos} />
        </div>
      </div>
    </section>
  );
}
