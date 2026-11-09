/**
 * CLASIFICADOR de fotos (local). 3 vistas:
 *  - 1 a 1: ves una foto, pulsas número → álbum (o sub-álbum 1.2).
 *  - Cuadrícula: multiselección → asignar muchas / papelera.
 *  - Duplicados: agrupa casi-iguales (perceptual hash) y propone dejar 2-3.
 * Autoguarda en src/content/fotos/sorter-state.json.
 * Uso: node scripts/sorter.mjs "C:\ruta" [--port=4173]
 */
import { createServer } from 'node:http';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import exifr from 'exifr';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const args = process.argv.slice(2);
const SRC = args.find((a) => !a.startsWith('--'));
const PORT = Number((args.find((a) => a.startsWith('--port=')) || '--port=4173').split('=')[1]);
if (!SRC || !existsSync(SRC)) { console.error('Uso: node scripts/sorter.mjs "<carpeta>"'); process.exit(1); }
mkdirSync(OUT_DIR, { recursive: true });

const IMG = /\.(jpe?g|png|heic|heif|webp|tif|tiff|avif)$/i;
const CACHE_DIR = join(process.env.USERPROFILE || ROOT, '.fotos-organizer', createHash('sha1').update(SRC).digest('hex').slice(0, 10));
const THUMB_DIR = join(CACHE_DIR, '_thumbs'); mkdirSync(THUMB_DIR, { recursive: true });
const INDEX_FILE = join(CACHE_DIR, '_index.json');
const HASH_FILE = join(CACHE_DIR, '_hashes.json');
const STATE_FILE = join(OUT_DIR, 'sorter-state.json');

function walk(dir, acc = []) { for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const f = join(dir, n); const st = statSync(f); if (st.isDirectory()) walk(f, acc); else if (IMG.test(extname(n))) acc.push(f); } return acc; }

// ---- Índice ----
let photos;
if (existsSync(INDEX_FILE)) { photos = JSON.parse(readFileSync(INDEX_FILE, 'utf8')); }
else {
  console.log('Leyendo fechas (una vez)...');
  const files = walk(SRC); photos = []; let i = 0;
  for (const f of files) { const ex = await exifr.parse(f, { pick: ['DateTimeOriginal', 'CreateDate'] }).catch(() => null); const d = ex?.DateTimeOriginal || ex?.CreateDate; const iso = d instanceof Date && !isNaN(d) ? d.toISOString() : statSync(f).mtime.toISOString(); photos.push({ path: f, iso }); if (++i % 200 === 0) process.stdout.write(`\r  ${i}/${files.length}`); }
  process.stdout.write('\n'); photos.sort((a, b) => (a.iso < b.iso ? -1 : 1)); photos.forEach((p, idx) => (p.id = idx)); writeFileSync(INDEX_FILE, JSON.stringify(photos));
}
console.log(`${photos.length} fotos`);

// ---- Estado ----
let state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : { albums: [], assign: {}, cursor: 0 };
const persist = () => writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
persist();

// ---- Perceptual hash (dHash 64 bits) en segundo plano ----
let hashes = existsSync(HASH_FILE) ? JSON.parse(readFileSync(HASH_FILE, 'utf8')) : {};
let hashDone = Object.keys(hashes).length, hashTotal = photos.length;
async function dhash(path) {
  const { data } = await sharp(path, { failOn: 'none' }).rotate().greyscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  let bits = '';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const i = y * 9 + x; bits += data[i] > data[i + 1] ? '1' : '0'; }
  let hex = ''; for (let i = 0; i < 64; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex;
}
async function computeHashes() {
  const todo = photos.filter((p) => !hashes[p.id]);
  if (!todo.length) { hashDone = photos.length; return; }
  console.log(`Calculando huellas de ${todo.length} fotos (para duplicados)...`);
  let i = 0; const CONC = 6;
  const worker = async () => { while (i < todo.length) { const p = todo[i++]; try { hashes[p.id] = await dhash(p.path); } catch { hashes[p.id] = null; } hashDone++; if (hashDone % 200 === 0) { writeFileSync(HASH_FILE, JSON.stringify(hashes)); } } };
  await Promise.all(Array.from({ length: CONC }, worker));
  writeFileSync(HASH_FILE, JSON.stringify(hashes));
  console.log('Huellas listas.');
}
computeHashes();

const hx = '0123456789abcdef';
const POP = Array.from({ length: 16 }, (_, i) => (i.toString(2).match(/1/g) || []).length);
function hamming(a, b) { if (!a || !b) return 99; let d = 0; for (let i = 0; i < 16; i++) d += POP[hx.indexOf(a[i]) ^ hx.indexOf(b[i])]; return d; }

function dupeGroups() {
  const withH = photos.filter((p) => hashes[p.id]).sort((a, b) => (a.iso < b.iso ? -1 : 1));
  const groups = []; let cur = null;
  for (const p of withH) {
    if (state.assign[p.path] === 'trash') continue;
    if (cur) {
      const last = cur[cur.length - 1];
      const gap = (new Date(p.iso) - new Date(last.iso)) / 1000;
      if (gap <= 180 && hamming(hashes[p.id], hashes[last.id]) <= 12) { cur.push(p); continue; }
    }
    if (cur && cur.length >= 4) groups.push(cur);
    cur = [p];
  }
  if (cur && cur.length >= 4) groups.push(cur);
  // sugerir conservar 3 (primera, media, última)
  return groups.map((g) => {
    const keepIdx = new Set([0, Math.floor(g.length / 2), g.length - 1]);
    return { ids: g.map((p) => p.id), keep: g.map((_, i) => keepIdx.has(i)) };
  });
}

function clientState() {
  return { total: photos.length, cursor: state.cursor, albums: state.albums, assignedCount: Object.keys(state.assign).length,
    photos: photos.map((p) => ({ id: p.id, iso: p.iso, code: state.assign[p.path] || null })) };
}

const PAGE = readFileSync(new URL('./sorter.html', import.meta.url), 'utf8').replace(/__PORT__/g, PORT);

createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); return res.end(PAGE); }
  if (u.pathname === '/state.json') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(clientState())); }
  if (u.pathname === '/hash-progress') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ done: hashDone, total: hashTotal })); }
  if (u.pathname === '/dupes.json') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ ready: hashDone >= hashTotal, done: hashDone, total: hashTotal, groups: hashDone >= hashTotal ? dupeGroups() : [] })); }
  if (u.pathname.startsWith('/thumb/') || u.pathname.startsWith('/large/')) {
    const big = u.pathname.startsWith('/large/'); const id = Number(u.pathname.split('/')[2]); const p = photos[id];
    if (!p) { res.statusCode = 404; return res.end(); }
    const cache = join(THUMB_DIR, `${id}${big ? '_l' : ''}.webp`);
    try { let buf; if (existsSync(cache)) buf = readFileSync(cache); else { buf = await sharp(p.path, { failOn: 'none' }).rotate().resize(big ? 1600 : 220, big ? 1600 : 220, { fit: 'inside', withoutEnlargement: true }).webp({ quality: big ? 82 : 62 }).toBuffer(); writeFileSync(cache, buf); }
      res.setHeader('content-type', 'image/webp'); res.setHeader('cache-control', 'max-age=604800'); return res.end(buf); }
    catch { res.statusCode = 500; return res.end(); }
  }
  if (u.pathname === '/op' && req.method === 'POST') {
    let body = ''; for await (const c of req) body += c; const o = JSON.parse(body);
    if (o.action === 'assign') { const p = photos[o.id]; if (p) { if (o.code === '') delete state.assign[p.path]; else state.assign[p.path] = o.code; } if (typeof o.cursor === 'number') state.cursor = o.cursor; }
    else if (o.action === 'assignMany') { for (const id of o.ids) { const p = photos[id]; if (p) { if (o.code === '') delete state.assign[p.path]; else state.assign[p.path] = o.code; } } }
    else if (o.action === 'cursor') { state.cursor = o.cursor; }
    else if (o.action === 'newAlbum') { const n = (state.albums.at(-1)?.n || 0) + 1; state.albums.push({ n, name: o.name, subs: [] }); }
    else if (o.action === 'newSub') { const al = state.albums.find((x) => x.n === o.n); if (al) { const sn = (al.subs.at(-1)?.n || 0) + 1; al.subs.push({ n: sn, name: o.name }); } }
    persist(); res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ ok: true, albums: state.albums }));
  }
  res.statusCode = 404; res.end();
}).listen(PORT, () => console.log(`\n⚡ Clasificador en  http://localhost:${PORT}\n`));
