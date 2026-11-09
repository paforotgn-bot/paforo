/**
 * Propone AGRUPACIONES por saltos de fecha (sin subir nada).
 * Uso: node scripts/propose-grupos.mjs <carpeta> [--gap=DIAS] [--days]
 *   --gap=DIAS  corta un bloque nuevo si pasan más de N días sin fotos (def. 5)
 *   --days      además muestra el desglose por día dentro de cada bloque
 */
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import exifr from 'exifr';

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) || 'C:/Users/pafor/Pictures/import-icloud';
const GAP = Number((args.find((a) => a.startsWith('--gap=')) || '--gap=5').split('=')[1]);
const SHOW_DAYS = args.includes('--days');
const IMG = /\.(jpe?g|png|heic|heif|webp|tif|tiff|avif)$/i;

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const f = join(dir, n); const st = statSync(f); if (st.isDirectory()) walk(f, acc); else if (IMG.test(extname(n))) acc.push(f); }
  return acc;
}
const files = walk(root);
const dated = [];
let undated = 0, i = 0;
for (const f of files) {
  const ex = await exifr.parse(f, { pick: ['DateTimeOriginal', 'CreateDate'] }).catch(() => null);
  const d = ex?.DateTimeOriginal || ex?.CreateDate;
  if (d instanceof Date && !isNaN(d)) dated.push({ f, t: d.getTime(), iso: d.toISOString() });
  else undated++;
  if (++i % 200 === 0) process.stdout.write(`\r  leyendo ${i}/${files.length}`);
}
process.stdout.write('\n');
dated.sort((a, b) => a.t - b.t);

const day = (t) => new Date(t).toISOString().slice(0, 10);
const groups = [];
let cur = null;
for (const p of dated) {
  if (!cur || (p.t - cur.last) / 86400000 > GAP) { cur = { start: p.t, end: p.t, last: p.t, items: [p] }; groups.push(cur); }
  else { cur.end = p.t; cur.last = p.t; cur.items.push(p); }
}
console.log(`\n${files.length} imágenes · ${dated.length} con fecha · ${undated} sin fecha`);
console.log(`${groups.length} bloques (gap ${GAP} días):\n`);
groups.forEach((g, idx) => {
  const days = Math.round((g.end - g.start) / 86400000) + 1;
  console.log(`#${String(idx + 1).padStart(2)}  ${day(g.start)} → ${day(g.end)}  (${days}d)  ${String(g.items.length).padStart(4)} fotos`);
  if (SHOW_DAYS) {
    const byDay = new Map();
    for (const it of g.items) byDay.set(day(it.t), (byDay.get(day(it.t)) || 0) + 1);
    for (const [d, n] of [...byDay].sort()) console.log(`        ${d}: ${n}`);
  }
});
