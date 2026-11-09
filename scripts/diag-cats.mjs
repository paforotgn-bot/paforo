import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import exifr from 'exifr';

const root = process.argv[2];
function walk(dir, acc = []) { for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const f = join(dir, n); const st = statSync(f); if (st.isDirectory()) walk(f, acc); else acc.push(f); } return acc; }
const files = walk(root);
const cat = { camera: 0, cameraGps: 0, instagram: 0, screenshot: 0, whatsapp: 0, other: 0 };
const ext = {};
let i = 0;
for (const f of files) {
  const e = extname(f).toLowerCase(); ext[e] = (ext[e] || 0) + 1;
  if (!/\.(jpe?g|png|heic|heif|webp|tiff?)$/i.test(e)) continue;
  const ex = await exifr.parse(f, { gps: true, pick: ['latitude', 'longitude', 'Make', 'Software'] }).catch(() => null);
  const make = ex?.Make || '';
  const sw = ex?.Software || '';
  const hasGps = typeof ex?.latitude === 'number';
  if (/instagram/i.test(sw)) cat.instagram++;
  else if (/whatsapp/i.test(sw) || /whatsapp/i.test(f)) cat.whatsapp++;
  else if (e === '.png') cat.screenshot++;
  else if (/apple/i.test(make)) { cat.camera++; if (hasGps) cat.cameraGps++; }
  else cat.other++;
  if (++i % 200 === 0) process.stdout.write(`\r  ${i}`);
}
process.stdout.write('\n');
console.log('Extensiones:', JSON.stringify(ext));
console.log('\n--- Categorías ---');
console.log(`Originales de cámara (Apple): ${cat.camera}  ← de estas, con GPS: ${cat.cameraGps}`);
console.log(`Instagram:                    ${cat.instagram}`);
console.log(`Capturas (PNG):               ${cat.screenshot}`);
console.log(`WhatsApp:                     ${cat.whatsapp}`);
console.log(`Otras:                        ${cat.other}`);
