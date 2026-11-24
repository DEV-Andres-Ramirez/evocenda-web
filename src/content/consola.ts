/**
 * Preguntas frecuentes de la consola (⌘K).
 * Son respuestas preparadas a partir de la hoja de vida: no hay un modelo
 * respondiendo en vivo, y la interfaz lo dice de forma explícita.
 */
export interface Pregunta {
  id: string;
  pregunta: string;
  respuesta: string;
  destino: { label: string; href: string };
}

const preguntas: Pregunta[] = [
  {
    id: "evidencia",
    pregunta: "¿Qué evidencia tienes de IA aplicada al trabajo de oficina?",
    respuesta:
      "Una automatización real en Make que recibe hojas de vida por correo, las evalúa con IA según el cargo y registra a cada candidato en una hoja de cálculo. Además, este portafolio, construido con agentes de IA; seis casos prácticos diseñados como material de formación (correo, documentos, hojas de cálculo, presentaciones, reuniones y síntesis de información) y un diplomado de 130 horas en IA generativa.",
    destino: { label: "Ver la evidencia", href: "/#evidencia" },
  },
  {
    id: "docencia",
    pregunta: "¿Qué experiencia tienes enseñando IA?",
    respuesta:
      "En 2026 dicté clases de Inteligencia Artificial y tecnología aplicada a los negocios por medio de Cafam, en junio, julio, septiembre y octubre, con espacios prácticos y charlas para empresas. Entre 2025 y 2026 me desempeñé como profesional especializado en Procesos Sostenibles S.A.S., en procesos de formación y consolidación de habilidades en IA.",
    destino: { label: "Ver docencia", href: "/#docencia" },
  },
  {
    id: "actual",
    pregunta: "¿En qué trabajas actualmente?",
    respuesta:
      "Soy Desarrollador Full-Stack Senior en LinkTic, en Bogotá, desde febrero de 2026. Desarrollo con Next.js y NestJS, trabajo con agentes de IA (Claude Code como herramienta principal) y construyo automatizaciones con n8n y Make.",
    destino: { label: "Recorrer la senda", href: "/#senda" },
  },
  {
    id: "herramientas",
    pregunta: "¿Qué herramientas de IA y automatización manejas?",
    respuesta:
      "n8n y Make para automatizar procesos; Claude Code con skills, subagentes, integraciones MCP y configuración del harness; ingeniería de prompts y de contexto; y Python, PL/SQL y Power BI para datos y analítica.",
    destino: { label: "Ver el stack", href: "/#stack" },
  },
  {
    id: "formacion",
    pregunta: "¿Cuál es tu formación?",
    respuesta:
      "Ingeniero de Sistemas y Computación de la UPTC (2025), con nota meritoria en la opción de grado. Especialización en Ingeniería de Software y Aplicaciones Multiplataforma del Instituto Europeo de Posgrado, culminada en octubre de 2026. Y Diplomado Internacional GEN-AI para la Gestión Empresarial, de 130 horas, también en 2026.",
    destino: { label: "Ver credenciales", href: "/#credenciales" },
  },
  {
    id: "contacto",
    pregunta: "¿Cómo te contacto?",
    respuesta:
      "Por WhatsApp o teléfono al +57 319 286 6871, por correo a andresramirez173@gmail.com o por LinkedIn. En la sección de contacto puedes escribir tu mensaje y abrirlo ya redactado en el canal que prefieras.",
    destino: { label: "Ir a contacto", href: "/#contacto" },
  },
];

export async function getPreguntas(): Promise<Pregunta[]> {
  return preguntas;
}
