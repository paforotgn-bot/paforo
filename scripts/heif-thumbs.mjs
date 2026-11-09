/**
 * Genera miniaturas para los .heif que sharp no sabe decodificar (falta el códec),
 * usando ffmpeg como decodificador. Así esas fotos entran en la curación.
 * Uso: node scripts/heif-thumbs.mjs
 */
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const THUMBS = join(CACHE, '_thumbs');
const TMP = join(tmpdir(), 'heif-thumbs');
mkdirSync(TMP, { recursive: true });

const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
const targets = photos.filter((p) => /\.heic|\.heif$/i.test(p.path) && !existsSync(join(THUMBS, `${p.id}.webp`)));
console.log(`heif sin miniatura: ${targets.length}`);

let ok = 0, fail = 0;
for (const p of targets) {
  const tmp = join(TMP, `${p.id}.jpg`);
  try {
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', p.path, '-frames:v', '1', '-y', tmp], { stdio: 'pipe' });
    await sharp(tmp).rotate().resize(190, 190, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 62 }).toFile(join(THUMBS, `${p.id}.webp`));
    await sharp(tmp).rotate().resize(1400, 1400, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(THUMBS, `${p.id}_l.webp`));
    ok++;
  } catch (e) {
    fail++;
  }
  process.stdout.write(`\r  ${ok + fail}/${targets.length}`);
}
rmSync(TMP, { recursive: true, force: true });
console.log(`\n✓ miniaturas heif: ${ok} ok · ${fail} fallidas`);
