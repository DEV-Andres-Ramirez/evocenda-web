import type { IconName } from "@/components/ui/icon";

export interface Capa {
  id: string;
  numero: string;
  titulo: string;
  texto: string;
  icon: IconName;
  herramientas: string[];
}

export interface DatoHero {
  etiqueta: string;
  valor: string;
  detalle: string;
}

const perfil = {
  titular: "Ingeniería, IA y formación en una misma ruta.",
  parrafos: [
    "Ingeniero de Sistemas y Computación y Desarrollador Full-Stack Senior con experiencia integral en el ciclo completo de desarrollo de software, desde la concepción arquitectónica hasta la implementación y el despliegue. Mi expertise se centra en crear soluciones robustas y escalables, y en potenciarlas con **inteligencia artificial** y **analítica**: IA generativa, agentes, automatización de procesos y análisis de datos con herramientas como Claude Code, n8n, Make y Power BI.",
    "Complemento mi perfil técnico con experiencia como **docente de Inteligencia Artificial y tecnología aplicada a los negocios**, orientando a las empresas en su **transformación digital**, la automatización de procesos y la adopción de **herramientas digitales de productividad**. Combino una base técnica profunda con pensamiento crítico, comunicación asertiva y una comprobada capacidad para colaborar en equipos multidisciplinarios.",
  ],
  capas: [
    {
      id: "ia",
      numero: "01",
      titulo: "Inteligencia Artificial",
      texto:
        "IA generativa y agentes aplicados al software y a los negocios: Claude Code (skills, harness, subagentes y MCP), modelos de lenguaje e ingeniería de prompts.",
      icon: "brain",
      herramientas: ["Claude Code", "Skills y MCP", "Agentes de IA", "Ingeniería de prompts"],
    },
    {
      id: "transformacion",
      numero: "02",
      titulo: "Transformación Digital",
      texto:
        "Modernización de aplicaciones empresariales críticas, automatización de procesos con n8n y Make, y formación de empresas para adoptar la tecnología.",
      icon: "workflow",
      herramientas: ["n8n", "Make", "Modernización de aplicaciones", "Formación empresarial"],
    },
    {
      id: "analitica",
      numero: "03",
      titulo: "Analítica",
      texto:
        "Dashboards ejecutivos en Power BI, procesos ETL y reportes automatizados con Python, y consultas avanzadas en Oracle (PL/SQL) y PostgreSQL para la toma de decisiones.",
      icon: "chart",
      herramientas: ["Power BI", "Python", "PL/SQL", "PostgreSQL"],
    },
    {
      id: "productividad",
      numero: "04",
      titulo: "Herramientas Digitales de Productividad",
      texto:
        "Asistentes y agentes de IA, automatización low-code/no-code, y herramientas de gestión y colaboración como Jira, Confluence, Azure Boards y Figma.",
      icon: "zap",
      herramientas: ["Jira", "Confluence", "Azure Boards", "Figma"],
    },
  ] satisfies Capa[],
  datos: [
    { etiqueta: "Rol actual", valor: "Full-Stack Senior", detalle: "LinkTic · desde febrero de 2026" },
    { etiqueta: "Docencia 2026", valor: "4 ciclos", detalle: "IA y tecnología para empresas · Cafam" },
    { etiqueta: "Formación GEN-AI", valor: "130 h", detalle: "Diplomado internacional certificado" },
    { etiqueta: "Base", valor: "Bogotá D.C.", detalle: "Colombia" },
  ] satisfies DatoHero[],
};

export type Perfil = typeof perfil;

export async function getPerfil(): Promise<Perfil> {
  return perfil;
}
