import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('C:/Users/pafor/proyectos/agencia/proto/img', { recursive: true });
const map = [
  ['quiksilver', 'C:/Users/pafor/OneDrive/Escritorio/1.png'],
  ['twojeys',    'C:/Users/pafor/OneDrive/Escritorio/2.png'],
  ['nowaltz',    'C:/Users/pafor/OneDrive/Escritorio/11.png'],
  ['delito',     'C:/Users/pafor/OneDrive/Escritorio/6.png'],
  ['venom',      'C:/Users/pafor/OneDrive/Escritorio/22.png'],
  ['skeels',     'C:/Users/pafor/Downloads/packaging-front.webp'],
  ['limboo',     'C:/Users/pafor/OneDrive/Escritorio/limboo - copia.png'],
  ['rodaventura','C:/Users/pafor/Downloads/gallery-4.webp'],
  ['sanros',     'C:/Users/pafor/Downloads/WhatsApp Image 2026-10-07 at 14.48.48.jpeg'],
  ['fontanet',   'C:/Users/pafor/OneDrive/Escritorio/fontanettgn - copia.avif'],
  ['marca-n',    'C:/Users/pafor/Downloads/077.jpg'],
  ['aerea',      'C:/Users/pafor/OneDrive/Escritorio/THUMBNAIL.png'],
];
for (const [name, src] of map) {
  await sharp(src, { failOn: 'none' }).rotate()
    .resize(1100, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 }).toFile(`C:/Users/pafor/proyectos/agencia/proto/img/${name}.webp`);
  process.stdout.write(`${name} `);
}
console.log('\n✓ imágenes listas');
