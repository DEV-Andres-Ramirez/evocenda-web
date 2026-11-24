import type { IconName } from "@/components/ui/icon";

/**
 * Evidencia de IA generativa y automatización aplicada al trabajo de oficina.
 *
 * Regla de honestidad del contenido:
 *  - `kind: "realizado"` → proyecto que existe. Solo se describe lo que muestra
 *    la evidencia (captura) o lo que es verificable en el propio sitio.
 *  - `kind: "diseno"` → caso práctico diseñado como material de formación.
 *    Describe una arquitectura de referencia y habla de "resultado esperado".
 *  - No hay métricas inventadas (ni porcentajes ni horas ahorradas).
 */

export const tareas = {
  correo: { label: "Correo", icon: "mail" },
  documentos: { label: "Documentos", icon: "file-text" },
  "hojas-de-calculo": { label: "Hojas de cálculo", icon: "sheet" },
  presentaciones: { label: "Presentaciones", icon: "presentation" },
  reuniones: { label: "Reuniones", icon: "mic" },
  sintesis: { label: "Síntesis de información", icon: "newspaper" },
} as const satisfies Record<string, { label: string; icon: IconName }>;

export type TareaId = keyof typeof tareas;
export const tareaIds = Object.keys(tareas) as TareaId[];

export type CasoKind = "realizado" | "diseno";

export const kindLabel: Record<CasoKind, string> = {
  realizado: "Proyecto realizado",
  diseno: "Caso práctico diseñado",
};

export const notaDiseno =
  "Caso práctico diseñado como material de formación. Describe una arquitectura de referencia para enseñar y replicar; no corresponde a una implementación en producción.";

export interface FlowStep {
  id: string;
  titulo: string;
  /** Aplicación o tipo de módulo que ejecuta el paso. */
  app: string;
  detalle: string;
  icon: IconName;
  /** El paso lo ejecuta un modelo de IA. */
  ia?: boolean;
  /** El paso exige revisión o aprobación de una persona. */
  humano?: boolean;
  /** Posición opcional en el diagrama (unidades de rejilla). */
  x?: number;
  y?: number;
}

export interface Caso {
  slug: string;
  kind: CasoKind;
  titulo: string;
  tituloCorto: string;
  resumen: string;
  tareas: TareaId[];
  herramientas: string[];
  nivel: "Fundamentos" | "Intermedio" | "Avanzado";
  icon: IconName;
  problema: string[];
  flujo: FlowStep[];
  ia: { titulo: string; texto: string }[];
  controles: string[];
  resultado: string[];
  prompt?: { titulo: string; nota: string; texto: string };
  aprendizajes?: string[];
  captura?: { src: string; alt: string; width: number; height: number; pie: string };
}

const casos: Caso[] = [
  {
    slug: "filtro-inteligente-de-candidatos",
    kind: "realizado",
    titulo: "Filtro inteligente de candidatos para una convocatoria",
    tituloCorto: "Filtro inteligente de candidatos",
    resumen:
      "Automatización en Make que toma las hojas de vida que llegan por correo, las evalúa con IA frente al cargo al que se presenta cada persona y deja a todos los candidatos registrados y comparables en una hoja de cálculo.",
    tareas: ["correo", "documentos", "hojas-de-calculo"],
    herramientas: ["Make", "Gmail", "OpenAI · visión", "Google Sheets", "Google Drive"],
    nivel: "Avanzado",
    icon: "users",
    problema: [
      "En una convocatoria las hojas de vida llegan por correo, a destiempo y cada una con un formato distinto. Revisarlas una por una consume tiempo, retrasa la respuesta y hace difícil aplicar el mismo criterio a todas las personas.",
      "La automatización se encarga de la parte repetitiva: recibir, leer, evaluar según el cargo y registrar. El equipo evaluador recibe la información ya ordenada y comparable.",
    ],
    flujo: [
      {
        id: "recolectar",
        titulo: "Recolectar CV",
        app: "Gmail · Watch emails",
        detalle: "El escenario revisa el buzón de la convocatoria cada 15 minutos y toma los correos nuevos.",
        icon: "mail",
        x: 0,
        y: 0,
      },
      {
        id: "adjuntos",
        titulo: "Listar adjuntos",
        app: "Gmail · List email attachments",
        detalle: "Recorre los adjuntos de cada correo. Un filtro deja pasar únicamente los archivos PDF.",
        icon: "funnel",
        x: 0,
        y: 2,
      },
      {
        id: "convertir",
        titulo: "Convertir de PDF a imagen",
        app: "Convert from PDF into Images",
        detalle:
          "Convierte cada hoja de vida en imágenes para que el modelo de visión pueda leerla tal como fue diagramada.",
        icon: "image",
        x: 1.55,
        y: 2,
      },
      {
        id: "evaluar",
        titulo: "Evaluar CV",
        app: "OpenAI · Analyze images (Vision)",
        detalle: "El modelo analiza la hoja de vida frente al cargo al que se presenta la persona y emite su evaluación.",
        icon: "scan",
        ia: true,
        x: 2.3,
        y: 0.45,
      },
      {
        id: "extraer",
        titulo: "Extraer datos",
        app: "OpenAI · Analyze images (Vision)",
        detalle: "Un segundo paso de visión extrae los datos del candidato en un formato estructurado.",
        icon: "braces",
        ia: true,
        x: 3.65,
        y: 0.45,
      },
      {
        id: "validar",
        titulo: "Validar estructura",
        app: "Parse JSON",
        detalle:
          "Convierte la respuesta del modelo en campos y comprueba que tenga la estructura esperada antes de registrarla.",
        icon: "clipboard-check",
        x: 3.95,
        y: 2,
      },
      {
        id: "registrar",
        titulo: "Registrar participante",
        app: "Google Sheets · Add a row",
        detalle: "Agrega una fila por candidato en la hoja de la convocatoria.",
        icon: "sheet",
        x: 5.3,
        y: 2,
      },
      {
        id: "almacenar",
        titulo: "Almacenar CV",
        app: "Google Drive · Upload a file",
        detalle: "Guarda la hoja de vida original en una carpeta de Drive.",
        icon: "upload",
        x: 6.6,
        y: 2,
      },
    ],
    ia: [
      {
        titulo: "Lectura por visión",
        texto:
          "La hoja de vida se lee como imagen, así que el flujo no depende de que el PDF tenga texto seleccionable ni de una plantilla fija.",
      },
      {
        titulo: "Evaluación según el cargo",
        texto: "Cada candidato se evalúa frente al puesto al que se está presentando, con el mismo criterio para todos.",
      },
      {
        titulo: "Salida estructurada",
        texto:
          "La extracción se pide en JSON para poder validarla y convertirla en columnas de la hoja de cálculo.",
      },
    ],
    controles: [
      "Solo se procesan adjuntos en PDF; lo demás se descarta antes de llegar al modelo.",
      "La respuesta del modelo se valida como JSON antes de escribir en la hoja.",
      "La hoja de vida original se conserva en Drive, de modo que cualquier evaluación puede contrastarse con su fuente.",
      "La automatización ordena y hace comparable la información; la decisión sobre cada candidato sigue siendo del equipo evaluador.",
    ],
    resultado: [
      "Todos los candidatos quedan registrados en una sola hoja, con los mismos campos.",
      "Cada hoja de vida queda archivada junto a su registro.",
      "La lectura manual, CV por CV, se reemplaza por un flujo programado de ocho módulos.",
    ],
    captura: {
      src: "/evidencia/automatizacion-make.webp",
      alt: "Escenario de Make con ocho módulos conectados: recolectar CV, listar adjuntos, convertir de PDF a imagen, evaluar CV, extraer datos, validar estructura, registrar participante y almacenar CV.",
      width: 1763,
      height: 981,
      pie: "Captura del escenario en el editor de Make.",
    },
  },
  {
    slug: "evocenda-portafolio-con-agentes",
    kind: "realizado",
    titulo: "Evocenda: un portafolio construido con agentes de IA",
    tituloCorto: "Evocenda, hecho con agentes de IA",
    resumen:
      "Este sitio se diseñó y desarrolló con un flujo de trabajo asistido por agentes de IA (Claude Code) sobre Next.js 16: de una hoja de vida y un grupo de certificados a una aplicación web estática, accesible y con tema claro y oscuro.",
    tareas: ["documentos", "sintesis"],
    herramientas: ["Claude Code", "Next.js 16", "React 19", "Tailwind CSS 4", "TypeScript"],
    nivel: "Avanzado",
    icon: "bot",
    problema: [
      "Un portafolio profesional exige sintetizar años de trayectoria, decidir qué mostrar y construir un producto digital completo: contenido, diseño, código y verificación.",
      "En lugar de partir de una plantilla, dirigí a un agente de programación para convertir mis documentos en contenido estructurado y construir el sitio a la medida, revisando y aprobando cada decisión.",
    ],
    flujo: [
      {
        id: "insumos",
        titulo: "Insumos",
        app: "Hoja de vida y certificados",
        detalle: "La hoja de vida, los certificados y la captura de la automatización son la única fuente del contenido.",
        icon: "file-text",
      },
      {
        id: "plan",
        titulo: "Plan",
        app: "Claude Code · modo plan",
        detalle:
          "El agente explora el proyecto, lee la documentación de la versión instalada y propone un plan que reviso y apruebo antes de escribir código.",
        icon: "route",
        ia: true,
      },
      {
        id: "contenido",
        titulo: "Contenido tipado",
        app: "TypeScript",
        detalle: "La trayectoria se convierte en datos estructurados: hitos, casos, habilidades y credenciales.",
        icon: "braces",
        ia: true,
      },
      {
        id: "sistema",
        titulo: "Sistema visual",
        app: "Tokens, tipografía y logo",
        detalle: "Paleta lila neón con contraste verificado, tipografías, monograma AR y reglas de movimiento.",
        icon: "palette",
        ia: true,
      },
      {
        id: "construccion",
        titulo: "Construcción",
        app: "Next.js · React · Tailwind",
        detalle: "Secciones, páginas de caso, red neuronal en canvas y diagramas de flujo animados.",
        icon: "code",
        ia: true,
      },
      {
        id: "verificacion",
        titulo: "Verificación",
        app: "Lint, tipos, build y revisión visual",
        detalle:
          "Cada entrega pasa por análisis estático, compilación, revisión en navegador y una comprobación de privacidad.",
        icon: "shield",
        humano: true,
      },
      {
        id: "build",
        titulo: "Sitio estático",
        app: "next build",
        detalle: "Todas las páginas se generan como contenido estático, listas para publicarse.",
        icon: "zap",
      },
    ],
    ia: [
      {
        titulo: "Agente de programación",
        texto:
          "Claude Code explora el repositorio, planifica, escribe y verifica el código bajo mi dirección, con acceso controlado a herramientas.",
      },
      {
        titulo: "Subagentes de exploración",
        texto:
          "Varios subagentes revisan en paralelo la documentación de la versión instalada antes de escribir una sola línea, para no programar de memoria.",
      },
      {
        titulo: "Síntesis de documentos",
        texto:
          "La IA convierte la hoja de vida y los certificados en contenido estructurado, y yo decido qué se publica y cómo se dice.",
      },
    ],
    controles: [
      "Datos sensibles fuera del sitio: no se publican el número de cédula ni la fecha de nacimiento, y los certificados se muestran con ese dato oculto.",
      "Contenido trazable: todo sale de mi hoja de vida y de mis certificados; no hay cifras inventadas.",
      "Los casos que son diseños de formación están rotulados como tales, separados de los proyectos realizados.",
      "Plan aprobado antes de construir, y verificación automática en cada entrega.",
    ],
    resultado: [
      "Un sitio estático con tema claro y oscuro, navegable por teclado y con movimiento reducido cuando el sistema lo pide.",
      "Contenido separado del diseño en módulos tipados, listo para conectarse después a una base de datos.",
      "Una muestra directa de cómo trabajo con agentes: plan, ejecución y revisión.",
    ],
  },
  {
    slug: "triage-de-bandeja-de-entrada",
    kind: "diseno",
    titulo: "Triage de la bandeja de entrada con borradores listos para aprobar",
    tituloCorto: "Triage de la bandeja de entrada",
    resumen:
      "Un flujo que clasifica el correo entrante, identifica lo que hay que hacer y deja redactado un borrador de respuesta para que una persona lo revise y lo envíe.",
    tareas: ["correo"],
    herramientas: ["n8n", "Gmail u Outlook", "Claude", "Google Sheets"],
    nivel: "Intermedio",
    icon: "inbox",
    problema: [
      "Una bandeja compartida mezcla solicitudes de clientes, proveedores, notificaciones automáticas y correo sin importancia. Lo urgente se pierde entre lo irrelevante y las respuestas repetitivas consumen buena parte del día.",
      "El caso enseña a poner un modelo de lenguaje a ordenar y preparar, dejando siempre el envío en manos de una persona.",
    ],
    flujo: [
      {
        id: "nuevo",
        titulo: "Correo nuevo",
        app: "Gmail u Outlook · disparador",
        detalle: "El flujo se activa con cada mensaje que entra a la bandeja compartida.",
        icon: "mail",
      },
      {
        id: "limpiar",
        titulo: "Limpiar el mensaje",
        app: "n8n · nodo de código",
        detalle: "Quita firmas, avisos legales e hilos citados para enviar al modelo solo el contenido útil.",
        icon: "funnel",
      },
      {
        id: "clasificar",
        titulo: "Clasificar",
        app: "Claude · salida JSON",
        detalle: "Asigna una categoría de una lista cerrada, una urgencia y la acción que pide el remitente.",
        icon: "tags",
        ia: true,
      },
      {
        id: "enrutar",
        titulo: "Enrutar",
        app: "n8n · Switch",
        detalle: "Cada categoría sigue su propia rama: responder, escalar, archivar o ignorar.",
        icon: "split",
      },
      {
        id: "redactar",
        titulo: "Redactar borrador",
        app: "Claude · plantillas y tono",
        detalle: "Escribe la respuesta con las plantillas y el tono de la organización, sin prometer nada que no esté en ellas.",
        icon: "pen",
        ia: true,
      },
      {
        id: "borrador",
        titulo: "Guardar como borrador",
        app: "Gmail u Outlook · Create draft",
        detalle: "La respuesta queda en borradores y el correo se etiqueta. El flujo nunca envía por su cuenta.",
        icon: "file-pen",
        humano: true,
      },
      {
        id: "bitacora",
        titulo: "Registrar en bitácora",
        app: "Google Sheets · Add a row",
        detalle: "Guarda categoría, urgencia y acción para poder auditar y mejorar el prompt.",
        icon: "sheet",
      },
      {
        id: "resumen",
        titulo: "Resumen del día",
        app: "Claude · programado",
        detalle: "Al final de la jornada envía los pendientes agrupados por prioridad.",
        icon: "newspaper",
        ia: true,
      },
    ],
    ia: [
      {
        titulo: "Clasificación con categorías cerradas",
        texto: "El modelo elige entre opciones definidas por el equipo; no inventa etiquetas nuevas.",
      },
      {
        titulo: "Extracción de la acción",
        texto: "Identifica qué pide el remitente y si hay una fecha límite escrita en el mensaje.",
      },
      {
        titulo: "Redacción con contexto",
        texto: "Los borradores parten de plantillas aprobadas y respetan el tono de la organización.",
      },
    ],
    controles: [
      "Humano en el circuito: todo queda como borrador; nadie recibe una respuesta que una persona no haya revisado.",
      "Salida en JSON validada antes de enrutar; si falla, el correo va a revisión manual.",
      "Al modelo solo llega el texto del mensaje, sin adjuntos.",
      "La bitácora permite medir cuántas clasificaciones corrige el equipo y ajustar el prompt.",
    ],
    resultado: [
      "Una bandeja ordenada por categoría y urgencia.",
      "Respuestas frecuentes redactadas y listas para revisar.",
      "Un resumen diario con lo que quedó pendiente.",
    ],
    prompt: {
      titulo: "Prompt base de clasificación",
      nota: "Ejemplo de referencia para el taller. Las categorías se ajustan a cada organización.",
      texto: `Eres el asistente de la bandeja compartida de <área>.
Clasifica el correo en UNA sola categoría de esta lista:
cliente · proveedor · interno · notificación · descartable

Devuelve únicamente JSON con esta forma:
{
  "categoria": "",
  "urgencia": "alta | media | baja",
  "accion": "qué pide el remitente, en una frase",
  "fecha_limite": "AAAA-MM-DD o null"
}

Reglas:
- Usa solo información que esté en el correo. No inventes datos.
- Si dudas entre dos categorías, elige "interno" y urgencia "media".
- No redactes la respuesta en este paso.`,
    },
    aprendizajes: [
      "Disparadores, filtros y ramas condicionales en un flujo.",
      "Salidas estructuradas para que un modelo alimente pasos posteriores.",
      "Diseñar con una persona en el circuito y con registro de auditoría.",
    ],
  },
  {
    slug: "de-formulario-a-propuesta-comercial",
    kind: "diseno",
    titulo: "De un formulario a una propuesta comercial lista para revisar",
    tituloCorto: "De formulario a propuesta comercial",
    resumen:
      "A partir de las respuestas de un formulario, el flujo redacta la propuesta sobre la plantilla de la organización, toma precios y condiciones de una hoja de cálculo y la deja en PDF para aprobación.",
    tareas: ["documentos"],
    herramientas: ["Make", "Google Forms", "Claude", "Google Docs", "Google Sheets", "Gmail"],
    nivel: "Intermedio",
    icon: "file-output",
    problema: [
      "Preparar una propuesta suele significar copiar la anterior, cambiar nombres y cifras a mano y esperar que no se cuele un dato del cliente anterior. Es lento y propenso a errores.",
      "El caso separa lo que debe redactar un modelo (el texto a la medida) de lo que nunca debe decidir (precios, condiciones y cláusulas).",
    ],
    flujo: [
      {
        id: "formulario",
        titulo: "Respuesta del formulario",
        app: "Google Forms · disparador",
        detalle: "El equipo comercial registra la necesidad del cliente, el alcance y los plazos.",
        icon: "list-checks",
      },
      {
        id: "catalogo",
        titulo: "Consultar catálogo",
        app: "Google Sheets · Search rows",
        detalle: "Trae servicios, precios y condiciones vigentes desde la hoja oficial.",
        icon: "sheet",
      },
      {
        id: "redactar",
        titulo: "Redactar secciones",
        app: "Claude",
        detalle: "Escribe contexto, alcance, entregables y cronograma usando solo los datos del formulario y del catálogo.",
        icon: "pen",
        ia: true,
      },
      {
        id: "plantilla",
        titulo: "Completar plantilla",
        app: "Google Docs · Create from template",
        detalle: "Inserta cada sección en los marcadores de la plantilla corporativa, con sus cláusulas fijas.",
        icon: "template",
      },
      {
        id: "pdf",
        titulo: "Exportar a PDF",
        app: "Google Drive · Download as PDF",
        detalle: "Genera la versión para enviar y conserva el documento editable.",
        icon: "file-output",
      },
      {
        id: "aprobacion",
        titulo: "Aprobación interna",
        app: "Gmail · correo con enlace",
        detalle: "Quien responde por la cuenta revisa, ajusta y aprueba antes de que llegue al cliente.",
        icon: "file-check",
        humano: true,
      },
      {
        id: "registro",
        titulo: "Archivar y registrar",
        app: "Google Drive y Sheets",
        detalle: "La propuesta queda archivada y su estado se registra en el seguimiento comercial.",
        icon: "archive",
      },
    ],
    ia: [
      {
        titulo: "Redacción a partir de datos",
        texto: "El modelo convierte respuestas breves en un texto claro y coherente con el tono de la organización.",
      },
      {
        titulo: "Sin cálculos del modelo",
        texto: "Precios, descuentos y condiciones llegan de la hoja de cálculo y se insertan tal cual.",
      },
    ],
    controles: [
      "Las cifras y condiciones salen de una fuente oficial, nunca del modelo.",
      "Las cláusulas legales viven en la plantilla y no se reescriben.",
      "Ninguna propuesta sale sin la aprobación de una persona.",
      "Cada versión queda archivada con fecha y responsable.",
    ],
    resultado: [
      "Propuestas con la misma estructura y la misma imagen, sin importar quién las prepare.",
      "Menos errores de copia entre clientes.",
      "Trazabilidad de qué se envió, cuándo y quién lo aprobó.",
    ],
    prompt: {
      titulo: "Prompt base de redacción",
      nota: "Ejemplo de referencia para el taller.",
      texto: `Redacta las secciones "Contexto", "Alcance", "Entregables" y "Cronograma"
de una propuesta comercial.

Usa exclusivamente estos datos:
<respuestas_del_formulario>…</respuestas_del_formulario>
<servicios_del_catalogo>…</servicios_del_catalogo>

Reglas:
- No menciones precios, descuentos ni condiciones de pago.
- No prometas plazos distintos a los indicados.
- Si falta un dato, escribe [POR CONFIRMAR] en su lugar.
- Tono profesional y directo. Máximo 120 palabras por sección.`,
    },
    aprendizajes: [
      "Plantillas con marcadores y generación de documentos.",
      "Separar lo que redacta la IA de lo que proviene de fuentes oficiales.",
      "Flujos de aprobación antes de una comunicación externa.",
    ],
  },
  {
    slug: "analisis-de-respuestas-en-hoja-de-calculo",
    kind: "diseno",
    titulo: "Clasificar y analizar respuestas abiertas en una hoja de cálculo",
    tituloCorto: "Análisis de respuestas abiertas",
    resumen:
      "Convierte cientos de respuestas de texto libre (encuestas, PQRS, comentarios) en categorías, sentimiento y hallazgos, directamente sobre la hoja y con un tablero que se actualiza solo.",
    tareas: ["hojas-de-calculo"],
    herramientas: ["Google Sheets", "n8n", "Claude", "Power BI"],
    nivel: "Intermedio",
    icon: "sheet",
    problema: [
      "Las preguntas abiertas son las que más información traen y las que menos se analizan, porque leer y etiquetar fila por fila no escala.",
      "El caso enseña a usar un modelo como clasificador consistente sobre una hoja de cálculo, y a conectar el resultado con un tablero de analítica.",
    ],
    flujo: [
      {
        id: "lote",
        titulo: "Lote programado",
        app: "n8n · Schedule",
        detalle: "Cada cierto tiempo toma las filas nuevas que aún no tienen categoría.",
        icon: "calendar-clock",
      },
      {
        id: "preparar",
        titulo: "Preparar el lote",
        app: "n8n · nodo de código",
        detalle: "Agrupa las filas, elimina datos personales y conserva el identificador de cada respuesta.",
        icon: "lock",
      },
      {
        id: "clasificar",
        titulo: "Clasificar",
        app: "Claude · salida JSON",
        detalle: "Asigna tema, sentimiento y nivel de confianza a partir de una lista cerrada de categorías.",
        icon: "tags",
        ia: true,
      },
      {
        id: "escribir",
        titulo: "Escribir columnas",
        app: "Google Sheets · Update rows",
        detalle: "Agrega los resultados en columnas nuevas, sin tocar la respuesta original.",
        icon: "table",
      },
      {
        id: "criticos",
        titulo: "Detectar casos críticos",
        app: "n8n · filtro",
        detalle: "Aísla las respuestas negativas y urgentes para atención inmediata.",
        icon: "funnel",
      },
      {
        id: "alertar",
        titulo: "Alertar al responsable",
        app: "Correo",
        detalle: "Envía el caso con su contexto a quien debe atenderlo.",
        icon: "bell-ring",
        humano: true,
      },
      {
        id: "hallazgos",
        titulo: "Resumen de hallazgos",
        app: "Claude",
        detalle: "Redacta los hallazgos del periodo a partir de los conteos, no de las filas individuales.",
        icon: "lightbulb",
        ia: true,
      },
      {
        id: "tablero",
        titulo: "Tablero",
        app: "Power BI",
        detalle: "El tablero lee la hoja y muestra la evolución por tema y sentimiento.",
        icon: "chart",
      },
    ],
    ia: [
      {
        titulo: "Clasificador consistente",
        texto: "Con categorías cerradas y ejemplos, el modelo aplica el mismo criterio a todas las filas.",
      },
      {
        titulo: "Confianza declarada",
        texto: "Cada clasificación trae un nivel de confianza que decide qué filas revisa una persona.",
      },
      {
        titulo: "Hallazgos sobre agregados",
        texto: "El resumen se construye con conteos y tendencias, lo que reduce el riesgo de conclusiones inventadas.",
      },
    ],
    controles: [
      "Los datos personales se retiran antes de enviar el texto al modelo.",
      "La respuesta original nunca se sobrescribe: los resultados van en columnas nuevas.",
      "Las filas con baja confianza pasan a una muestra de revisión humana.",
      "La lista de categorías la define y la actualiza el equipo, no el modelo.",
    ],
    resultado: [
      "Respuestas abiertas convertidas en datos que se pueden filtrar, contar y graficar.",
      "Alertas tempranas sobre los casos que requieren atención.",
      "Un tablero que se actualiza a medida que llegan respuestas.",
    ],
    prompt: {
      titulo: "Prompt base de clasificación por lotes",
      nota: "Ejemplo de referencia para el taller.",
      texto: `Clasifica cada respuesta de la lista.

Categorías permitidas: atención · tiempos · precio · calidad · canales digitales · otro
Sentimiento: positivo · neutro · negativo

Devuelve un arreglo JSON, un objeto por respuesta:
{ "id": "", "categoria": "", "sentimiento": "", "confianza": 0.0 }

Reglas:
- Usa solo las categorías permitidas.
- "confianza" va de 0 a 1. Si la respuesta es ambigua, usa un valor menor a 0.6.
- No resumas ni corrijas el texto.`,
    },
    aprendizajes: [
      "Procesamiento por lotes sobre una hoja de cálculo.",
      "Clasificación con categorías cerradas y umbral de confianza.",
      "Conexión de una hoja con un tablero de analítica.",
    ],
  },
  {
    slug: "de-informe-a-presentacion-ejecutiva",
    kind: "diseno",
    titulo: "De un informe a una presentación ejecutiva con la plantilla corporativa",
    tituloCorto: "De informe a presentación ejecutiva",
    resumen:
      "Una skill de Claude que toma un informe extenso y produce una presentación ejecutiva con la plantilla de la organización: primero el guion, después las diapositivas.",
    tareas: ["presentaciones"],
    herramientas: ["Claude · skills", "Claude Code", "PowerPoint", "Plantilla corporativa"],
    nivel: "Avanzado",
    icon: "presentation",
    problema: [
      "Pasar de un informe de treinta páginas a diez diapositivas claras es un trabajo de síntesis y de diseño que suele hacerse a última hora, copiando párrafos enteros en cada lámina.",
      "El caso enseña a empaquetar ese proceso en una skill reutilizable: instrucciones, plantilla y pasos de verificación que el agente sigue siempre igual.",
    ],
    flujo: [
      {
        id: "informe",
        titulo: "Informe de entrada",
        app: "PDF o Word",
        detalle: "El documento fuente, con sus cifras y conclusiones.",
        icon: "file-text",
      },
      {
        id: "mensajes",
        titulo: "Extraer mensajes clave",
        app: "Claude",
        detalle: "Identifica las conclusiones y las cifras que las sostienen, con la página de origen.",
        icon: "file-search",
        ia: true,
      },
      {
        id: "guion",
        titulo: "Proponer el guion",
        app: "Claude",
        detalle: "Arma la historia: una idea por diapositiva y un título que es la conclusión.",
        icon: "list-checks",
        ia: true,
      },
      {
        id: "aprobar",
        titulo: "Aprobar el guion",
        app: "Revisión humana",
        detalle: "Quien presenta ajusta el orden y el énfasis antes de diseñar nada.",
        icon: "file-check",
        humano: true,
      },
      {
        id: "generar",
        titulo: "Generar diapositivas",
        app: "Skill de presentaciones",
        detalle: "Construye el archivo sobre la plantilla corporativa: colores, tipografías y diseños ya definidos.",
        icon: "presentation",
        ia: true,
      },
      {
        id: "revisar",
        titulo: "Revisión visual",
        app: "Agente · render y corrección",
        detalle: "El agente renderiza cada lámina, detecta textos desbordados o superpuestos y los corrige.",
        icon: "eye",
        ia: true,
      },
      {
        id: "entrega",
        titulo: "Entrega editable",
        app: "Archivo .pptx",
        detalle: "La presentación queda lista para ajustes finales en PowerPoint.",
        icon: "download",
      },
    ],
    ia: [
      {
        titulo: "Una skill, no un prompt suelto",
        texto:
          "La skill reúne instrucciones, plantilla y scripts. El agente la carga cuando la tarea lo pide y repite el mismo proceso cada vez.",
      },
      {
        titulo: "Harness con permisos acotados",
        texto: "El agente solo puede leer el informe y escribir en la carpeta de salida; nada más.",
      },
      {
        titulo: "Verificación por render",
        texto: "El agente mira el resultado como imagen y corrige lo que no se ve bien, igual que lo haría una persona.",
      },
    ],
    controles: [
      "Toda cifra de una diapositiva cita la página del informe de donde salió.",
      "El guion se aprueba antes de generar el diseño.",
      "La plantilla corporativa es fija: el agente no cambia colores ni tipografías.",
      "El archivo final es editable y la última palabra la tiene quien presenta.",
    ],
    resultado: [
      "Una presentación con una idea por lámina y la imagen de la organización.",
      "Un proceso repetible que cualquier persona del equipo puede lanzar.",
      "Cifras trazables hasta el documento de origen.",
    ],
    prompt: {
      titulo: "Fragmento de la skill",
      nota: "Ejemplo de referencia: así se describe una skill para que el agente sepa cuándo y cómo usarla.",
      texto: `---
name: presentacion-ejecutiva
description: Convierte un informe en una presentación ejecutiva con la
  plantilla corporativa. Úsala cuando pidan "resumir en diapositivas".
---

1. Lee el informe completo antes de proponer nada.
2. Entrega primero el guion (máx. 10 láminas, una idea por lámina)
   y espera aprobación.
3. Cada cifra lleva su página de origen entre paréntesis.
4. Genera el archivo con plantilla/corporativa.pptx. No cambies el tema.
5. Renderiza cada lámina y corrige textos que se desborden.`,
    },
    aprendizajes: [
      "Qué es una skill y cómo se estructura.",
      "Configurar el harness de un agente: contexto, herramientas y permisos.",
      "Separar la síntesis (guion) de la producción (diapositivas).",
    ],
  },
  {
    slug: "de-la-reunion-al-acta-con-compromisos",
    kind: "diseno",
    titulo: "De la reunión al acta con compromisos, responsables y seguimiento",
    tituloCorto: "De la reunión al acta",
    resumen:
      "Toma la transcripción de una reunión y produce el acta con decisiones y compromisos, crea las tareas en el gestor del equipo y envía el seguimiento, con validación del organizador.",
    tareas: ["reuniones"],
    herramientas: ["Google Meet o Teams", "n8n", "Claude", "Google Docs", "Jira"],
    nivel: "Intermedio",
    icon: "mic",
    problema: [
      "Después de una reunión, lo acordado vive en la memoria de quienes asistieron. Sin acta, los compromisos se diluyen; con acta manual, alguien pierde una hora redactándola.",
      "El caso enseña a convertir una transcripción en acciones concretas sin perder el control sobre lo que se registra.",
    ],
    flujo: [
      {
        id: "transcripcion",
        titulo: "Transcripción disponible",
        app: "Google Meet o Teams",
        detalle: "El flujo se activa cuando la transcripción llega a la carpeta de reuniones.",
        icon: "mic",
      },
      {
        id: "limpiar",
        titulo: "Limpiar y segmentar",
        app: "n8n · nodo de código",
        detalle: "Une intervenciones cortadas, identifica a quien habla y divide el texto por temas.",
        icon: "funnel",
      },
      {
        id: "extraer",
        titulo: "Extraer acuerdos",
        app: "Claude · salida JSON",
        detalle: "Lista decisiones, compromisos, responsables y fechas tal como se dijeron.",
        icon: "braces",
        ia: true,
      },
      {
        id: "acta",
        titulo: "Redactar el acta",
        app: "Google Docs · plantilla",
        detalle: "Completa la plantilla de actas del equipo con asistentes, temas, decisiones y pendientes.",
        icon: "file-text",
        ia: true,
      },
      {
        id: "validar",
        titulo: "Validación del organizador",
        app: "Revisión humana",
        detalle: "Quien convocó la reunión corrige y aprueba el acta antes de que circule.",
        icon: "file-check",
        humano: true,
      },
      {
        id: "tareas",
        titulo: "Crear tareas",
        app: "Jira · Create issue",
        detalle: "Cada compromiso aprobado se convierte en una tarea con responsable y fecha.",
        icon: "list-checks",
      },
      {
        id: "seguimiento",
        titulo: "Enviar seguimiento",
        app: "Correo",
        detalle: "Los asistentes reciben el acta y sus compromisos; los pendientes generan recordatorio.",
        icon: "send",
      },
    ],
    ia: [
      {
        titulo: "De conversación a estructura",
        texto: "El modelo separa lo que se decidió de lo que solo se comentó.",
      },
      {
        titulo: "Compromisos con dueño",
        texto: "Un compromiso solo se registra con responsable si alguien lo asumió de forma explícita.",
      },
    ],
    controles: [
      "Los asistentes saben que la reunión se transcribe y dan su consentimiento.",
      "Si no hay responsable o fecha explícitos, el campo queda como \"por asignar\"; el modelo no los supone.",
      "Nada se convierte en tarea sin la aprobación del organizador.",
      "Las transcripciones tienen un periodo de retención definido y se eliminan al cumplirlo.",
    ],
    resultado: [
      "Acta disponible poco después de terminar la reunión.",
      "Compromisos convertidos en tareas con responsable y fecha.",
      "Seguimiento automático de lo pendiente.",
    ],
    prompt: {
      titulo: "Prompt base de extracción",
      nota: "Ejemplo de referencia para el taller.",
      texto: `A partir de la transcripción, devuelve JSON con:
{
  "decisiones": [""],
  "compromisos": [
    { "tarea": "", "responsable": "", "fecha": "AAAA-MM-DD o null" }
  ],
  "temas_abiertos": [""]
}

Reglas:
- Registra un responsable solo si la persona aceptó la tarea de forma explícita.
  Si no, escribe "por asignar".
- No conviertas opiniones en decisiones.
- Usa las palabras de los participantes; no agregues compromisos nuevos.`,
    },
    aprendizajes: [
      "Trabajar con transcripciones largas y segmentarlas.",
      "Extracción estructurada con reglas para no suponer datos.",
      "Integrar un flujo con un gestor de tareas.",
    ],
  },
  {
    slug: "boletin-ejecutivo-semanal",
    kind: "diseno",
    titulo: "Boletín ejecutivo semanal: síntesis de informes y fuentes",
    tituloCorto: "Boletín ejecutivo semanal",
    resumen:
      "Cada semana reúne informes internos y fuentes externas, resume cada documento con su cita y arma un boletín breve: qué pasó, por qué importa y qué conviene hacer.",
    tareas: ["sintesis"],
    herramientas: ["n8n", "Google Drive", "RSS", "Claude", "Correo"],
    nivel: "Fundamentos",
    icon: "newspaper",
    problema: [
      "La información relevante para una gerencia está repartida en informes, boletines del sector y correos largos que nadie alcanza a leer completos.",
      "El caso enseña a sintetizar muchas fuentes en un formato corto y accionable, sin perder el rastro de dónde salió cada afirmación.",
    ],
    flujo: [
      {
        id: "programar",
        titulo: "Programación semanal",
        app: "n8n · Schedule",
        detalle: "El flujo corre un día fijo, antes del comité directivo.",
        icon: "calendar-clock",
      },
      {
        id: "reunir",
        titulo: "Reunir fuentes",
        app: "Google Drive y RSS",
        detalle: "Recoge los informes nuevos de la carpeta compartida y las publicaciones de las fuentes definidas.",
        icon: "rss",
      },
      {
        id: "resumir",
        titulo: "Resumir cada fuente",
        app: "Claude",
        detalle: "Tres puntos por documento, cada uno con la cita textual que lo sostiene.",
        icon: "file-search",
        ia: true,
      },
      {
        id: "agrupar",
        titulo: "Agrupar por tema",
        app: "Claude",
        detalle: "Reúne lo que trata del mismo asunto y elimina repeticiones entre fuentes.",
        icon: "layers",
        ia: true,
      },
      {
        id: "redactar",
        titulo: "Redactar el boletín",
        app: "Claude",
        detalle: "Para cada tema: qué pasó, por qué importa y qué conviene hacer, con enlace a la fuente.",
        icon: "pen",
        ia: true,
      },
      {
        id: "editar",
        titulo: "Revisión editorial",
        app: "Revisión humana",
        detalle: "Una persona valida el enfoque y los enlaces antes del envío.",
        icon: "file-check",
        humano: true,
      },
      {
        id: "enviar",
        titulo: "Enviar a la lista",
        app: "Correo",
        detalle: "El boletín llega a la lista directiva en un formato que se lee en dos minutos.",
        icon: "mails",
      },
    ],
    ia: [
      {
        titulo: "Resumen con evidencia",
        texto: "Cada punto del resumen va acompañado de la cita que lo respalda.",
      },
      {
        titulo: "Síntesis entre fuentes",
        texto: "El modelo detecta cuándo dos documentos hablan de lo mismo y los integra.",
      },
      {
        titulo: "Formato para decidir",
        texto: "La estructura fija obliga a pasar del dato a la implicación y a la acción.",
      },
    ],
    controles: [
      "Toda afirmación del boletín enlaza con su fuente.",
      "El modelo trabaja solo con los documentos reunidos; no agrega información externa.",
      "Hay revisión editorial antes de cada envío.",
      "Las fuentes las define el equipo y quedan registradas en cada edición.",
    ],
    resultado: [
      "Un boletín breve y periódico, con enlaces a las fuentes.",
      "Menos tiempo dedicado a leer para enterarse y más a decidir.",
      "Un archivo de ediciones que se puede consultar después.",
    ],
    prompt: {
      titulo: "Prompt base de resumen con cita",
      nota: "Ejemplo de referencia para el taller.",
      texto: `Resume el documento en un máximo de 3 puntos.

Para cada punto entrega:
- "idea": una frase.
- "cita": el fragmento textual del documento que la respalda.
- "pagina": número de página o sección.

Reglas:
- Si no encuentras una cita que respalde una idea, no la incluyas.
- No agregues información que no esté en el documento.
- Escribe para una persona directiva: sin tecnicismos innecesarios.`,
    },
    aprendizajes: [
      "Flujos programados y recolección de varias fuentes.",
      "Resumir con cita para reducir afirmaciones sin respaldo.",
      "Encadenar pasos de un modelo: resumir, agrupar y redactar.",
    ],
  },
];

export async function getCasos(): Promise<Caso[]> {
  return casos;
}

export async function getCaso(slug: string): Promise<Caso | undefined> {
  return casos.find((caso) => caso.slug === slug);
}

export async function getCasoSlugs(): Promise<string[]> {
  return casos.map((caso) => caso.slug);
}

/** Tipos de evidencia que pide el requisito, enlazados a lo que hay en el sitio. */
export interface TipoEvidencia {
  id: string;
  titulo: string;
  descripcion: string;
  icon: IconName;
  enlaces: { label: string; href: string }[];
}

export async function getMatrizEvidencia(): Promise<TipoEvidencia[]> {
  const disenos = casos.filter((caso) => caso.kind === "diseno");

  return [
    {
      id: "proyecto",
      titulo: "Proyecto realizado",
      descripcion: "Automatización construida en Make, con la captura del escenario.",
      icon: "workflow",
      enlaces: [{ label: casos[0].tituloCorto, href: `/evidencia/${casos[0].slug}` }],
    },
    {
      id: "material",
      titulo: "Material de curso diseñado",
      descripcion: `${disenos.length} casos prácticos, uno por cada tarea de oficina.`,
      icon: "book-open",
      enlaces: [{ label: "Ver los casos prácticos", href: "/#casos" }],
    },
    {
      id: "certificacion",
      titulo: "Certificación",
      descripcion: "Formación certificada en IA generativa y experiencia en formación en IA.",
      icon: "badge-check",
      enlaces: [
        { label: "Diplomado GEN-AI · 130 h", href: "/#certificados" },
        { label: "Certificado de experiencia", href: "/#certificados" },
      ],
    },
    {
      id: "portafolio",
      titulo: "Portafolio",
      descripcion: "Este sitio, construido con agentes de IA.",
      icon: "sparkles",
      enlaces: [{ label: casos[1].tituloCorto, href: `/evidencia/${casos[1].slug}` }],
    },
  ];
}
