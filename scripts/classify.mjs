/**
 * Clasifica toda la colección contra unas fotos SEMILLA (ejemplos).
 * Se usa para separar lo que se repite siempre igual: selfies de espejo
 * (gimnasio/progreso) y fotos de papeles/pantallas.
 *
 *   node scripts/classify.mjs seeds <id> <id> ...   → mira a qué se parecen
 *   node scripts/classify.mjs run                   → aplica las semillas de classify-seeds.json
 *
 * Salida: src/content/fotos/classes.json + hojas de revisión en la caché.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { histSim, structSim } from './feat.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const THUMBS = join(CACHE, '_thumbs');
const SHEETS = join(CACHE, '_sheets');
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');

const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
const FEAT = JSON.parse(readFileSync(join(CACHE, '_feat.json'), 'utf8'));
const byId = new Map(photos.map((p) => [p.id, p]));
const thumb = (id, big) => join(THUMBS, `${id}${big ? '_l' : ''}.webp`);
const src = (id) => (existsSync(thumb(id, true)) ? thumb(id, true) : existsSync(thumb(id, false)) ? thumb(id, false) : byId.get(id).path);
const arg = (n, d) => { const a = process.argv.find((x) => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : d; };

const score = (a, b) => {
  const fa = FEAT[a], fb = FEAT[b];
  if (!fa || !fb) return 0;
  const h = histSim(fa.h, fb.h);
  if (h < 0.5) return 0;
  return 0.5 * h + 0.5 * structSim(fa.g, fb.g);
};

function matches(seeds, T) {
  const out = [];
  for (const p of photos) {
    if (!FEAT[p.id]) continue;
    let best = 0;
    for (const s of seeds) { const v = score(s, p.id); if (v > best) best = v; }
    if (best >= T) out.push({ id: p.id, score: +best.toFixed(3), iso: p.iso });
  }
  return out.sort((a, b) => b.score - a.score);
}

async function sheetOf(ids, file, cols = 10, cell = 130) {
  mkdirSync(SHEETS, { recursive: true });
  const rows = Math.ceil(ids.length / cols);
  const tiles = [];
  for (let i = 0; i < ids.length; i++) {
    let buf;
    try { buf = await sharp(src(ids[i]), { failOn: 'none' }).rotate().resize(cell, cell, { fit: 'cover' }).toBuffer(); }
    catch { buf = await sharp({ create: { width: cell, height: cell, channels: 3, background: { r: 60, g: 60, b: 60 } } }).jpeg().toBuffer(); }
    tiles.push({ input: buf, left: (i % cols) * cell, top: Math.floor(i / cols) * cell });
  }
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: { r: 17, g: 17, b: 17 } } })
    .composite(tiles).jpeg({ quality: 70 }).toFile(file);
}

const cmd = process.argv[2];
if (cmd === 'seeds') {
  const seeds = process.argv.slice(3).filter((a) => !a.startsWith('--')).map(Number);
  const T = Number(arg('t', 0.74));
  const m = matches(seeds, T);
  console.log(`${m.length} fotos ≥ ${T}`);
  const sample = m.length <= 60 ? m : Array.from({ length: 60 }, (_, i) => m[Math.round((i * (m.length - 1)) / 59)]);
  await sheetOf(sample.map((x) => x.id), join(SHEETS, `seeds-${seeds[0]}.jpg`));
  console.log(`hoja → ${join(SHEETS, `seeds-${seeds[0]}.jpg`)}`);
  console.log('umbral por percentil:', [0.9, 0.8, 0.7, 0.6].map((q) => `${q}:${m[Math.floor(m.length * (1 - q))]?.score}`).join('  '));
} else if (cmd === 'run') {
  const cfg = JSON.parse(readFileSync(join(OUT_DIR, 'classify-seeds.json'), 'utf8'));
  const classes = {};
  for (const [name, c] of Object.entries(cfg.classes)) {
    const m = matches(c.seeds, c.t);
    classes[name] = { t: c.t, seeds: c.seeds, n: m.length, ids: m.map((x) => x.id) };
    console.log(`${name}: ${m.length} fotos (t=${c.t})`);
    const sample = m.length <= 60 ? m : Array.from({ length: 60 }, (_, i) => m[Math.round((i * (m.length - 1)) / 59)]);
    await sheetOf(sample.map((x) => x.id), join(SHEETS, `class-${name}.jpg`));
  }
  writeFileSync(join(OUT_DIR, 'classes.json'), JSON.stringify(classes, null, 1));
  console.log(`✓ → ${join(OUT_DIR, 'classes.json')}`);
} else {
  console.error('Uso: node scripts/classify.mjs seeds <id>... | run');
}
