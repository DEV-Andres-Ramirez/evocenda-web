"""Genera la versión pública de la hoja de vida (public/cv/CV-Andres-Ramirez.pdf).

Parte del HTML original de la hoja de vida, que no se modifica, y le quita la
cédula, la fecha de nacimiento y los teléfonos de las referencias. Renderiza
con Chrome headless y comprueba que ninguno de esos datos quede en el PDF.

Uso:  python3 scripts/cv-publico.py [--origen ..] [--privado ../evocenda-privado.json]
"""
import argparse, json, pathlib, re, subprocess, sys, tempfile
import pymupdf

parser = argparse.ArgumentParser()
parser.add_argument("--origen", default="..", help="carpeta con 'Hoja de Vida - Andrés Ramírez.html'")
parser.add_argument("--privado", default="../evocenda-privado.json")
parser.add_argument("--chrome", default="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
args = parser.parse_args()

SRC = pathlib.Path(args.origen) / "Hoja de Vida - Andrés Ramírez.html"
OUT = pathlib.Path("public/cv/CV-Andres-Ramirez.pdf")
privado = json.loads(pathlib.Path(args.privado).read_text(encoding="utf-8"))
html = SRC.read_text(encoding="utf-8")


def must_sub(pattern, repl, text, count=1):
    new, n = re.subn(pattern, repl, text, count=count, flags=re.S)
    if n != count:
        sys.exit(f"patrón no encontrado ({n}/{count}): {pattern[:60]}")
    return new


html = must_sub(r"\s*<div><dt>Cédula de Ciudadanía</dt><dd>\d+</dd></div>", "", html)
html = must_sub(r"\s*<div><dt>Fecha de Nacimiento</dt><dd>[\d/]+</dd></div>", "", html)
html = must_sub(r'<span class="tel">[^<]*</span>', "", html, count=3)
html = must_sub(r"grid-template-columns:\s*1fr 1\.15fr 1fr;", "grid-template-columns: .82fr 1.2fr 1.5fr 1fr;", html)
html = must_sub(
    r"(</ul>\s*</section>\s*</div>\s*</body>)",
    '</ul>\n    <p style="margin-top:1.4mm;font-size:8.3pt;color:var(--muted)">Datos de contacto de las referencias disponibles a solicitud.</p>\n  </section>\n</div>\n\n</body>',
    html,
)

with tempfile.TemporaryDirectory() as tmp:
    tmp = pathlib.Path(tmp)
    page = tmp / "cv.html"
    pdf = tmp / "cv.pdf"
    page.write_text(html, encoding="utf-8")
    subprocess.run(
        [args.chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--user-data-dir={tmp / 'perfil'}", f"--print-to-pdf={pdf}", page.as_uri()],
        capture_output=True, text=True, timeout=120,
    )
    if not pdf.exists():
        sys.exit("Chrome no generó el PDF")
    doc = pymupdf.open(pdf)
    doc.set_metadata({
        "title": "Hoja de Vida - Andrés David Ramírez Albarracín",
        "author": "Andrés David Ramírez Albarracín",
        "subject": "Hoja de vida: inteligencia artificial, transformación digital, analítica y herramientas digitales de productividad",
        "keywords": "Inteligencia Artificial, Transformación Digital, Analítica, Productividad, Full-Stack, Claude Code, n8n, Make",
    })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT, garbage=3, deflate=True)
    flat = re.sub(r"[\s.\-/]", "", "".join(p.get_text() for p in doc))
    needles = privado["cedula"] + privado["nacimiento"] + privado["terceros"]
    found = sorted({n for n in needles if re.sub(r"[\s.\-/]", "", n) in flat})
    print(f"páginas: {len(doc)} | tamaño: {OUT.stat().st_size // 1024} KB | datos sensibles encontrados: {len(found)}")
    sys.exit(0 if not found else "El PDF público contiene datos sensibles")
