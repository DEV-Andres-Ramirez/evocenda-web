/**
 * La senda: trayectoria completa, de hoy al origen.
 * Las viñetas de experiencia se conservan tal como están en la hoja de vida.
 */
export const capas = {
  experiencia: { label: "Experiencia", tono: "accent" },
  docencia: { label: "Docencia", tono: "signal" },
  formacion: { label: "Formación", tono: "warm" },
  hito: { label: "Hitos", tono: "ink" },
} as const;

export type CapaId = keyof typeof capas;
export const capaIds = Object.keys(capas) as CapaId[];

export interface Hito {
  id: string;
  capa: CapaId;
  fecha: string;
  titulo: string;
  organizacion: string;
  lugar: string;
  resumen: string;
  actual?: boolean;
  origen?: boolean;
  puntos?: string[];
  tecnologias?: string[];
}

const hitos: Hito[] = [
  {
    id: "linktic",
    capa: "experiencia",
    fecha: "Feb 2026 — Actualidad",
    titulo: "Desarrollador Full-Stack Senior",
    organizacion: "LinkTic",
    lugar: "Bogotá D.C., Colombia · Presencial",
    resumen:
      "Desarrollo aplicaciones empresariales con Next.js y NestJS e integro inteligencia artificial en los productos y en el propio ciclo de desarrollo, con Claude Code como herramienta principal.",
    actual: true,
    puntos: [
      "Desarrollo aplicaciones web empresariales de extremo a extremo con **Next.js** (Front-End) y **NestJS** (Back-End), integrando capacidades de **inteligencia artificial** tanto en los productos como en el ciclo de desarrollo de software.",
      "Trabajo con un flujo de desarrollo asistido por **agentes de IA**, con **Claude Code** como herramienta principal, para acelerar el análisis, la implementación, las pruebas y la documentación sin sacrificar la calidad ni la revisión técnica del código.",
      "Diseño y mantengo **skills**, subagentes e integraciones **MCP**, y configuro el **harness** de los agentes (contexto, herramientas, permisos y hooks) para obtener resultados consistentes, seguros y reutilizables.",
      "Diseño e implemento **automatizaciones de procesos** con **n8n** y **Make**, orquestando flujos que conectan APIs, servicios y modelos de IA para reducir tareas manuales y tiempos operativos.",
      "Aplico **ingeniería de prompts y de contexto** para integrar modelos de lenguaje en soluciones a la medida, llevando la IA a casos de uso reales del negocio.",
    ],
    tecnologias: ["Next.js", "NestJS", "Claude Code", "Skills y MCP", "n8n", "Make"],
  },
  {
    id: "diplomado",
    capa: "formacion",
    fecha: "Oct 2026",
    titulo: "Diplomado Internacional GEN-AI para la Gestión Empresarial",
    organizacion: "Red SUMMA Education",
    lugar: "Bogotá D.C., Colombia",
    resumen:
      "Diplomado certificado de 130 horas en inteligencia artificial generativa (GEN-AI) aplicada a la gestión empresarial.",
  },
  {
    id: "especializacion",
    capa: "formacion",
    fecha: "Jul 2025 — Oct 2026",
    titulo: "Especialización en Ingeniería de Software y Aplicaciones Multiplataforma",
    organizacion: "Instituto Europeo de Posgrado",
    lugar: "España · Modalidad virtual",
    resumen:
      "Doble titulación internacional con la Corporación Universitaria de Asturias. Incluye la certificación Advanced Executive Education in Scalable Software Architecture de SUMMA University (EE. UU.).",
  },
  {
    id: "cafam",
    capa: "docencia",
    fecha: "Jun · Jul · Sep · Oct 2026",
    titulo: "Docente de Inteligencia Artificial y Tecnología Aplicada a los Negocios",
    organizacion: "Cafam",
    lugar: "Bogotá D.C., Colombia",
    resumen:
      "Clases, espacios prácticos y charlas en los que las empresas aprenden a usar la IA y la tecnología como herramientas de avance, y a automatizar sus procesos.",
  },
  {
    id: "banistmo",
    capa: "experiencia",
    fecha: "Abr 2026 — Jul 2026",
    titulo: "Desarrollador Full-Stack Senior",
    organizacion: "Banistmo",
    lugar: "Ciudad de Panamá, Panamá",
    resumen:
      "Desarrollo y evolución de soluciones full-stack bajo los estándares de seguridad, calidad y cumplimiento del sector bancario.",
    puntos: [
      "Participé en el desarrollo y la evolución de soluciones de software full-stack para la entidad, bajo los estándares de seguridad, calidad y cumplimiento propios del sector bancario.",
      "Colaboré con equipos multidisciplinarios de tecnología y negocio en el diseño técnico, la implementación y la entrega de funcionalidades, aplicando buenas prácticas de arquitectura y metodologías ágiles.",
    ],
  },
  {
    id: "copnia",
    capa: "hito",
    fecha: "Ene 2026",
    titulo: "Matrícula profesional de ingeniero",
    organizacion: "COPNIA",
    lugar: "Colombia",
    resumen: "Matrícula profesional n.º 041129-0813972 BYC, otorgada por resolución del 30 de enero de 2026.",
  },
  {
    id: "procesos-sostenibles",
    capa: "docencia",
    fecha: "2025 — 2026",
    titulo: "Profesional Especializado · Transformación, Formación e IA",
    organizacion: "Procesos Sostenibles S.A.S.",
    lugar: "La Ceja, Colombia",
    resumen:
      "Procesos de transformación, desarrollo y orientación de la formación, y consolidación de habilidades en inteligencia artificial.",
  },
  {
    id: "uptc",
    capa: "formacion",
    fecha: "Mar 2020 — Jun 2025",
    titulo: "Ingeniería de Sistemas y Computación",
    organizacion: "Universidad Pedagógica y Tecnológica de Colombia",
    lugar: "Tunja, Colombia",
    resumen:
      "Título de Ingeniero de Sistemas y Computación, conferido el 19 de junio de 2025. Opción de grado por práctica empresarial, con nota meritoria.",
  },
  {
    id: "sura",
    capa: "experiencia",
    fecha: "Jun 2024 — Jun 2025",
    titulo: "Analista de TI (Rol Full-Stack)",
    organizacion: "SURA",
    lugar: "Medellín, Colombia",
    resumen:
      "Lideré la modernización de dos aplicaciones empresariales críticas: de un monolito en AngularJS a una arquitectura de microservicios con Angular y Spring Boot.",
    puntos: [
      "Lideré la modernización y migración completa de dos aplicaciones empresariales críticas desde un monolito en AngularJS hacia una arquitectura moderna de microservicios con **Angular** (Front-End) y **Spring Boot** (Back-End), separando los proyectos en repositorios independientes y aplicando patrones de diseño actualizados.",
      "Diseñé e implementé APIs RESTful robustas con Spring Boot en la actualización del Back-End, garantizando la separación de responsabilidades y la integración segura con la base de datos **Oracle**, donde realicé consultas y optimizaciones mediante **PL/SQL**.",
      "Garanticé la calidad y confiabilidad del software mediante la implementación de suites integrales de pruebas: unitarias (Jest/Angular, JUnit/Mockito-Spring Boot), funcionales y end-to-end (Playwright), junto con pruebas de seguridad estática (Checkmarx One) y dinámica en coordinación con el equipo de ciberseguridad.",
      "Actualicé los pipelines de **CI/CD** en **Azure Pipelines** para los entornos de desarrollo, laboratorio y producción, cumpliendo con los protocolos de liberación y los controles SOX requeridos para una empresa listada en bolsa.",
      "Rediseñé por completo la interfaz de usuario (**UI/UX**) de ambas aplicaciones, alineándola con la identidad corporativa y mejorando la experiencia del usuario final mediante Angular y Tailwind CSS.",
      "Gestioné y resolví incidentes complejos mediante análisis de logs, trazabilidad de transacciones y consultas en Oracle, colaborando con los equipos de operaciones y Back-End para la pronta resolución.",
      "Colaboré activamente en un entorno **Scrum**, gestionando el trabajo mediante Azure Boards y documentando en Confluence. Planifiqué las migraciones, desglosándolas en Historias Técnicas, y facilité la transferencia de conocimiento al equipo y **sesiones de capacitación** para usuarios finales.",
    ],
    tecnologias: ["Angular", "Spring Boot", "Oracle · PL/SQL", "Playwright", "Azure Pipelines", "Tailwind CSS"],
  },
  {
    id: "diaz-naturals",
    capa: "experiencia",
    fecha: "Abr 2023 — Dic 2023",
    titulo: "Desarrollador Full-Stack",
    organizacion: "Diaz Naturals",
    lugar: "Tunja, Colombia",
    resumen:
      "Lideré el ciclo completo de una aplicación web interna de inventario y pedidos, de la arquitectura al despliegue en producción y la capacitación del personal.",
    puntos: [
      "Lideré el ciclo completo de desarrollo de una aplicación web interna para la gestión de inventario y pedidos, gestionando al equipo técnico y las historias de usuario mediante **Jira** desde la concepción hasta el despliegue y entrega.",
      "Diseñé la arquitectura y desarrollé la solución Back-End con **Spring Boot**, diseñando APIs RESTful y modelando la base de datos en **PostgreSQL** para gestionar de manera eficiente inventarios, usuarios y la trazabilidad completa de los pedidos.",
      "Construí una interfaz de usuario dinámica y responsiva con **Angular**, implementando un sistema de componentes reutilizables con Tailwind CSS y controles de acceso basados en roles (administrador/usuario). Aseguré la calidad del Front-End con pruebas automatizadas utilizando Jest.",
      "Implementé un servicio de mensajería asíncrona con **Apache Kafka** para desacoplar y gestionar eventos críticos del negocio, mejorando la escalabilidad y robustez de la aplicación.",
      "Automaticé la infraestructura y los despliegues definiendo la infraestructura como código con **Terraform** en **AWS**, contenerizando la aplicación con **Docker**, y estableciendo un flujo de CI/CD mediante GitHub Actions para garantizar integraciones consistentes.",
      "Lideré el despliegue en producción, alojando el Front-End en Vercel y el Back-End en servicios AWS, asegurando la comunicación segura y el alto desempeño de la aplicación.",
      "Entregué la solución completa junto con documentación técnica, manual de usuario y **sesiones de capacitación** para el personal, asegurando una transición efectiva y la adopción exitosa del sistema.",
    ],
    tecnologias: ["Spring Boot", "PostgreSQL", "Angular", "Apache Kafka", "Terraform", "AWS", "Docker"],
  },
  {
    id: "yacarsu",
    capa: "experiencia",
    fecha: "Oct 2018 — Ene 2020",
    titulo: "Soporte Técnico y Desarrollo de Soluciones",
    organizacion: "Asesorías y Servicios YACARSU S.A.S.",
    lugar: "Yopal, Colombia",
    resumen:
      "El origen de la senda: soporte a una aplicación crítica en Spring Boot, automatización de procesos ETL con Python y dashboards ejecutivos en Power BI.",
    origen: true,
    puntos: [
      "Brindé soporte técnico y mantenimiento continuo a una aplicación interna crítica desarrollada en **Spring Boot**, garantizando su alta disponibilidad, desempeño óptimo y la estabilidad operativa de la plataforma.",
      "Gestioné y optimicé la base de datos en **PostgreSQL** asociada a la aplicación, ejecutando consultas complejas, realizando mantenimiento y asegurando la integridad y consistencia de los datos del negocio.",
      "Desarrollé scripts en **Python** para automatizar **procesos ETL**, la generación de reportes de alta complejidad y tareas de administración del sistema, incrementando significativamente la eficiencia operativa y reduciendo la intervención manual.",
      "Diseñé y construí **dashboards ejecutivos** e interactivos en **Power BI**, trabajando de manera colaborativa para transformar requisitos de negocio en visualizaciones de datos que facilitaron la toma de decisiones estratégicas.",
      "Participé en la mejora y documentación de procesos de TI, utilizando Confluence para el conocimiento técnico y Jira para el seguimiento de actividades, contribuyendo a la optimización de la infraestructura tecnológica.",
      "Colaboré en la planificación y gestión de proyectos técnicos, aplicando metodologías ágiles para la organización de tareas y el control de tiempos, alineando los esfuerzos de soporte con los objetivos del negocio.",
    ],
    tecnologias: ["Spring Boot", "PostgreSQL", "Python", "Power BI"],
  },
];

export async function getHitos(): Promise<Hito[]> {
  return hitos;
}
