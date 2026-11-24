import type { IconName } from "@/components/ui/icon";

/** Habilidades técnicas, con las mismas siete categorías de la hoja de vida. */
export interface Categoria {
  id: string;
  titulo: string;
  icon: IconName;
  habilidades: string[];
}

export interface Idioma {
  idioma: string;
  nivel: string;
  /** Posición en la escala MCER (1 = A1 … 6 = C2). `nativo` ocupa toda la escala. */
  escala: number;
  nativo?: boolean;
}

const categorias: Categoria[] = [
  {
    id: "ia",
    titulo: "Inteligencia Artificial",
    icon: "brain",
    habilidades: ["IA Generativa", "Agentes de IA", "Claude Code", "Skills, Harness y MCP", "Ingeniería de Prompts"],
  },
  {
    id: "automatizacion",
    titulo: "Automatización",
    icon: "workflow",
    habilidades: ["n8n", "Make", "Scripts en Python"],
  },
  {
    id: "front",
    titulo: "Front-End",
    icon: "palette",
    habilidades: ["Angular", "Next.js", "Astro", "Tailwind CSS", "Figma", "UI/UX"],
  },
  {
    id: "back",
    titulo: "Back-End",
    icon: "server",
    habilidades: ["Spring Boot", "Spring Cloud", "NestJS", "Python", "Apache Kafka"],
  },
  {
    id: "datos",
    titulo: "Datos y Analítica",
    icon: "database",
    habilidades: ["Oracle", "PostgreSQL", "MongoDB", "PL/SQL", "Power BI", "Procesos ETL"],
  },
  {
    id: "cloud",
    titulo: "Cloud y DevOps",
    icon: "cloud",
    habilidades: ["AWS", "Azure", "Terraform", "Docker", "GitHub", "GitHub Actions", "CI/CD"],
  },
  {
    id: "calidad",
    titulo: "Calidad y Gestión",
    icon: "flask",
    habilidades: ["Jest", "Playwright", "JUnit", "Scrum", "Jira", "Confluence"],
  },
];

const idiomas: Idioma[] = [
  { idioma: "Español", nivel: "Nativo", escala: 6, nativo: true },
  { idioma: "Inglés", nivel: "Intermedio alto · B2", escala: 4 },
  { idioma: "Italiano", nivel: "Intermedio · B1", escala: 3 },
];

export async function getStack(): Promise<{ categorias: Categoria[]; idiomas: Idioma[] }> {
  return { categorias, idiomas };
}
