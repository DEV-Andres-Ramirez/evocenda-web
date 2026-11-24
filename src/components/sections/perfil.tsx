import type { CSSProperties } from "react";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPerfil } from "@/content/perfil";
import { LayerStack } from "./layer-stack";

export async function Perfil() {
  const perfil = await getPerfil();

  return (
    <section id="perfil" tabIndex={-1} aria-labelledby="perfil-titulo" className="relative py-[clamp(5rem,10vw,8.5rem)]">
      <div className="shell grid gap-x-12 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="perfil-titulo" nodo="01" etiqueta="Perfil" titulo={perfil.titular} />
          <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-muted">
            {perfil.parrafos.map((parrafo, index) => (
              <p key={index} className="reveal" style={{ "--i": index + 2 } as CSSProperties}>
                <RichText text={parrafo} />
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="panel reveal p-5 sm:p-7" style={{ "--i": 2 } as CSSProperties}>
            <p className="eyebrow mb-5 text-[0.66rem]">Áreas de enfoque · cuatro capas</p>
            <LayerStack capas={perfil.capas} />
          </div>
        </div>
      </div>
    </section>
  );
}
