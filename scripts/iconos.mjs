/**
 * Genera los iconos del sitio a partir de src/app/icon.svg y, con --webp,
 * convierte a WebP las vistas previas de certificados.
 *
 * Uso:  node scripts/iconos.mjs            → apple-icon, iconos del manifest y favicon.ico
 *       node scripts/iconos.mjs --webp     → además, .tmp/certificados/*.png → public/credenciales/*.webp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// sharp llega como dependencia de Next; se localiza dentro de node_modules/.pnpm.
const store = path.join(root, "node_modules/.pnpm");
const sharpDir = fs.readdirSync(store).find((name) => name.startsWith("sharp@"));
const { default: sharp } = await import(pathToFileURL(path.join(store, sharpDir, "node_modules/sharp/dist/index.mjs")).href);

async function icons() {
  const svg = fs.readFileSync(path.join(root, "src/app/icon.svg"));
  const png = (size) => sharp(svg, { density: 512 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
  fs.mkdirSync(path.join(root, "public/icons"), { recursive: true });
  fs.writeFileSync(path.join(root, "src/app/apple-icon.png"), await png(180));
  fs.writeFileSync(path.join(root, "public/icons/icon-192.png"), await png(192));
  fs.writeFileSync(path.join(root, "public/icons/icon-512.png"), await png(512));

  // favicon.ico: contenedor ICO con tres PNG (16, 32 y 48 px).
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(png));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = images.map((image, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizes[i], 0);
    entry.writeUInt8(sizes[i], 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });
  fs.writeFileSync(path.join(root, "src/app/favicon.ico"), Buffer.concat([header, ...entries, ...images]));
  console.log("iconos: apple-icon.png, icons/icon-192.png, icons/icon-512.png, favicon.ico");
}

async function webp() {
  const source = path.join(root, ".tmp/certificados");
  const target = path.join(root, "public/credenciales");
  fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(source).filter((name) => name.endsWith(".png"))) {
    let image = sharp(path.join(source, file));
    if (file.startsWith("matricula")) image = image.resize({ width: 1200, withoutEnlargement: true });
    const info = await image.webp({ quality: 86, effort: 6 }).toFile(path.join(target, file.replace(/\.png$/, ".webp")));
    console.log(`credenciales/${file.replace(/\.png$/, ".webp")}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
  }
}

await icons();
if (process.argv.includes("--webp")) await webp();
