/** Datos generales del sitio y de contacto. */
export const site = {
  name: "Evocenda by Andrés",
  shortName: "Evocenda",
  tagline: "Mi evolución hecha senda",
  description:
    "Portafolio de Andrés Ramírez: ingeniero de sistemas, desarrollador full-stack senior y formador en inteligencia artificial. Evidencia de IA generativa y automatización aplicada al trabajo de oficina, trayectoria, proyectos y credenciales.",
  author: "Andrés David Ramírez Albarracín",
  displayName: "Andrés Ramírez",
  degree: "Ingeniero de Sistemas y Computación",
  roles: ["Desarrollador Full-Stack Senior", "Formador en Inteligencia Artificial y Transformación Digital"],
  location: "Bogotá D.C., Colombia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Año fijo: en componentes de servidor no se puede leer la fecha actual. */
  year: 2026,
  cv: "/cv/CV-Andres-Ramirez.pdf",
  contact: {
    phoneDisplay: "+57 319 286 6871",
    phoneHref: "tel:+573192866871",
    whatsappNumber: "573192866871",
    email: "andresramirez173@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/ing-andres-ramirez",
    linkedinLabel: "linkedin.com/in/ing-andres-ramirez",
  },
} as const;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject: string, body = ""): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.contact.email}?${params.join("&")}`;
}

export const defaultWhatsappMessage =
  "Hola Andrés, vi tu portafolio Evocenda y me gustaría conversar contigo.";

export const defaultMailSubject = "Contacto desde Evocenda";

/** Secciones de la home: cada una es un nodo de la senda. */
export const sections = [
  { id: "inicio", label: "Inicio", nodo: "00" },
  { id: "perfil", label: "Perfil", nodo: "01" },
  { id: "evidencia", label: "IA aplicada", nodo: "02" },
  { id: "docencia", label: "Docencia", nodo: "03" },
  { id: "senda", label: "Senda", nodo: "04" },
  { id: "proyectos", label: "Proyectos", nodo: "05" },
  { id: "stack", label: "Stack", nodo: "06" },
  { id: "credenciales", label: "Credenciales", nodo: "07" },
  { id: "contacto", label: "Contacto", nodo: "08" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Enlaces de la cabecera (sin inicio ni contacto, que tienen su propio control). */
export const navSections = sections.filter((s) => s.id !== "inicio" && s.id !== "contacto");
