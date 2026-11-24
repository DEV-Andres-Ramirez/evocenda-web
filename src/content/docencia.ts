import type { IconName } from "@/components/ui/icon";

export interface Eje {
  titulo: string;
  texto: string;
  icon: IconName;
}

const docencia = {
  titular: "Enseño a las empresas a usar la tecnología como herramienta de avance.",
  entrada:
    "Llevo la inteligencia artificial y la automatización a un lenguaje claro y aplicable: clases, espacios prácticos y charlas en los que las organizaciones aprenden haciendo.",
  cafam: {
    organizacion: "Cafam",
    rol: "Docente de Inteligencia Artificial y Tecnología Aplicada a los Negocios",
    lugar: "Bogotá D.C., Colombia",
    anio: 2026,
    /** Meses dictados (1 = enero). */
    meses: [6, 7, 9, 10],
    periodo: "Junio, julio, septiembre y octubre de 2026",
    puntos: [
      "Dicté clases de **Inteligencia Artificial y tecnología aplicada a los negocios** para empresas, en diferentes periodos de 2026.",
      "Facilité **espacios prácticos** en los que las empresas aprendieron a utilizar la tecnología y la IA como herramientas de avance para sus negocios.",
      "Enseñé a las organizaciones a **automatizar procesos** para ser más óptimas y reducir tareas manuales y repetitivas.",
      "Apoyé **charlas** sobre IA y tecnología para empresas, llevando conceptos técnicos a un lenguaje claro y aplicable para públicos no técnicos.",
    ],
  },
  procesos: {
    organizacion: "Procesos Sostenibles S.A.S.",
    rol: "Profesional Especializado · Transformación, Formación e Inteligencia Artificial",
    lugar: "La Ceja, Colombia",
    periodo: "2025 – 2026",
    puntos: [
      "Me desempeñé como profesional especializado en **procesos de transformación, desarrollo y orientación de la formación**, en una firma especializada en procesos de innovación y desarrollo.",
      "Orienté procesos formativos enfocados en la **consolidación de habilidades en inteligencia artificial**.",
      "Contribuí a la consolidación y gestión de **proyectos empresariales**, así como al desarrollo del talento humano.",
    ],
  },
  ejes: [
    {
      titulo: "IA aplicada a los negocios",
      texto: "Qué puede hacer hoy la inteligencia artificial por una empresa y cómo llevarla a casos de uso reales.",
      icon: "brain",
    },
    {
      titulo: "Tecnología como herramienta de avance",
      texto: "Usar la tecnología para que el negocio avance, no como un fin en sí misma.",
      icon: "target",
    },
    {
      titulo: "Automatización de procesos",
      texto: "Identificar tareas manuales y repetitivas y convertirlas en flujos que corren solos.",
      icon: "workflow",
    },
    {
      titulo: "Aprender haciendo",
      texto: "Clases, espacios prácticos y charlas con conceptos técnicos en lenguaje claro para públicos no técnicos.",
      icon: "users",
    },
  ] satisfies Eje[],
  /** Formación de usuarios dentro de proyectos de software (hoja de vida). */
  capacitaciones: [
    {
      organizacion: "SURA",
      texto: "Transferencia de conocimiento al equipo y sesiones de capacitación para usuarios finales.",
    },
    {
      organizacion: "Diaz Naturals",
      texto: "Documentación técnica, manual de usuario y sesiones de capacitación para el personal.",
    },
  ],
};

export type Docencia = typeof docencia;

export async function getDocencia(): Promise<Docencia> {
  return docencia;
}
