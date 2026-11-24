import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition, type ReactNode } from "react";
import { FlowPlayer } from "@/components/evidencia/flow-player";
import { RevealObserver } from "@/components/fx/reveal-observer";
import { AnchorLink } from "@/components/ui/anchor-link";
import { Icon } from "@/components/ui/icon";
import { Lightbox } from "@/components/ui/lightbox";
import { NodeDot } from "@/components/ui/section-heading";
import { getCaso, getCasos, getCasoSlugs, kindLabel, notaDiseno, tareas } from "@/content/evidencia";
import { site } from "@/content/site";

export async function generateStaticParams() {
  const slugs = await getCasoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/evidencia/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const caso = await getCaso(slug);
  if (!caso) return {};

  const title = caso.tituloCorto;
  const url = `/evidencia/${caso.slug}`;
  return {
    title,
    description: caso.resumen,
    alternates: { canonical: url },
    // openGraph no se fusiona en profundidad con el del layout: se define completo.
    openGraph: {
      type: "article",
      locale: "es_CO",
      siteName: site.name,
      title: `${title} · ${site.name}`,
      description: caso.resumen,
      url,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description: caso.resumen, images: ["/og.png"] },
  };
}

export default function CasoPage({ params }: PageProps<"/evidencia/[slug]">) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div className="relative isolate overflow-clip pb-24 pt-28 sm:pt-32">
        <RevealObserver />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[34rem]">
          <div className="lattice absolute inset-0 [mask-image:linear-gradient(#000,transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_75%_0%,var(--glow-soft),transparent)]" />
        </div>

        <div className="shell">
          <AnchorLink
            to="evidencia"
            transitionTypes={["nav-back"]}
            className="eyebrow group inline-flex items-center gap-2 transition-colors hover:text-ink"
          >
            <Icon name="arrow-left" size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Evidencia de IA aplicada
          </AnchorLink>

          {/* params se resuelve dentro de Suspense: es el patrón recomendado con prefetch parcial. */}
          <Suspense fallback={<CasoSkeleton />}>
            <CasoContent params={params} />
          </Suspense>
        </div>
      </div>
    </ViewTransition>
  );
}

function CasoSkeleton() {
  return (
    <div aria-hidden className="mt-8 animate-pulse">
      <div className="h-6 w-48 rounded-full bg-surface-2" />
      <div className="mt-6 h-14 max-w-3xl rounded-2xl bg-surface-2" />
      <div className="mt-3 h-14 max-w-xl rounded-2xl bg-surface-2" />
      <div className="mt-8 h-24 max-w-2xl rounded-2xl bg-surface-2" />
    </div>
  );
}

function Bloque({
  numero,
  titulo,
  ancho = false,
  children,
}: {
  numero: string;
  titulo: string;
  /** El contenido ocupa todo el ancho (diagramas). */
  ancho?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={
        ancho
          ? "reveal mt-16 grid gap-y-6 border-t border-line pt-8"
          : "reveal mt-16 grid gap-x-10 gap-y-5 border-t border-line pt-8 lg:grid-cols-[14rem_1fr]"
      }
    >
      <header>
        <p className="font-mono text-[0.72rem] tracking-[0.18em] text-faint">{numero}</p>
        <h2 className="display mt-2 text-[1.5rem] leading-tight">{titulo}</h2>
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

async function CasoContent({ params }: Pick<PageProps<"/evidencia/[slug]">, "params">) {
  const { slug } = await params;
  const [caso, casos] = await Promise.all([getCaso(slug), getCasos()]);
  if (!caso) notFound();

  const index = casos.findIndex((item) => item.slug === caso.slug);
  const anterior = casos[(index - 1 + casos.length) % casos.length];
  const siguiente = casos[(index + 1) % casos.length];
  const realizado = caso.kind === "realizado";
  let n = 0;
  const numero = () => String(++n).padStart(2, "0");

  return (
    <article className="mt-8">
      <header className="grid gap-x-12 gap-y-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={realizado ? "tag tag-real" : "tag tag-design"}>
              <Icon name={realizado ? "check" : "book-open"} size={11} />
              {kindLabel[caso.kind]}
            </span>
            {caso.tareas.map((tarea) => (
              <span key={tarea} className="chip">
                <Icon name={tareas[tarea].icon} size={12} />
                {tareas[tarea].label}
              </span>
            ))}
          </div>
          <h1 className="display mt-6 text-[clamp(2.1rem,5vw,3.9rem)] leading-[1.04]">
            <ViewTransition name={`caso-${caso.slug}`} share="morph" default="none">
              <span className="inline-block">{caso.titulo}</span>
            </ViewTransition>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.12rem] leading-relaxed text-muted">{caso.resumen}</p>
        </div>

        <dl className="panel grid gap-5 p-5">
          <div>
            <dt className="eyebrow text-[0.64rem]">Herramientas</dt>
            <dd className="mt-2.5 flex flex-wrap gap-1.5">
              {caso.herramientas.map((herramienta) => (
                <span key={herramienta} className="chip">
                  {herramienta}
                </span>
              ))}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
            <div>
              <dt className="eyebrow text-[0.64rem]">Pasos</dt>
              <dd className="display mt-1 text-xl">{caso.flujo.length}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.64rem]">Nivel</dt>
              <dd className="display mt-1 text-xl">{caso.nivel}</dd>
            </div>
          </div>
        </dl>
      </header>

      {!realizado ? (
        <p className="mt-8 flex max-w-3xl gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-[0.92rem] leading-relaxed text-muted">
          <Icon name="book-open" size={18} className="mt-0.5 shrink-0 text-accent" />
          {notaDiseno}
        </p>
      ) : null}

      <Bloque numero={numero()} titulo="El problema">
        <div className="max-w-3xl space-y-4 text-[1.04rem] leading-relaxed text-muted">
          {caso.problema.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </Bloque>

      <Bloque numero={numero()} titulo="El flujo, paso a paso" ancho>
        <div className="panel p-4 sm:p-6">
          <FlowPlayer
            steps={caso.flujo}
            variant="full"
            label={`Flujo de ${caso.flujo.length} pasos: ${caso.flujo.map((paso) => paso.titulo).join(", ")}.`}
          />
        </div>
      </Bloque>

      {caso.captura ? (
        <Bloque numero={numero()} titulo="La evidencia">
          <figure>
            <Lightbox
              src={caso.captura.src}
              alt={caso.captura.alt}
              width={caso.captura.width}
              height={caso.captura.height}
              caption={caso.captura.pie}
              label="Ampliar la captura del escenario en Make"
              className="group relative block w-full overflow-hidden rounded-2xl border border-line-strong bg-white"
            >
              <Image
                src={caso.captura.src}
                alt={caso.captura.alt}
                width={caso.captura.width}
                height={caso.captura.height}
                sizes="(min-width: 1024px) 860px, 94vw"
                className="h-auto w-full"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-[#120d1e]/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-transform group-hover:scale-105">
                <Icon name="maximize" size={13} />
                Ampliar
              </span>
            </Lightbox>
            <figcaption className="mt-3 text-sm text-faint">{caso.captura.pie}</figcaption>
          </figure>
        </Bloque>
      ) : null}

      <Bloque numero={numero()} titulo="Dónde entra la IA">
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {caso.ia.map((item) => (
            <li key={item.titulo} className="panel spot p-5">
              <span className="grid size-9 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                <Icon name="sparkles" size={16} />
              </span>
              <h3 className="mt-4 font-display text-[1.02rem] font-semibold tracking-tight">{item.titulo}</h3>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{item.texto}</p>
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque numero={numero()} titulo="Controles y buenas prácticas">
        <ul className="node-list max-w-3xl text-[1.02rem] leading-relaxed text-muted">
          {caso.controles.map((control) => (
            <li key={control}>{control}</li>
          ))}
        </ul>
      </Bloque>

      <Bloque numero={numero()} titulo={realizado ? "Resultado" : "Resultado esperado"}>
        <ul className="grid gap-3 md:grid-cols-3">
          {caso.resultado.map((punto) => (
            <li key={punto} className="flex gap-3 rounded-2xl border border-line bg-surface-2/50 p-4 text-[0.95rem] leading-relaxed text-muted">
              <Icon name="check" size={17} className="mt-0.5 shrink-0 text-signal" />
              {punto}
            </li>
          ))}
        </ul>
      </Bloque>

      {caso.prompt ? (
        <Bloque numero={numero()} titulo={caso.prompt.titulo}>
          <figure className="overflow-hidden rounded-2xl border border-line-strong bg-bg-deep">
            <figcaption className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.08em] text-faint">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-neon/70" />
              </span>
              <span className="ml-2">{caso.prompt.nota}</span>
            </figcaption>
            <pre className="overflow-x-auto p-4 font-mono text-[0.82rem] leading-relaxed text-ink sm:p-5">
              <code>{caso.prompt.texto}</code>
            </pre>
          </figure>
        </Bloque>
      ) : null}

      {caso.aprendizajes ? (
        <Bloque numero={numero()} titulo="Qué se practica con este caso">
          <ul className="node-list max-w-3xl text-[1.02rem] leading-relaxed text-muted">
            {caso.aprendizajes.map((aprendizaje) => (
              <li key={aprendizaje}>{aprendizaje}</li>
            ))}
          </ul>
        </Bloque>
      ) : null}

      {/* Navegación entre casos y llamada a contacto */}
      <nav aria-label="Otros casos" className="mt-20 grid gap-4 md:grid-cols-2">
        {[
          { caso: anterior, etiqueta: "Caso anterior", tipo: "nav-back", icon: "arrow-left" as const },
          { caso: siguiente, etiqueta: "Caso siguiente", tipo: "nav-forward", icon: "arrow-right" as const },
        ].map((item) => (
          <Link
            key={item.etiqueta}
            href={`/evidencia/${item.caso.slug}`}
            transitionTypes={[item.tipo]}
            className="panel spot group flex min-w-0 items-center gap-4 p-5 transition-transform duration-500 ease-out-expo hover:-translate-y-1"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-neon group-hover:text-ink">
              <Icon name={item.icon} size={17} />
            </span>
            <span className="min-w-0">
              <span className="eyebrow block text-[0.64rem]">{item.etiqueta}</span>
              <span className="mt-1 block truncate font-display text-[1.02rem] font-semibold tracking-tight">
                {item.caso.tituloCorto}
              </span>
            </span>
          </Link>
        ))}
      </nav>

      <aside className="panel relative mt-4 overflow-hidden p-6 sm:p-9">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_120%_at_100%_0%,var(--glow-soft),transparent)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow flex items-center gap-3">
              <NodeDot />
              Siguiente nodo
            </p>
            <p className="display mt-3 text-[clamp(1.4rem,2.6vw,2rem)] leading-tight">
              ¿Quieres llevar una automatización así a tu equipo?
            </p>
          </div>
          <AnchorLink to="contacto" transitionTypes={["nav-back"]} className="btn btn-primary">
            Conversemos
            <Icon name="arrow-right" size={17} />
          </AnchorLink>
        </div>
      </aside>
    </article>
  );
}
