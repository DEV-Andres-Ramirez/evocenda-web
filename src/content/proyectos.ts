/**
 * Proyectos de software, contados como reto → solución → stack.
 * No se muestran capturas de aplicaciones corporativas: cada proyecto se
 * explica con un diagrama de su arquitectura.
 */
export interface DiagramaNodo {
  id: string;
  label: string;
  sub?: string;
  /** Columna y fila en la rejilla del diagrama (admite medios). */
  col: number;
  row: number;
  tono?: "base" | "neon" | "signal" | "muted";
}

export interface Diagrama {
  nodos: DiagramaNodo[];
  enlaces: [string, string][];
  descripcion: string;
}

export interface Proyecto {
  id: string;
  contexto: string;
  titulo: string;
  reto: string;
  solucion: string;
  puntos: string[];
  stack: string[];
  diagrama: Diagrama;
  enlace?: { label: string; href: string };
}

const proyectos: Proyecto[] = [
  {
    id: "sura",
    contexto: "SURA · 2024 – 2025",
    titulo: "Modernización de dos aplicaciones empresariales críticas",
    reto: "Migrar por completo dos aplicaciones críticas que vivían en un monolito en AngularJS.",
    solucion:
      "Arquitectura de microservicios con Angular y Spring Boot en repositorios independientes, APIs RESTful sobre Oracle, suites de pruebas de extremo a extremo y pipelines de CI/CD con controles SOX.",
    puntos: [
      "Rediseño completo de la interfaz (UI/UX), alineado con la identidad corporativa.",
      "Pruebas unitarias, funcionales y end-to-end, más seguridad estática y dinámica.",
      "Liberación en entornos de desarrollo, laboratorio y producción.",
    ],
    stack: ["Angular", "Spring Boot", "Oracle", "PL/SQL", "Jest", "JUnit", "Playwright", "Azure Pipelines", "Tailwind CSS"],
    diagrama: {
      descripcion:
        "Un monolito en AngularJS se separa en un Front-End Angular y APIs en Spring Boot sobre Oracle, con despliegue por Azure Pipelines.",
      nodos: [
        { id: "mono", label: "Monolito", sub: "AngularJS", col: 0, row: 0.5, tono: "muted" },
        { id: "front", label: "Angular", sub: "Front-End", col: 1, row: 0, tono: "neon" },
        { id: "api", label: "Spring Boot", sub: "APIs REST", col: 1, row: 1, tono: "neon" },
        { id: "ci", label: "Azure Pipelines", sub: "dev · lab · prod", col: 2, row: 0, tono: "signal" },
        { id: "db", label: "Oracle", sub: "PL/SQL", col: 2, row: 1 },
      ],
      enlaces: [
        ["mono", "front"],
        ["mono", "api"],
        ["front", "api"],
        ["front", "ci"],
        ["api", "db"],
      ],
    },
  },
  {
    id: "diaz-naturals",
    contexto: "Diaz Naturals · 2023",
    titulo: "Plataforma interna de inventario y pedidos",
    reto: "Gestionar inventario, usuarios y la trazabilidad completa de los pedidos en una sola aplicación web.",
    solucion:
      "Back-End en Spring Boot con PostgreSQL, interfaz en Angular con control de acceso por roles, mensajería asíncrona con Apache Kafka e infraestructura como código en AWS.",
    puntos: [
      "Lideré al equipo técnico y el ciclo completo, de la concepción al despliegue.",
      "Infraestructura con Terraform, contenedores Docker y CI/CD en GitHub Actions.",
      "Entrega con documentación técnica, manual de usuario y capacitación del personal.",
    ],
    stack: ["Spring Boot", "PostgreSQL", "Angular", "Apache Kafka", "Terraform", "AWS", "Docker", "GitHub Actions", "Vercel"],
    diagrama: {
      descripcion:
        "Interfaz Angular en Vercel que consume una API Spring Boot en AWS, con PostgreSQL, eventos en Apache Kafka e infraestructura definida con Terraform.",
      nodos: [
        { id: "front", label: "Angular", sub: "Vercel", col: 0, row: 0, tono: "neon" },
        { id: "api", label: "Spring Boot", sub: "API REST · AWS", col: 1, row: 0, tono: "neon" },
        { id: "db", label: "PostgreSQL", sub: "Inventario y pedidos", col: 2, row: 0 },
        { id: "kafka", label: "Apache Kafka", sub: "Eventos del negocio", col: 1, row: 1, tono: "signal" },
        { id: "infra", label: "Terraform · Docker", sub: "GitHub Actions", col: 2, row: 1, tono: "muted" },
      ],
      enlaces: [
        ["front", "api"],
        ["api", "db"],
        ["api", "kafka"],
        ["infra", "api"],
      ],
    },
  },
  {
    id: "linktic",
    contexto: "LinkTic · 2026 – actualidad",
    titulo: "Desarrollo de software asistido por agentes de IA",
    reto: "Integrar la IA en los productos y en el ciclo de desarrollo, sin sacrificar la calidad ni la revisión técnica del código.",
    solucion:
      "Flujo de trabajo con Claude Code como herramienta principal: skills, subagentes e integraciones MCP, con el harness configurado (contexto, herramientas, permisos y hooks) para obtener resultados consistentes, seguros y reutilizables.",
    puntos: [
      "Aplicaciones empresariales de extremo a extremo con Next.js y NestJS.",
      "Automatizaciones con n8n y Make que conectan APIs, servicios y modelos de IA.",
      "Ingeniería de prompts y de contexto para casos de uso reales del negocio.",
    ],
    stack: ["Next.js", "NestJS", "Claude Code", "Skills", "MCP", "n8n", "Make"],
    diagrama: {
      descripcion:
        "Claude Code, con skills, subagentes, MCP y un harness configurado, apoya el desarrollo de aplicaciones Next.js y NestJS que se integran con automatizaciones en n8n y Make.",
      nodos: [
        { id: "agente", label: "Claude Code", sub: "Agente de desarrollo", col: 0, row: 0.5, tono: "neon" },
        { id: "skills", label: "Skills · MCP", sub: "Subagentes", col: 1, row: 0, tono: "signal" },
        { id: "harness", label: "Harness", sub: "Contexto · permisos · hooks", col: 1, row: 1, tono: "signal" },
        { id: "apps", label: "Next.js · NestJS", sub: "Aplicaciones", col: 2, row: 0, tono: "neon" },
        { id: "flujos", label: "n8n · Make", sub: "Automatizaciones", col: 2, row: 1 },
      ],
      enlaces: [
        ["agente", "skills"],
        ["agente", "harness"],
        ["skills", "apps"],
        ["harness", "apps"],
        ["apps", "flujos"],
      ],
    },
  },
  {
    id: "yacarsu",
    contexto: "YACARSU · 2018 – 2020",
    titulo: "Analítica y automatización de reportes",
    reto: "Convertir los datos de una aplicación crítica en información para decidir, con menos trabajo manual.",
    solucion:
      "Scripts en Python para automatizar procesos ETL y reportes de alta complejidad, y dashboards ejecutivos e interactivos en Power BI sobre PostgreSQL.",
    puntos: [
      "Requisitos de negocio convertidos en visualizaciones para decisiones estratégicas.",
      "Consultas complejas, mantenimiento e integridad de los datos en PostgreSQL.",
      "Procesos de TI documentados en Confluence y seguimiento en Jira.",
    ],
    stack: ["Python", "Procesos ETL", "Power BI", "PostgreSQL", "Spring Boot"],
    diagrama: {
      descripcion:
        "Los datos en PostgreSQL pasan por procesos ETL en Python y alimentan dashboards en Power BI y reportes automáticos.",
      nodos: [
        { id: "db", label: "PostgreSQL", sub: "Datos del negocio", col: 0, row: 0.5 },
        { id: "etl", label: "Python", sub: "Procesos ETL", col: 1, row: 0.5, tono: "neon" },
        { id: "bi", label: "Power BI", sub: "Dashboards ejecutivos", col: 2, row: 0, tono: "signal" },
        { id: "rep", label: "Reportes", sub: "Generación automática", col: 2, row: 1, tono: "signal" },
      ],
      enlaces: [
        ["db", "etl"],
        ["etl", "bi"],
        ["etl", "rep"],
      ],
    },
  },
  {
    id: "evocenda",
    contexto: "Proyecto personal · 2026",
    titulo: "Evocenda: este portafolio",
    reto: "Convertir una hoja de vida en un producto digital que, además de contarlo, muestre cómo trabajo con IA.",
    solucion:
      "Sitio estático en Next.js 16 construido con agentes de IA: contenido tipado, sistema visual propio, red neuronal en canvas y verificación en cada entrega.",
    puntos: [
      "Plan aprobado antes de escribir código.",
      "Datos sensibles fuera del sitio y casos rotulados con honestidad.",
      "Contenido listo para conectarse a una base de datos.",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "TypeScript", "Claude Code"],
    diagrama: {
      descripcion:
        "La hoja de vida y los certificados pasan por un agente de IA que produce contenido tipado y un sitio Next.js estático.",
      nodos: [
        { id: "cv", label: "Hoja de vida", sub: "y certificados", col: 0, row: 0.5, tono: "muted" },
        { id: "agente", label: "Claude Code", sub: "Plan · código · revisión", col: 1, row: 0.5, tono: "neon" },
        { id: "datos", label: "Contenido tipado", sub: "TypeScript", col: 2, row: 0 },
        { id: "sitio", label: "Next.js 16", sub: "Sitio estático", col: 2, row: 1, tono: "signal" },
      ],
      enlaces: [
        ["cv", "agente"],
        ["agente", "datos"],
        ["agente", "sitio"],
        ["datos", "sitio"],
      ],
    },
    enlace: { label: "Ver cómo se construyó", href: "/evidencia/evocenda-portafolio-con-agentes" },
  },
];

export async function getProyectos(): Promise<Proyecto[]> {
  return proyectos;
}
