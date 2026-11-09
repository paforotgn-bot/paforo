/**
 * Escaneo de metadatos de las fotos del índice de la caché del organizer.
 * Cachea en <CACHE>/_meta.json: { id: {w,h,make,model,soft,gps,bytes,ext} }
 * Uso: node scripts/meta-scan.mjs [--conc=8]
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import exifr from 'exifr';

const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const INDEX = join(CACHE, '_index.json');
const OUT = join(CACHE, '_meta.json');
const CONC = Number((process.argv.find((a) => a.startsWith('--conc=')) || '--conc=8').split('=')[1]);

const photos = JSON.parse(readFileSync(INDEX, 'utf8'));
const meta = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const todo = photos.filter((p) => meta[p.id] === undefined);
console.log(`total ${photos.length} · pendientes ${todo.length}`);

let i = 0, done = 0;
async function worker() {
  while (i < todo.length) {
    const p = todo[i++];
    let m = { ext: extname(p.path).toLowerCase().replace('.', '') };
    try { m.bytes = statSync(p.path).size; } catch { m.bytes = 0; }
    try {
      const ex = await exifr.parse(p.path, {
        gps: true,
        pick: ['Make', 'Model', 'Software', 'latitude', 'longitude', 'ExifImageWidth', 'ExifImageHeight', 'PixelXDimension', 'PixelYDimension', 'Orientation', 'LensModel'],
      });
      if (ex) {
        m.w = ex.ExifImageWidth || ex.PixelXDimension || null;
        m.h = ex.ExifImageHeight || ex.PixelYDimension || null;
        m.make = ex.Make || null;
        m.model = ex.Model || null;
        m.soft = ex.Software || null;
        m.lens = ex.LensModel || null;
        if (typeof ex.latitude === 'number') m.gps = [Number(ex.latitude.toFixed(5)), Number(ex.longitude.toFixed(5))];
      }
    } catch { /* sin exif */ }
    meta[p.id] = m;
    if (++done % 250 === 0) { writeFileSync(OUT, JSON.stringify(meta)); process.stdout.write(`\r  ${done}/${todo.length}`); }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
writeFileSync(OUT, JSON.stringify(meta));
console.log(`\n✓ metadatos de ${Object.keys(meta).length} fotos → ${OUT}`);
