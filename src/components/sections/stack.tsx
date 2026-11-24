import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { getStack } from "@/content/stack";
import { cn } from "@/lib/cn";
import { StackExplorer } from "./stack-explorer";

const MCER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export async function Stack() {
  const { categorias, idiomas } = await getStack();
  const total = categorias.reduce((sum, categoria) => sum + categoria.habilidades.length, 0);

  return (
    <section id="stack" tabIndex={-1} aria-labelledby="stack-titulo" className="relative py-[clamp(5rem,10vw,8.5rem)]">
      <div className="shell">
        <SectionHeading id="stack-titulo" nodo="06" etiqueta="Stack" titulo="Una constelación de herramientas.">
          {total} habilidades en {categorias.length} cúmulos: de la inteligencia artificial y la automatización al
          desarrollo full-stack, los datos, la nube y la calidad.
        </SectionHeading>

        <div className="reveal mt-12">
          <StackExplorer categorias={categorias} />
        </div>

        {/* Idiomas sobre la escala del Marco Común Europeo */}
        <div className="reveal mt-10 rounded-[1.25rem] border border-line p-5 sm:p-7">
          <p className="eyebrow flex items-center gap-2.5 text-[0.66rem]">
            <Icon name="languages" size={14} />
            Idiomas
          </p>
          <ul className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-3">
            {idiomas.map((idioma) => (
              <li key={idioma.idioma}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="display text-[1.3rem]">{idioma.idioma}</p>
                  <p className="text-[0.86rem] text-muted">{idioma.nivel}</p>
                </div>
                <ol aria-hidden className="mt-3 grid grid-cols-6 gap-1.5">
                  {MCER.map((nivel, index) => {
                    const lit = index < idioma.escala;
                    return (
                      <li key={nivel}>
                        <span
                          className={cn(
                            "block h-1.5 rounded-full",
                            lit ? "bg-gradient-to-r from-neon to-signal" : "bg-line-strong",
                          )}
                        />
                        <span className={cn("mt-1.5 block font-mono text-[0.6rem] tracking-[0.1em]", lit ? "text-muted" : "text-faint")}>
                          {nivel}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
