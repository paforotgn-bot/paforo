/**
 * Normaliza los logos de cliente para la banda del hero.
 *
 * Los deja todos a la misma altura en public/images/logos/marquee/, que es
 * lo único que hace que una fila de logos no parezca un cajón de sastre:
 * vienen a tamaños de 262x49 a 3570x1774.
 *
 *   node scripts/import-logos.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/images/logos';
const OUT = 'public/images/logos/marquee';
const HEIGHT = 96; // 2x de los 48px a los que se ven

/**
 * Ninguno se descarta por color: la web los pinta de blanco plano con
 * `brightness(0) invert(1)`, que conserva el alfa. Así entran igual los
 * logos negros (Ticket[in]) que los de color (Oravia).
 */
const SKIP = new Set();

await fs.mkdir(OUT, { recursive: true });

const files = (await fs.readdir(SRC)).filter(
  (f) => /\.(png|jpe?g|webp)$/i.test(f) && !SKIP.has(f)
);

const manifest = [];
for (const file of files) {
  const slug = file.replace(/\.[^.]+$/, '');
  const target = path.join(OUT, `${slug}.webp`);

  await sharp(path.join(SRC, file))
    .resize({ height: HEIGHT, fit: 'inside', withoutEnlargement: false })
    .webp({ quality: 90 })
    .toFile(target);

  const { width, height } = await sharp(target).metadata();
  manifest.push({ slug, src: `${slug}.webp`, w: width, h: height });
  console.log(`${slug.padEnd(14)} ${width}x${height}`);
}

await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} logos listos.`);
