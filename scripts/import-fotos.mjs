/**
 * Importador de fotos → Cloudflare R2 + manifiesto estático.
 * Modo VIAJES POR FECHA: reparte las fotos en viajes según su fecha (EXIF),
 * coloca cada viaje en el mapa geocodificando su 'place', hereda 'tags', y deduplica.
 *
 * Requiere: src/content/fotos/trips.config.json  (lista de viajes)
 *   [{ "id","name","place","start":"YYYY-MM-DD","end":"YYYY-MM-DD","tags":[...] }]
 *   El reparto usa el PRIMER viaje cuyo rango contiene la fecha → pon los
 *   sub-viajes (Panamá, México) ANTES del rango grande (Costa Rica).
 *
 * Uso:
 *   node scripts/import-fotos.mjs <carpeta-origen> [--dry] [--force]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import exifr from 'exifr';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const MANIFEST_PATH = join(OUT_DIR, 'manifest.json');
const STATE_PATH = join(OUT_DIR, 'organizer-state.json');
const OVERRIDES_PATH = join(OUT_DIR, 'geo-overrides.json');
const THUMB_MAX = 400, LARGE_MAX = 1600, BLUR_MAX = 16, CONCURRENCY = 5;
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic', '.heif', '.avif']);
const VIDEO_EXT = new Set(['.mov', '.mp4', '.m4v', '.avi']);

function loadEnv() {
  const raw = readFileSync(join(ROOT, '.env.local'), 'utf8');
  for (const line of raw.split('\n')) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
}
loadEnv();
const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const FORCE = args.includes('--force');
const srcDir = args.find((a) => !a.startsWith('--'));
if (!srcDir) { console.error('Uso: node scripts/import-fotos.mjs <carpeta-origen> [--dry]'); process.exit(1); }
if (!existsSync(srcDir)) { console.error(`No existe la carpeta: ${srcDir}`); process.exit(1); }
if (!existsSync(CONFIG_PATH)) { console.error(`Falta la lista de viajes: ${relative(ROOT, CONFIG_PATH)}`); process.exit(1); }

const trips = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const s3 = new S3Client({ region: 'auto', endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY } });

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const full = join(dir, n); const st = statSync(full); if (st.isDirectory()) walk(full, acc); else acc.push(full); }
  return acc;
}
async function mapPool(items, limit, fn, onProgress) {
  const results = new Array(items.length); let i = 0, done = 0;
  const worker = async () => { while (i < items.length) { const idx = i++; try { results[idx] = await fn(items[idx], idx); } catch (err) { results[idx] = { __error: err.message, file: items[idx] }; } onProgress?.(++done, items.length); } };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
// geocodificación DIRECTA (nombre → lat/lng), gratis sin key
async function geocode(place) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=es`);
    const j = await res.json();
    const r = j.results?.[0];
    return r ? { lat: +r.latitude.toFixed(5), lng: +r.longitude.toFixed(5), country: r.country || '' } : null;
  } catch { return null; }
}

// ===== Geocodificar cada viaje =====
console.log(`Viajes definidos: ${trips.length}. Geocodificando lugares...`);
for (const t of trips) {
  const g = t.lat != null && t.lng != null ? { lat: t.lat, lng: t.lng, country: t.country } : await geocode(t.place);
  if (!g) { console.log(`   ⚠ no pude geocodificar "${t.place}" (${t.name}) — sin pin`); t._lat = null; t._lng = null; }
  else { t._lat = g.lat; t._lng = g.lng; t._country = t.country || g.country; }
  t._start = new Date(t.start + 'T00:00:00Z').getTime();
  t._end = new Date(t.end + 'T23:59:59Z').getTime();
  console.log(`   ${t.name}  [${t.start}→${t.end}]  ${t._lat != null ? `(${t._lat}, ${t._lng})` : 'sin pin'}  tags: ${(t.tags || []).join(', ') || '—'}`);
}

// ===== Leer fotos y repartir por fecha =====
const all = walk(srcDir);
const files = all.filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()));
const videos = all.filter((f) => VIDEO_EXT.has(extname(f).toLowerCase()));
console.log(`\nImágenes: ${files.length} (+${videos.length} vídeos, se omiten por ahora)`);

console.log('Leyendo fechas y repartiendo...');
const metas = await mapPool(files, CONCURRENCY * 2, async (file) => {
  let takenAt = null, lat = null, lng = null;
  try {
    const ex = await exifr.parse(file, { gps: true, pick: ['DateTimeOriginal', 'CreateDate', 'latitude', 'longitude'] });
    const d = ex?.DateTimeOriginal || ex?.CreateDate; if (d instanceof Date && !isNaN(d)) takenAt = d.toISOString();
    if (typeof ex?.latitude === 'number') { lat = +ex.latitude.toFixed(6); lng = +ex.longitude.toFixed(6); }
  } catch { /* */ }
  const noDate = !takenAt;
  if (!takenAt) takenAt = statSync(file).mtime.toISOString();
  const t = new Date(takenAt).getTime();
  const trip = trips.find((tr) => t >= tr._start && t <= tr._end) || null;
  return { file, takenAt, noDate, lat, lng, trip };
}, (d, t) => { if (d % 100 === 0 || d === t) process.stdout.write(`\r  ${d}/${t}`); });
process.stdout.write('\n');

const valid = metas.filter((m) => m && !m.__error);
const buckets = new Map();
for (const m of valid) { const key = m.trip ? m.trip.id : '__sin'; (buckets.get(key) || buckets.set(key, []).get(key)).push(m); }

console.log('\n--- Reparto ---');
for (const t of trips) console.log(`  ${String((buckets.get(t.id) || []).length).padStart(4)}  ${t.name}`);
console.log(`  ${String((buckets.get('__sin') || []).length).padStart(4)}  (sin clasificar: fuera de fechas)`);

if (DRY) { console.log(`\n(modo --dry: nada subido)`); process.exit(0); }

// ===== Subir =====
mkdirSync(OUT_DIR, { recursive: true });
let existing = []; if (existsSync(MANIFEST_PATH)) { try { existing = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')); } catch { existing = []; } }
const existingById = new Map(existing.map((e) => [e.id, e]));
async function uploadIfNeeded(key, body, ct) { if (!FORCE) { try { await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key })); return; } catch { /* */ } } await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: ct, CacheControl: 'public, max-age=31536000, immutable' })); }

const flat = valid.filter((m) => m.trip); // solo las clasificadas
console.log(`\nSubiendo ${flat.length} fotos...`);
const seen = new Set();
const entries = await mapPool(flat, CONCURRENCY, async (m) => {
  const buf = readFileSync(m.file);
  const id = createHash('sha256').update(buf).digest('hex').slice(0, 12);
  if (seen.has(id)) return { __dup: true }; seen.add(id);
  const prev = existingById.get(id);
  const img = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const [thumb, large, blurBuf] = await Promise.all([
    img.clone().resize(THUMB_MAX, THUMB_MAX, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 70 }).toBuffer(),
    img.clone().resize(LARGE_MAX, LARGE_MAX, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
    img.clone().resize(BLUR_MAX, BLUR_MAX, { fit: 'inside' }).webp({ quality: 40 }).toBuffer(),
  ]);
  await uploadIfNeeded(`fotos/${id}/thumb.webp`, thumb, 'image/webp');
  await uploadIfNeeded(`fotos/${id}/large.webp`, large, 'image/webp');
  const t = m.trip;
  return { id, tripId: t.id, album: t.name, place: t.place, country: t._country || '', tags: t.tags || [],
    lat: m.lat ?? t._lat, lng: m.lng ?? t._lng, filename: basename(m.file), takenAt: m.takenAt,
    width: meta.width ?? null, height: meta.height ?? null, blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
    caption: prev?.caption || '', thumb: `fotos/${id}/thumb.webp`, large: `fotos/${id}/large.webp` };
}, (d, t) => { if (d % 20 === 0 || d === t) process.stdout.write(`\r  ${d}/${t}`); });
process.stdout.write('\n');

const merged = new Map(existingById); let added = 0, dups = 0; const errors = [];
for (const e of entries) { if (!e) continue; if (e.__dup) { dups++; continue; } if (e.__error) { errors.push(e); continue; } if (!merged.has(e.id)) added++; merged.set(e.id, e); }
const finalList = [...merged.values()].sort((a, b) => (a.takenAt < b.takenAt ? 1 : -1));

const agg = new Map();
for (const e of finalList) { const p = agg.get(e.tripId) || { id: e.tripId, name: e.album, place: e.place, country: e.country, tags: e.tags, count: 0, lat: e.lat, lng: e.lng, from: e.takenAt, to: e.takenAt }; p.count++; if (e.takenAt < p.from) p.from = e.takenAt; if (e.takenAt > p.to) p.to = e.takenAt; agg.set(e.tripId, p); }
const placesOut = [...agg.values()].sort((a, b) => (a.from < b.from ? 1 : -1));

writeFileSync(MANIFEST_PATH, JSON.stringify(finalList, null, 2));
writeFileSync(join(OUT_DIR, 'places.json'), JSON.stringify(placesOut, null, 2));
console.log('\n===== RESUMEN =====');
console.log(`Subidas nuevas: ${added} · duplicadas: ${dups} · errores: ${errors.length}`);
console.log(`Total manifiesto: ${finalList.length} · Viajes: ${placesOut.length}`);
if (errors.length) for (const e of errors.slice(0, 8)) console.log(`   ✗ ${e.file}: ${e.__error}`);
console.log(`\nManifiesto: ${relative(ROOT, MANIFEST_PATH)}\nViajes:     ${relative(ROOT, join(OUT_DIR, 'places.json'))}`);
