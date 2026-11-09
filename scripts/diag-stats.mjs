import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import exifr from 'exifr';

const root = process.argv[2] || 'C:/Users/pafor/Pictures/import-icloud';
function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    if (n.startsWith('.') || n.startsWith('_')) continue;
    const full = join(dir, n);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (/\.(jpe?g|png|heic|heif)$/i.test(extname(n))) acc.push(full);
  }
  return acc;
}
const files = walk(root);
let withDate = 0, withGps = 0, insta = 0, noMeta = 0;
const months = new Map();
let i = 0;
for (const f of files) {
  const ex = await exifr.parse(f, { gps: true, pick: ['DateTimeOriginal', 'CreateDate', 'latitude', 'longitude', 'Software', 'Make'] }).catch(() => null);
  const d = ex?.DateTimeOriginal || ex?.CreateDate;
  if (d instanceof Date && !isNaN(d)) { withDate++; const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; months.set(key, (months.get(key) || 0) + 1); }
  if (typeof ex?.latitude === 'number') withGps++;
  if (/instagram/i.test(ex?.Software || '')) insta++;
  if (!ex || Object.keys(ex).length === 0 || (!d && !ex?.Make)) noMeta++;
  if (++i % 200 === 0) process.stdout.write(`\r  ${i}/${files.length}`);
}
process.stdout.write('\n');
console.log(`Total imágenes:     ${files.length}`);
console.log(`Con fecha real:     ${withDate}`);
console.log(`Con GPS:            ${withGps}`);
console.log(`Marcadas Instagram: ${insta}`);
console.log(`Sin metadatos útiles: ${noMeta}`);
console.log('\n--- Fotos por mes (con fecha) ---');
for (const [m, n] of [...months.entries()].sort()) console.log(`  ${m}: ${String(n).padStart(4)}  ${'█'.repeat(Math.ceil(n / 5))}`);
