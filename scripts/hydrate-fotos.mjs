/**
 * Fuerza la descarga (hidratación) de las FOTOS de iCloud (placeholders → disco),
 * leyendo cada archivo. Salta vídeos. Reanudable (lo ya descargado se lee al instante).
 * Uso: node scripts/hydrate-fotos.mjs "C:\...\iCloud Photos\Photos" [--conc=8]
 */
import { readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const argv = process.argv.slice(2);
const root = argv.find((a) => !a.startsWith('--'));
const CONC = Number((argv.find((a) => a.startsWith('--conc=')) || '--conc=8').split('=')[1]);
const IMG = /\.(jpe?g|png|heic|heif|webp|tiff?)$/i;
if (!root) { console.error('Falta la carpeta'); process.exit(1); }

function walk(dir, acc = []) { for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const f = join(dir, n); const st = statSync(f); if (st.isDirectory()) walk(f, acc); else if (IMG.test(extname(n))) acc.push(f); } return acc; }

const files = walk(root);
console.log(`Fotos a descargar: ${files.length}`);
let done = 0, bytes = 0, errors = 0, i = 0;
const t0 = Date.now();
async function worker() {
  while (i < files.length) {
    const f = files[i++];
    try { const b = await readFile(f); bytes += b.length; }
    catch { errors++; }
    if (++done % 100 === 0 || done === files.length) {
      const gb = (bytes / 1073741824).toFixed(2);
      const secs = (Date.now() - t0) / 1000;
      const rate = (bytes / 1048576 / secs).toFixed(1);
      process.stdout.write(`\r  ${done}/${files.length}  ${gb} GB  ${rate} MB/s  errores:${errors}   `);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
process.stdout.write('\n');
console.log(`✓ Descargadas ${done - errors} fotos (${(bytes / 1073741824).toFixed(2)} GB). Errores: ${errors}`);
