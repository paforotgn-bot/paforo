/**
 * Borra los archivos listados en src/content/fotos/borrar.json (capturas de
 * pantalla y papeleo). OJO: la carpeta está sincronizada con iCloud, así que
 * también desaparecen de la fototeca de iCloud.
 *
 *   node scripts/borrar.mjs --dry     → solo listar
 *   node scripts/borrar.mjs --go      → borrar de verdad
 *
 * Antes de borrar comprueba que ninguna de esas fotos esté en un álbum.
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const GO = process.argv.includes('--go');

const lista = JSON.parse(readFileSync(join(OUT_DIR, 'borrar.json'), 'utf8'));
const albums = JSON.parse(readFileSync(join(OUT_DIR, 'albums.json'), 'utf8'));

const enAlbum = new Set();
for (const a of [...albums.albums, ...albums.trabajo]) for (const id of a.ids) enAlbum.add(id);
const choque = lista.fotos.filter((f) => enAlbum.has(f.id));
if (choque.length) {
  console.error(`ABORTADO: ${choque.length} fotos de la lista están en un álbum.`);
  process.exit(1);
}

let ok = 0, faltan = 0, errores = 0, bytes = 0;
const log = [];
for (const f of lista.fotos) {
  if (!existsSync(f.path)) { faltan++; continue; }
  const size = statSync(f.path).size;
  if (!GO) { bytes += size; ok++; continue; }
  try { unlinkSync(f.path); ok++; bytes += size; log.push(f.path); }
  catch (e) { errores++; console.error(`  no se pudo borrar ${f.path}: ${e.code}`); }
}

const mb = (bytes / 1048576).toFixed(1);
if (!GO) {
  console.log(`[simulación] se borrarían ${ok} archivos (${mb} MB). Ya no estaban: ${faltan}.`);
  console.log('Para ejecutarlo: node scripts/borrar.mjs --go');
} else {
  writeFileSync(join(OUT_DIR, 'borradas.log'), log.join('\n') + '\n');
  console.log(`✓ borrados ${ok} archivos (${mb} MB) · ya no estaban: ${faltan} · errores: ${errores}`);
  console.log(`registro → ${join(OUT_DIR, 'borradas.log')}`);
}
