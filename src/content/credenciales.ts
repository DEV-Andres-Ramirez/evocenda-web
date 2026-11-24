import type { IconName } from "@/components/ui/icon";

/**
 * Formación, certificados y logros.
 *
 * Privacidad: las vistas previas de los documentos están en `public/credenciales`
 * con el número de cédula y los códigos QR de verificación cubiertos. En el
 * certificado de experiencia también se cubren los datos personales y la firma de
 * quien lo firma. Las referencias se publican solo con nombre y cargo.
 */
export interface Titulo {
  id: string;
  titulo: string;
  institucion: string;
  lugar: string;
  periodo: string;
  notas: string[];
}

export interface Certificado {
  id: string;
  titulo: string;
  emisor: string;
  fecha: string;
  datos: string[];
  icon: IconName;
  imagen?: { src: string; width: number; height: number; alt: string };
}

export interface Logro {
  id: string;
  titulo: string;
  detalle: string;
  fuente: string;
  icon: IconName;
}

/** Insignias digitales emitidas por terceros. Vacío por ahora: la sección solo aparece si hay alguna. */
export interface Insignia {
  id: string;
  titulo: string;
  emisor: string;
  fecha: string;
  url: string;
  imagen?: string;
}

export interface Referencia {
  nombre: string;
  cargo: string;
}

const titulos: Titulo[] = [
  {
    id: "especializacion",
    titulo: "Especialización en Ingeniería de Software y Aplicaciones Multiplataforma",
    institucion: "Instituto Europeo de Posgrado",
    lugar: "España · Modalidad virtual",
    periodo: "Julio 2025 – Octubre 2026",
    notas: [
      "Doble titulación internacional en conjunto con la Corporación Universitaria de Asturias, en la Especialización en Desarrollo de Software.",
      "Incluye certificación internacional en Advanced Executive Education in Scalable Software Architecture otorgada por SUMMA University (EE. UU.).",
    ],
  },
  {
    id: "diplomado",
    titulo: "Diplomado Internacional GEN-AI para la Gestión Empresarial",
    institucion: "Red SUMMA Education",
    lugar: "Bogotá D.C., Colombia",
    periodo: "Octubre 2026",
    notas: ["Diplomado certificado de 130 horas en inteligencia artificial generativa (GEN-AI) aplicada a la gestión empresarial."],
  },
  {
    id: "pregrado",
    titulo: "Ingeniería de Sistemas y Computación",
    institucion: "Universidad Pedagógica y Tecnológica de Colombia",
    lugar: "Tunja, Colombia",
    periodo: "Marzo 2020 – Junio 2025",
    notas: [
      "Graduado con distinción. Obtención de nota meritoria en la opción de grado, cumpliendo con los requisitos estatutarios de grado con mención de mérito.",
    ],
  },
];

const certificados: Certificado[] = [
  {
    id: "diplomado-gen-ai",
    titulo: "Diplomado Internacional GEN-AI para la Gestión Empresarial",
    emisor: "Red SUMMA Education",
    fecha: "1 de octubre de 2026",
    datos: ["130 horas certificadas", "Bogotá D.C., Colombia"],
    icon: "sparkles",
    imagen: {
      src: "/credenciales/diplomado-gen-ai.webp",
      width: 1122,
      height: 793,
      alt: "Certificado de Red SUMMA Education: Andrés David Ramírez Albarracín cursó y aprobó el Diplomado Internacional GEN-AI para la Gestión Empresarial, con una duración de 130 horas, expedido en Bogotá D.C. el 1 de octubre de 2026. El número de cédula está cubierto.",
    },
  },
  {
    id: "certificado-experiencia",
    titulo: "Certificado de experiencia",
    emisor: "Procesos Sostenibles S.A.S.",
    fecha: "Periodo 2025 – 2026",
    datos: ["Profesional especializado", "Formación y habilidades en inteligencia artificial"],
    icon: "file-check",
    imagen: {
      src: "/credenciales/certificado-procesos-sostenibles.webp",
      width: 1062,
      height: 1500,
      alt: "Certificado de experiencia de Procesos Sostenibles S.A.S. a nombre de Andrés David Ramírez Albarracín, con los datos personales cubiertos.",
    },
  },
  {
    id: "matricula-copnia",
    titulo: "Matrícula profesional de ingeniero",
    emisor: "COPNIA",
    fecha: "30 de enero de 2026",
    datos: ["N.º 041129-0813972 BYC", "Resolución RN2026NALA005292"],
    icon: "badge-check",
    imagen: {
      src: "/credenciales/matricula-copnia.webp",
      width: 1200,
      height: 759,
      alt: "Tarjeta de matrícula profesional del COPNIA en Ingeniería de Sistemas y Computación, con el número de identificación cubierto.",
    },
  },
  {
    id: "diploma-uptc",
    titulo: "Diploma de Ingeniero de Sistemas y Computación",
    emisor: "Universidad Pedagógica y Tecnológica de Colombia",
    fecha: "19 de junio de 2025",
    datos: ["Diploma n.º 160450", "Libro 66 · Folio 880"],
    icon: "graduation",
    imagen: {
      src: "/credenciales/diploma-uptc.webp",
      width: 1500,
      height: 1074,
      alt: "Diploma de Ingeniero de Sistemas y Computación de la UPTC, con el número de cédula cubierto.",
    },
  },
  {
    id: "acta-de-grado",
    titulo: "Acta de grado n.º ING-145",
    emisor: "Universidad Pedagógica y Tecnológica de Colombia",
    fecha: "19 de junio de 2025",
    datos: ["Resolución de grado RG-129", "Práctica empresarial con nota meritoria"],
    icon: "file-text",
    imagen: {
      src: "/credenciales/acta-de-grado.webp",
      width: 1167,
      height: 1500,
      alt: "Acta de grado ING-145 de la UPTC, con el número de cédula cubierto.",
    },
  },
];

const logros: Logro[] = [
  {
    id: "meritoria",
    titulo: "Nota meritoria",
    detalle: "Opción de grado por práctica empresarial",
    fuente: "Acta de grado ING-145 · UPTC, 2025",
    icon: "award",
  },
  {
    id: "gen-ai",
    titulo: "130 horas en GEN-AI",
    detalle: "IA generativa para la gestión empresarial",
    fuente: "Diplomado internacional · Red SUMMA Education, 2026",
    icon: "sparkles",
  },
  {
    id: "arquitectura",
    titulo: "Scalable Software Architecture",
    detalle: "Advanced Executive Education",
    fuente: "SUMMA University (EE. UU.) · incluida en la especialización",
    icon: "blocks",
  },
  {
    id: "matricula",
    titulo: "Matrícula profesional",
    detalle: "Ingeniería de Sistemas y Computación",
    fuente: "COPNIA · resolución del 30 de enero de 2026",
    icon: "badge-check",
  },
  {
    id: "docente",
    titulo: "Docente de IA 2026",
    detalle: "Cuatro ciclos de formación empresarial",
    fuente: "Cafam · junio, julio, septiembre y octubre",
    icon: "users",
  },
];

const insignias: Insignia[] = [];

const referencias: Referencia[] = [
  { nombre: "José Manuel Salamanca Bermúdez", cargo: "Desarrollador Full-Stack en Automatiza Soluciones" },
  { nombre: "Héctor Santiago Muñoz Valencia", cargo: "Gerente de Transformación y Gestión del Cambio en LinkTic" },
  { nombre: "Brayam Orlando Rojas Peña", cargo: "Analista de Datos en TransUnion" },
];

export async function getCredenciales() {
  return { titulos, certificados, logros, insignias, referencias };
}
