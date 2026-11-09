/**
 * Encuentra escenas RECURRENTES: fotos muy parecidas entre sí repartidas por
 * muchos días distintos (el espejo del baño, el escritorio con papeles…).
 * Sirve para separar "gimnasio/progreso" y "papeleo" del resto.
 *
 *   node scripts/recurring.mjs [--t=0.78] [--min=5] [--days=3]
 *   node scripts/recurring.mjs sheet <n>   → hoja del grupo n
 *
 * Salida: src/content/fotos/recurring.json
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
const OUT = join(OUT_DIR, 'recurring.json');

const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
const FEAT = JSON.parse(readFileSync(join(CACHE, '_feat.json'), 'utf8'));
const byId = new Map(photos.map((p) => [p.id, p]));
const thumb = (id, big) => join(THUMBS, `${id}${big ? '_l' : ''}.webp`);
const src = (id) => (existsSync(thumb(id, true)) ? thumb(id, true) : existsSync(thumb(id, false)) ? thumb(id, false) : byId.get(id).path);
const arg = (n, d) => { const a = process.argv.find((x) => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : d; };

if (process.argv[2] === 'sheet') {
  const data = JSON.parse(readFileSync(OUT, 'utf8'));
  const g = data.groups[Number(process.argv[3]) - 1];
  if (!g) { console.error('no existe'); process.exit(1); }
  mkdirSync(SHEETS, { recursive: true });
  const COLS = 8, CELL = 150;
  const ids = g.ids.length <= 24 ? g.ids : Array.from({ length: 24 }, (_, i) => g.ids[Math.round((i * (g.ids.length - 1)) / 23)]);
  const tiles = [];
  for (let i = 0; i < ids.length; i++) {
    let buf;
    try { buf = await sharp(src(ids[i]), { failOn: 'none' }).rotate().resize(CELL, CELL, { fit: 'cover' }).toBuffer(); }
    catch { buf = await sharp({ create: { width: CELL, height: CELL, channels: 3, background: { r: 60, g: 60, b: 60 } } }).jpeg().toBuffer(); }
    tiles.push({ input: buf, left: (i % COLS) * CELL, top: Math.floor(i / COLS) * CELL });
  }
  const file = join(SHEETS, `rec${String(process.argv[3]).padStart(2, '0')}.jpg`);
  await sharp({ create: { width: COLS * CELL, height: Math.ceil(ids.length / COLS) * CELL, channels: 3, background: { r: 17, g: 17, b: 17 } } })
    .composite(tiles).jpeg({ quality: 72 }).toFile(file);
  console.log(`✓ grupo ${process.argv[3]}: ${g.n} fotos, ${g.days} días → ${file}`);
} else {
  const T = Number(arg('t', 0.78));
  const MIN = Number(arg('min', 5));
  const MIN_DAYS = Number(arg('days', 3));

  const items = photos
    .filter((p) => FEAT[p.id])
    .map((p) => ({ id: p.id, day: p.iso.slice(0, 10), f: FEAT[p.id] }));
  console.log(`comparando ${items.length} fotos…`);

  // agrupación voraz por líder: cada foto se une al primer líder parecido
  const leaders = [];
  for (const it of items) {
    let best = null, bestScore = T;
    for (const L of leaders) {
      const h = histSim(L.f.h, it.f.h);
      if (h < 0.6) continue;                       // descarte rápido por color
      const s = 0.5 * h + 0.5 * structSim(L.f.g, it.f.g);
      if (s >= bestScore) { bestScore = s; best = L; }
    }
    if (best) { best.ids.push(it.id); best.days.add(it.day); }
    else leaders.push({ f: it.f, ids: [it.id], days: new Set([it.day]) });
  }

  const groups = leaders
    .map((L) => ({ n: L.ids.length, days: L.days.size, from: [...L.days].sort()[0], to: [...L.days].sort().at(-1), ids: L.ids }))
    .filter((g) => g.n >= MIN && g.days >= MIN_DAYS)
    .sort((a, b) => b.n - a.n);

  writeFileSync(OUT, JSON.stringify({ params: { T, MIN, MIN_DAYS }, groups }, null, 1));
  console.log(`escenas recurrentes: ${groups.length} (${groups.reduce((a, g) => a + g.n, 0)} fotos)`);
  groups.forEach((g, i) => console.log(` ${String(i + 1).padStart(3)}  ${String(g.n).padStart(4)} fotos  ${String(g.days).padStart(3)} días  ${g.from} → ${g.to}`));
}
