/**
 * Rasgos para detectar fotos repetidas con tolerancia a re-encuadre/zoom:
 *   - hist: histograma RGB 4×4×4 (64 bins, 0-255) → robusto a reencuadre
 *   - gray: miniatura 16×16 en gris (base64) → correlación estructural
 *
 *   node scripts/feat.mjs            → calcula y cachea _feat.json
 *   node scripts/feat.mjs probe a b  → similitud entre dos ids (para calibrar)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const THUMBS = join(CACHE, '_thumbs');
const FEAT = join(CACHE, '_feat.json');
const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
const byId = new Map(photos.map((p) => [p.id, p]));
const thumb = (id, big) => join(THUMBS, `${id}${big ? '_l' : ''}.webp`);
const src = (id) => (existsSync(thumb(id, true)) ? thumb(id, true) : existsSync(thumb(id, false)) ? thumb(id, false) : byId.get(id).path);

const G = 16; // lado de la miniatura gris

export async function features(id) {
  const base = sharp(src(id), { failOn: 'none' }).rotate();
  const gray = await base.clone().greyscale().toColourspace('b-w').resize(G, G, { fit: 'fill' }).raw().toBuffer();
  const { data: rgb } = await base.clone().resize(48, 48, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const hist = new Array(64).fill(0);
  for (let i = 0; i < rgb.length; i += 3) {
    const r = rgb[i] >> 6, g = rgb[i + 1] >> 6, b = rgb[i + 2] >> 6;
    hist[r * 16 + g * 4 + b]++;
  }
  const total = rgb.length / 3;
  return { g: Buffer.from(gray).toString('base64'), h: hist.map((v) => Math.round((v / total) * 1000)) };
}

/* ───────── similitud ───────── */
const dec = (b64) => Buffer.from(b64, 'base64');

export function histSim(a, b) {
  let inter = 0;
  for (let i = 0; i < 64; i++) inter += Math.min(a[i], b[i]);
  return inter / 1000;
}

// muestrea una ventana centrada de lado `scale` de la miniatura G×G y la devuelve G×G
function crop(g, scale) {
  if (scale >= 0.999) return g;
  const side = G * scale, off = (G - side) / 2;
  const out = new Float64Array(G * G);
  for (let y = 0; y < G; y++) {
    const sy = Math.min(G - 1, Math.max(0, off + (y * side) / (G - 1)));
    const y0 = Math.floor(sy), y1 = Math.min(G - 1, y0 + 1), fy = sy - y0;
    for (let x = 0; x < G; x++) {
      const sx = Math.min(G - 1, Math.max(0, off + (x * side) / (G - 1)));
      const x0 = Math.floor(sx), x1 = Math.min(G - 1, x0 + 1), fx = sx - x0;
      const v = g[y0 * G + x0] * (1 - fx) * (1 - fy) + g[y0 * G + x1] * fx * (1 - fy)
        + g[y1 * G + x0] * (1 - fx) * fy + g[y1 * G + x1] * fx * fy;
      out[y * G + x] = v;
    }
  }
  return out;
}

function corr(a, b) {
  let ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; }
  ma /= a.length; mb /= b.length;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] - ma, y = b[i] - mb;
    num += x * y; da += x * x; db += y * y;
  }
  return da && db ? num / Math.sqrt(da * db) : 0;
}

// correlación máxima probando zoom en una u otra foto
export function structSim(ga, gb) {
  const A = dec(ga), B = dec(gb);
  let best = -1;
  for (const s of [1, 0.85, 0.72]) {
    best = Math.max(best, corr(crop(A, s), B), corr(A, crop(B, s)));
  }
  return best;
}

/* ───────── CLI ───────── */
if (process.argv[1] && process.argv[1].endsWith('feat.mjs')) {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'probe') {
    const F = JSON.parse(readFileSync(FEAT, 'utf8'));
    const fa = F[a], fb = F[b];
    console.log(`hist=${histSim(fa.h, fb.h).toFixed(3)}  struct=${structSim(fa.g, fb.g).toFixed(3)}`);
  } else {
    const F = existsSync(FEAT) ? JSON.parse(readFileSync(FEAT, 'utf8')) : {};
    const todo = photos.filter((p) => !F[p.id]);
    console.log(`rasgos: ${photos.length} fotos · pendientes ${todo.length}`);
    let i = 0, done = 0;
    const worker = async () => {
      while (i < todo.length) {
        const p = todo[i++];
        try { F[p.id] = await features(p.id); } catch { F[p.id] = null; }
        if (++done % 250 === 0) { writeFileSync(FEAT, JSON.stringify(F)); process.stdout.write(`\r  ${done}/${todo.length}`); }
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    writeFileSync(FEAT, JSON.stringify(F));
    console.log(`\n✓ rasgos → ${FEAT}`);
  }
}
