"""Genera las vistas previas públicas de los certificados con los datos sensibles cubiertos.

Los PDF originales no se modifican: se trabaja sobre una copia en memoria, se
eliminan de verdad el texto y los píxeles de cada zona y se rasteriza a PNG.
Después, `node scripts/iconos.mjs --webp` convierte los PNG a WebP en public/credenciales.

Uso:  python3 scripts/vistas-certificados.py [--origen ..] [--privado ../evocenda-privado.json] [--salida .tmp/certificados]

Los números a cubrir se leen de un archivo privado que vive FUERA del repositorio.
"""
import argparse, json, pathlib, sys
import pymupdf

parser = argparse.ArgumentParser()
parser.add_argument("--origen", default="..", help="carpeta con los PDF originales")
parser.add_argument("--privado", default="../evocenda-privado.json", help="archivo con los datos a cubrir")
parser.add_argument("--salida", default=".tmp/certificados")
args = parser.parse_args()

SRC = pathlib.Path(args.origen)
OUT = pathlib.Path(args.salida)
OUT.mkdir(parents=True, exist_ok=True)
privado = json.loads(pathlib.Path(args.privado).read_text(encoding="utf-8"))
NEEDLES = privado["cedula"] + privado["terceros"]

BAR = (0.80, 0.77, 0.87)
WHITE = (1, 1, 1)
R = pymupdf.Rect

# nombre: (pdf, zonas extra [(rect, color)], imágenes a retirar por xref, recorte)
JOBS = {
    # Se cubre el código QR de verificación.
    "diploma-uptc": ("Diploma_Profesional-Andres_Ramirez.pdf", [(R(103, 508, 172, 576), WHITE)], [], None),
    "acta-de-grado": ("Acta_Grado-Andres_Ramirez.pdf", [(R(290, 730, 346, 788), WHITE)], [], None),
    # Se recorta a la tarjeta (sin la URL de verificación) y se cubre el código QR.
    "matricula-copnia": ("Tarjeta_Profesional-Andres_Ramirez.pdf", [(R(339, 140, 401, 203), WHITE)], [], R(130, 46, 413, 225)),
    # Se retiran la firma manuscrita del firmante y los teléfonos del pie de página.
    "certificado-procesos-sostenibles": ("Certificado_Laboral-Andres_Ramirez.pdf", [(R(238, 795, 368, 815), WHITE)], [11], None),
}

ok = True
for name, (pdf, extra, drop_images, clip) in JOBS.items():
    doc = pymupdf.open(SRC / pdf)
    page = doc[0]
    for xref in drop_images:
        page.delete_image(xref)
    hits = 0
    for needle in NEEDLES:
        for rect in page.search_for(needle):
            page.add_redact_annot(R(rect.x0 - 2, rect.y0 - 1, rect.x1 + 2, rect.y1 + 1), fill=BAR)
            hits += 1
    for rect, color in extra:
        page.add_redact_annot(rect, fill=color)
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_PIXELS, graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED)
    area = clip or page.rect
    zoom = 1500 / max(area.width, area.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False, clip=clip)
    pix.save(OUT / f"{name}.png")
    left = [n for n in NEEDLES if page.search_for(n)]
    ok = ok and not left
    print(f"{name}: {pix.width}x{pix.height} | datos cubiertos: {hits} | restantes: {len(left)}")

sys.exit(0 if ok else "Quedaron datos sensibles sin cubrir")
