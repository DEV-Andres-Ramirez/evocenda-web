import type { MetadataRoute } from "next";
import { getCasoSlugs } from "@/content/evidencia";
import { site } from "@/content/site";

/** Fecha fija de la última actualización del contenido (no se puede leer la fecha actual en el build estático). */
const ULTIMA_ACTUALIZACION = "2026-11-24";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getCasoSlugs();
  return [
    { url: site.url, lastModified: ULTIMA_ACTUALIZACION, changeFrequency: "monthly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${site.url}/evidencia/${slug}`,
      lastModified: ULTIMA_ACTUALIZACION,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
