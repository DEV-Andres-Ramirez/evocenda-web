# Evocenda by Andrés

**Mi evolución hecha senda.** Portafolio profesional de Andrés Ramírez: una ruta con nodos, hitos y capas que reúne perfil, evidencia de IA aplicada, docencia, trayectoria, proyectos, stack y credenciales.

Sitio estático construido con Next.js 16 (App Router), React 19 y Tailwind CSS 4. Sin base de datos por ahora: todo el contenido vive en módulos tipados.

## Comandos

```bash
pnpm dev        # servidor de desarrollo en http://localhost:3000
pnpm build      # compilación de producción (todas las rutas salen estáticas)
pnpm start      # sirve la compilación
pnpm lint       # ESLint
pnpm exec next typegen && pnpm exec tsc --noEmit   # tipos
```

Antes de publicar, define la URL del sitio (ver `.env.example`):

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Se usa para las URL canónicas, la imagen para compartir, `sitemap.xml` y `robots.txt`, y se lee al compilar.

## Estructura

```
src/
  app/                 Rutas: home (/), casos (/evidencia/[slug]), 404, sitemap, robots, manifest, iconos
  content/             Contenido del sitio (lo único que hay que tocar para actualizar textos)
  components/
    sections/          Una sección de la home por archivo
    evidencia/         Reproductor de flujos, tarjetas y filtro de casos
    layout/            Cabecera, menú móvil, consola (⌘K), pie y cambio de tema
    home/              Riel de la senda y scroll-spy (viven dentro de la home)
    fx/                Red neuronal del hero, revelados y foco del cursor
    ui/                Iconos, visor de imágenes, diagramas y piezas pequeñas
    brand/             Logo AR
  styles/              Tokens de color, movimiento y transiciones de vista
  lib/                 Utilidades
public/                Imágenes de evidencia, vistas previas de certificados, CV público e iconos
scripts/               Generación de activos (ver más abajo)
```

## Cómo actualizar el contenido

Cada archivo de `src/content` exporta funciones asíncronas (`getCasos`, `getHitos`, …). Las secciones solo leen a través de ellas, así que cuando el contenido pase a una base de datos basta con cambiar el interior de esas funciones.

| Archivo | Contenido |
| --- | --- |
| `site.ts` | Nombre, lema, datos de contacto y secciones de la home |
| `perfil.ts` | Perfil, áreas de enfoque y datos del hero |
| `evidencia.ts` | Casos de IA aplicada y la matriz de evidencia |
| `docencia.ts` | Docencia y formación empresarial |
| `senda.ts` | Trayectoria completa (experiencia, docencia, formación e hitos) |
| `proyectos.ts` | Proyectos con su diagrama de arquitectura |
| `stack.ts` | Habilidades e idiomas |
| `credenciales.ts` | Títulos, certificados, logros, insignias y referencias |
| `consola.ts` | Preguntas y respuestas preparadas de la consola |

Los fragmentos entre `**dobles asteriscos**` se muestran resaltados. Los iconos se referencian por nombre (ver `src/components/ui/icon.tsx`).

### Reglas del contenido

- **Evidencia honesta.** Un caso con `kind: "realizado"` es un proyecto que existe; uno con `kind: "diseno"` es un caso práctico diseñado como material de formación y se rotula así en todo el sitio. No se publican métricas que no estén medidas.
- **Privacidad.** El sitio no publica el número de cédula, la fecha de nacimiento ni los teléfonos de las referencias. Los certificados se muestran con esos datos cubiertos y el CV descargable es una versión pública.
- **Insignias.** `credenciales.ts` tiene una lista `insignias` vacía; la sección aparece sola cuando se agrega la primera.

## Activos generados

Los documentos originales no están en el repositorio. Los scripts los leen desde la carpeta superior (`..`) y toman los datos que deben ocultarse de `../evocenda-privado.json`, que también vive fuera del repositorio.

```bash
python3 scripts/vistas-certificados.py   # certificados con datos cubiertos → .tmp/certificados/*.png
node scripts/iconos.mjs --webp           # iconos del sitio y certificados en WebP → public/
python3 scripts/cv-publico.py            # CV sin datos sensibles → public/cv/CV-Andres-Ramirez.pdf
```

Requieren Python con PyMuPDF y Google Chrome. Los dos scripts de Python terminan con error si algún dato sensible queda sin cubrir.

El certificado del diplomado GEN-AI es la excepción: llega como imagen PNG, sin texto que se pueda buscar, así que sus zonas (cédula y código QR) van en coordenadas fijas dentro de `vistas-certificados.py`. El script se detiene si la imagen cambia de tamaño, pero no puede comprobar el resultado por sí solo: hay que mirar `public/credenciales/diplomado-gen-ai.webp` cada vez que se regenere.

`scripts/og.html` es la plantilla de la imagen para compartir (`public/og.png`): se abre a 1200 × 630 px y se captura.

## Notas técnicas

- **Next.js 16.** Esta versión cambia varias convenciones; `AGENTS.md` pide consultar la documentación incluida en `node_modules/next/dist/docs/` antes de modificar el código.
- **Todo estático.** El layout raíz exporta `ensureStatic = "navigation"`: cualquier trabajo en tiempo de petición rompe el build en lugar de degradar el sitio. Hay que revisarlo al conectar una base de datos.
- **Sin valores no deterministas en el servidor.** Nada de `new Date()` ni `Math.random()` en componentes de servidor: el año del pie y la fecha del sitemap son constantes.
- **Tema.** Oscuro por defecto; el claro se guarda en `localStorage`. Un script en el `<head>` lo aplica antes del primer pintado.
- **Movimiento.** Todo respeta `prefers-reduced-motion`, y el contenido es legible sin JavaScript.
