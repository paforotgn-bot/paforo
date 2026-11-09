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
const files = walk(root).slice(0, 6);
for (const f of files) {
  const all = await exifr.parse(f, true).catch((e) => ({ err: e.message }));
  const keys = all ? Object.keys(all) : [];
  console.log('\n=== ' + f.split(/[\\/]/).pop() + ' ===');
  console.log('  nº campos EXIF:', keys.length);
  if (all) {
    console.log('  fecha:', all.DateTimeOriginal || all.CreateDate || all.ModifyDate || '—');
    console.log('  GPS:', all.latitude ?? '—', all.longitude ?? '—');
    console.log('  cámara:', all.Make || '—', all.Model || '—');
    console.log('  software:', all.Software || '—');
    if (keys.length) console.log('  claves:', keys.slice(0, 25).join(', '));
  }
}
