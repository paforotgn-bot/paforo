/**
 * Mete imágenes propias en el portfolio.
 *
 * Las deja en public/images/work/<slug>/NN.webp y escribe un manifest.json
 * con el tamaño de cada una, para que la web pueda respetar su proporción
 * (las capturas de móvil son verticales y las de escritorio apaisadas).
 *
 *   node scripts/import-media.mjs <slug> "ruta/a/imagen1" "ruta/a/video.mp4" ...
 *   node scripts/import-media.mjs --migrate     (mueve las capturas antiguas)
 *
 * El orden de los argumentos es el orden en la web: la primera es la portada.
 *
 * Los vídeos admiten recorte, para quitar la barra del navegador de una
 * grabación de pantalla:  "ruta/video.mp4#crop=576:1112:0:136"  (an:al:x:y)
 *
 * OJO: al reimportar, los ficheros se llaman igual (01.webp, 02.webp...) y
 * Next cachea la imagen optimizada por URL, así que seguiría sirviendo la
 * anterior. Hay que parar el servidor y borrar la caché de imágenes:
 *   dev   → .next/dev/cache/images
 *   build → .next/cache/images
 * Se cachea una variante por formato: con el servidor en marcha puedes ver
 * la nueva por curl (JPEG) y la vieja en el navegador (AVIF).
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images/work';
const VIDEO = /\.(mp4|mov|webm|m4v)$/i;
const MAX_VIDEO_W = 720;
const MAX_LANDSCAPE = 2000;
const MAX_PORTRAIT = 1100;
const QUALITY = 82;

const sh = (cmd, args) =>
  new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'ignore' });
    proc.on('error', reject);
    proc.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} salió con ${code}`))
    );
  });

async function probe(file) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height',
      '-of', 'json',
      file,
    ]);
    let out = '';
    proc.stdout.on('data', (chunk) => (out += chunk));
    proc.on('error', reject);
    proc.on('close', () => {
      try {
        const { streams } = JSON.parse(out);
        resolve({ width: streams[0].width, height: streams[0].height });
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function writeManifest(dir) {
  const files = (await fs.readdir(dir))
    .filter((f) => /^\d\d\.(webp|mp4)$/.test(f))
    .sort();

  const entries = [];
  for (const file of files) {
    const full = path.join(dir, file);
    if (file.endsWith('.mp4')) {
      const { width, height } = await probe(full);
      entries.push({
        src: file,
        w: width,
        h: height,
        kind: 'video',
        poster: file.replace('.mp4', '.webp'),
      });
    } else {
      // El póster de un vídeo no es una pieza más de la galería.
      const base = file.replace('.webp', '.mp4');
      if (files.includes(base)) continue;
      const { width, height } = await sharp(full).metadata();
      entries.push({ src: file, w: width, h: height, kind: 'image' });
    }
  }

  await fs.writeFile(path.join(dir, 'manifest.json'), JSON.stringify(entries, null, 2));
  return entries;
}

/** Recodifica un vídeo, recortando la barra del navegador si se pide. */
async function importVideo(source, crop, target) {
  const filters = [];
  if (crop) filters.push(`crop=${crop}`);
  // Nunca ampliar: una grabación de 318px de ancho subida a 720 sólo pesa
  // más y se ve peor. Ancho par obligatorio para h264; -2 mantiene el ratio.
  filters.push(`scale='min(${MAX_VIDEO_W},iw)':-2:flags=lanczos`);

  await sh('ffmpeg', [
    '-y', '-i', source,
    '-vf', filters.join(','),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    target,
  ]);

  // Póster: primer fotograma útil, para que no se vea negro antes de cargar.
  await sh('ffmpeg', [
    '-y', '-ss', '1', '-i', target,
    '-vframes', '1',
    target.replace('.mp4', '.webp'),
  ]);
}

async function importFor(slug, sources) {
  const dir = path.join(ROOT, slug);
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });

  let index = 0;
  for (const raw of sources) {
    // "ruta/video.mp4#crop=an:al:x:y"
    const [source, hash = ''] = raw.split('#');
    const crop = /^crop=([\d:]+)$/.exec(hash)?.[1];

    index += 1;
    const stem = String(index).padStart(2, '0');

    if (VIDEO.test(source)) {
      await importVideo(source, crop, path.join(dir, `${stem}.mp4`));
      continue;
    }

    const image = sharp(source);
    const { width, height } = await image.metadata();
    // Una captura de móvil no debe salir a 2000px de ancho: pesa de más y
    // en pantalla nunca se ve tan grande.
    const cap = width >= height ? MAX_LANDSCAPE : MAX_PORTRAIT;

    await image
      .resize({ width: Math.min(width, cap), withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(dir, `${stem}.webp`));
  }

  const entries = await writeManifest(dir);
  const videos = entries.filter((e) => e.kind === 'video').length;
  console.log(
    `${slug}: ${entries.length - videos} imágenes` + (videos ? ` y ${videos} vídeo(s)` : '')
  );
}

/** Pasa las capturas automáticas <slug>-NN.jpg al formato de carpeta. */
async function migrate() {
  const files = await fs.readdir(ROOT);
  const bySlug = new Map();

  for (const file of files) {
    const match = /^(.+)-(\d\d)\.jpg$/.exec(file);
    if (!match) continue;
    const [, slug] = match;
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push(file);
  }

  for (const [slug, list] of bySlug) {
    await importFor(
      slug,
      list.sort().map((f) => path.join(ROOT, f))
    );
    await Promise.all(list.map((f) => fs.rm(path.join(ROOT, f), { force: true })));
  }
}

/**
 * Next cachea cada variante optimizada por URL, y los ficheros se llaman
 * igual en cada importación. Sin borrar esto seguiría sirviendo las viejas.
 */
async function clearImageCache() {
  for (const dir of ['.next/dev/cache/images', '.next/cache/images']) {
    await fs.rm(dir, { recursive: true, force: true });
  }
  console.log('Caché de imágenes borrada. Reinicia el servidor si está en marcha.');
}

const args = process.argv.slice(2);

if (args[0] === '--migrate') {
  await migrate();
  await clearImageCache();
} else {
  const [slug, ...sources] = args;
  if (!slug || !sources.length) {
    console.error('Uso: node scripts/import-media.mjs <slug> "imagen1" "imagen2" ...');
    process.exit(1);
  }
  await importFor(slug, sources);
  await clearImageCache();
}
