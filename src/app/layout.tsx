import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { PointerFx } from "@/components/fx/pointer-fx";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPreguntas } from "@/content/consola";
import { getCasos } from "@/content/evidencia";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Todo el sitio es estático. Con esta marca, cualquier trabajo en tiempo de
 * petición (una consulta sin caché, leer cookies) falla en el build en lugar
 * de degradar el rendimiento en silencio. Revisar cuando se conecte la base de datos.
 */
export const ensureStatic = "navigation";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author, url: site.contact.linkedinUrl }],
  creator: site.author,
  keywords: [
    "Andrés Ramírez",
    "Evocenda",
    "portafolio",
    "inteligencia artificial",
    "IA generativa",
    "automatización",
    "transformación digital",
    "formación empresarial",
    "desarrollador full-stack",
    "Claude Code",
    "n8n",
    "Make",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: site.name,
    title,
    description: site.description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090612",
  colorScheme: "dark light",
};

/**
 * Se ejecuta antes del primer pintado: fija el tema (oscuro por defecto, claro
 * solo si la persona lo eligió) y marca que hay JavaScript para los revelados.
 * Seguro: si la aplicación no llega a hidratarse en 4 s, retira la marca para
 * que ningún contenido quede oculto esperando una animación.
 */
const themeScript = `(function(){try{var d=document.documentElement;d.setAttribute("data-theme",localStorage.getItem("theme")==="light"?"light":"dark");d.setAttribute("data-js","");setTimeout(function(){if(!window.__evoReveal)d.removeAttribute("data-js")},4000)}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [casos, preguntas] = await Promise.all([getCasos(), getPreguntas()]);
  const casosNav = casos.map((caso) => ({
    slug: caso.slug,
    titulo: caso.tituloCorto,
    realizado: caso.kind === "realizado",
  }));

  return (
    <html
      lang="es"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sora.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent"
        >
          Saltar al contenido
        </a>
        <SiteHeader casos={casosNav} preguntas={preguntas} />
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <PointerFx />
      </body>
    </html>
  );
}
