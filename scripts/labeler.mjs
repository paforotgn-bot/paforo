/**
 * UI LOCAL de etiquetado de fotos (no forma parte de la web).
 * Muestra las fotos por bloques/días y tú pones lugar + etiquetas.
 * Al guardar genera src/content/fotos/trips.config.json (fusiona días contiguos).
 *
 * Uso: node scripts/labeler.mjs "C:\ruta\a\fotos" [--gap=5] [--port=4173]
 * Luego abre http://localhost:4173
 */
import { createServer } from 'node:http';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const args = process.argv.slice(2);
const SRC = args.find((a) => !a.startsWith('--'));
const GAP = Number((args.find((a) => a.startsWith('--gap=')) || '--gap=5').split('=')[1]);
const PORT = Number((args.find((a) => a.startsWith('--port=')) || '--port=4173').split('=')[1]);
if (!SRC || !existsSync(SRC)) { console.error('Uso: node scripts/labeler.mjs "<carpeta>"'); process.exit(1); }
mkdirSync(OUT_DIR, { recursive: true });

const IMG = /\.(jpe?g|png|heic|heif|webp|tif|tiff|avif)$/i;
const THUMB_DIR = join(SRC, '_thumbs');
mkdirSync(THUMB_DIR, { recursive: true });
const INDEX_FILE = join(SRC, '_index.json');
const LABELS_FILE = join(OUT_DIR, 'labels.json');
const CONFIG_FILE = join(OUT_DIR, 'trips.config.json');

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const f = join(dir, n); const st = statSync(f); if (st.isDirectory()) walk(f, acc); else if (IMG.test(extname(n))) acc.push(f); }
  return acc;
}
const day = (t) => new Date(t).toISOString().slice(0, 10);
const slug = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'lugar';

// ---- Construir índice (una vez, cacheado) ----
let photos;
if (existsSync(INDEX_FILE)) {
  photos = JSON.parse(readFileSync(INDEX_FILE, 'utf8'));
  console.log(`Índice cacheado: ${photos.length} fotos`);
} else {
  console.log('Leyendo fechas (una vez)...');
  const files = walk(SRC);
  photos = [];
  let i = 0;
  for (const f of files) {
    const ex = await exifr.parse(f, { pick: ['DateTimeOriginal', 'CreateDate'] }).catch(() => null);
    const d = ex?.DateTimeOriginal || ex?.CreateDate;
    const iso = d instanceof Date && !isNaN(d) ? d.toISOString() : statSync(f).mtime.toISOString();
    photos.push({ path: f, iso, noDate: !(d instanceof Date && !isNaN(d)) });
    if (++i % 200 === 0) process.stdout.write(`\r  ${i}/${files.length}`);
  }
  process.stdout.write('\n');
  photos.sort((a, b) => (a.iso < b.iso ? -1 : 1));
  photos.forEach((p, idx) => (p.id = idx));
  writeFileSync(INDEX_FILE, JSON.stringify(photos));
}

// ---- Bloques por salto de fecha ----
const blocks = [];
let cur = null;
for (const p of photos) {
  const t = new Date(p.iso).getTime();
  if (!cur || (t - cur.last) / 86400000 > GAP) { cur = { start: p.iso, end: p.iso, last: t, ids: [] }; blocks.push(cur); }
  else { cur.end = p.iso; cur.last = t; }
  cur.ids.push(p.id);
}
// estructura bloques→días
const struct = blocks.map((b, bi) => {
  const byDay = new Map();
  for (const id of b.ids) { const d = day(photos[id].iso); (byDay.get(d) || byDay.set(d, []).get(d)).push(id); }
  return { i: bi + 1, start: day(b.start), end: day(b.end), count: b.ids.length, days: [...byDay.entries()].map(([date, ids]) => ({ date, ids })) };
});

const loadLabels = () => (existsSync(LABELS_FILE) ? JSON.parse(readFileSync(LABELS_FILE, 'utf8')) : {});

// ---- HTML ----
function html() {
  const labels = loadLabels();
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Etiquetar fotos</title><style>
:root{--bg:#0f1020;--card:#1a1b2e;--tx:#e8e8f0;--mut:#9a9ab0;--acc:#7c5cff}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:var(--bg);color:var(--tx)}
header{position:sticky;top:0;z-index:10;background:#12132a;padding:12px 16px;display:flex;gap:12px;align-items:center;border-bottom:1px solid #2a2b45}
header b{font-size:16px}header .sp{flex:1}
button{background:var(--acc);color:#fff;border:0;padding:10px 16px;border-radius:8px;font-weight:600;cursor:pointer}
.block{margin:18px 12px;background:var(--card);border-radius:12px;padding:14px;border:1px solid #2a2b45}
.bh{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.bh h3{margin:0;font-size:15px}.bh .r{color:var(--mut);font-size:13px}
input{background:#0e0f22;border:1px solid #33344f;color:var(--tx);padding:8px 10px;border-radius:7px;font-size:13px}
.place{width:220px}.tags{width:200px}
.apply{background:#33344f;font-size:12px;padding:6px 10px}
.day{margin:10px 0;padding:10px;background:#141530;border-radius:9px}
.dh{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.dh .d{font-weight:600;font-size:13px}.dh .c{color:var(--mut);font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:6px}
.grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;background:#222;cursor:pointer}
#modal{position:fixed;inset:0;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;z-index:50}
#modal img{max-width:94vw;max-height:94vh;border-radius:8px}
.hint{color:var(--mut);font-size:12px;margin:6px 16px}
</style></head><body>
<header><b>🏷️ Etiquetar fotos</b><span class="r" style="color:var(--mut)">${photos.length} fotos · ${struct.length} bloques</span><span class="sp"></span>
<span id="status" style="color:var(--mut);font-size:13px"></span><button onclick="save()">💾 Guardar</button></header>
<p class="hint">Escribe el <b>Lugar</b> (ej. "San José, Costa Rica") y <b>Etiquetas</b> (ej. "trabajo, conciertos") de cada día. Usa "aplicar a todo el bloque" para rellenar rápido. Click en una foto para verla grande.</p>
<div id="app"></div>
<div id="modal" onclick="this.style.display='none'"><img id="mimg"></div>
<script>
const STRUCT=${JSON.stringify(struct)};const LABELS=${JSON.stringify(labels)};
const app=document.getElementById('app');
function dayInputs(date){const l=LABELS[date]||{};return \`<input class="place" data-date="\${date}" data-k="place" placeholder="Lugar (ciudad, país)" value="\${(l.place||'').replace(/"/g,'&quot;')}"><input class="tags" data-date="\${date}" data-k="tags" placeholder="etiquetas, separadas por coma" value="\${(l.tags||[]).join(', ').replace(/"/g,'&quot;')}">\`}
for(const b of STRUCT){const el=document.createElement('div');el.className='block';
 let days='';for(const d of b.days){days+=\`<div class="day"><div class="dh"><span class="d">\${d.date}</span><span class="c">\${d.ids.length} fotos</span>\${dayInputs(d.date)}</div><div class="grid">\${d.ids.map(id=>\`<img loading="lazy" src="/thumb/\${id}" onclick="big(\${id})">\`).join('')}</div></div>\`}
 el.innerHTML=\`<div class="bh"><h3>Bloque \${b.i}</h3><span class="r">\${b.start} → \${b.end} · \${b.count} fotos</span><input class="place" id="bp\${b.i}" placeholder="Lugar del bloque"><input class="tags" id="bt\${b.i}" placeholder="etiquetas"><button class="apply" onclick="apply(\${b.i},\${JSON.stringify(b.days.map(d=>d.date))})">aplicar a todo el bloque</button></div>\${days}\`;
 app.appendChild(el);}
function apply(i,dates){const p=document.getElementById('bp'+i).value,t=document.getElementById('bt'+i).value;
 document.querySelectorAll('input[data-k=place]').forEach(inp=>{if(dates.includes(inp.dataset.date))inp.value=p});
 document.querySelectorAll('input[data-k=tags]').forEach(inp=>{if(dates.includes(inp.dataset.date))inp.value=t});}
function big(id){document.getElementById('mimg').src='/large/'+id;document.getElementById('modal').style.display='flex';}
async function save(){const out={};document.querySelectorAll('input[data-date]').forEach(inp=>{const d=inp.dataset.date;out[d]=out[d]||{place:'',tags:[]};if(inp.dataset.k==='place')out[d].place=inp.value.trim();else out[d].tags=inp.value.split(',').map(s=>s.trim()).filter(Boolean);});
 document.getElementById('status').textContent='Guardando...';
 const r=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(out)});const j=await r.json();
 document.getElementById('status').textContent='✅ '+j.trips+' viajes guardados';}
</script></body></html>`;
}

// ---- Server ----
createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); return res.end(html()); }
  if (u.pathname.startsWith('/thumb/') || u.pathname.startsWith('/large/')) {
    const big = u.pathname.startsWith('/large/');
    const id = Number(u.pathname.split('/')[2]);
    const p = photos[id]; if (!p) { res.statusCode = 404; return res.end(); }
    const cache = join(THUMB_DIR, `${id}${big ? '_l' : ''}.webp`);
    try {
      let buf;
      if (existsSync(cache)) buf = readFileSync(cache);
      else { buf = await sharp(p.path, { failOn: 'none' }).rotate().resize(big ? 1400 : 200, big ? 1400 : 200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: big ? 82 : 65 }).toBuffer(); writeFileSync(cache, buf); }
      res.setHeader('content-type', 'image/webp'); res.setHeader('cache-control', 'max-age=86400'); return res.end(buf);
    } catch { res.statusCode = 500; return res.end(); }
  }
  if (u.pathname === '/save' && req.method === 'POST') {
    let body = ''; for await (const c of req) body += c;
    const dayLabels = JSON.parse(body);
    writeFileSync(LABELS_FILE, JSON.stringify(dayLabels, null, 2));
    // fusionar días contiguos con mismo (place,tags) → viajes
    const dates = Object.keys(dayLabels).filter((d) => dayLabels[d].place).sort();
    const norm = (d) => `${dayLabels[d].place}||${(dayLabels[d].tags || []).join(',')}`;
    const trips = []; let curT = null;
    for (const d of dates) {
      if (curT && norm(d) === curT._norm && (new Date(d) - new Date(curT.end)) / 86400000 <= 20) { curT.end = d; }
      else { curT = { place: dayLabels[d].place, tags: dayLabels[d].tags || [], start: d, end: d, _norm: norm(d) }; trips.push(curT); }
    }
    const counts = {};
    const out = trips.map((t) => { const id = slug(t.place); counts[id] = (counts[id] || 0) + 1; return { id: counts[id] > 1 ? `${id}-${counts[id]}` : id, name: t.place, place: t.place, start: t.start, end: t.end, tags: t.tags }; });
    writeFileSync(CONFIG_FILE, JSON.stringify(out, null, 2));
    console.log(`Guardado: ${out.length} viajes → ${CONFIG_FILE}`);
    res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ ok: true, trips: out.length }));
  }
  res.statusCode = 404; res.end();
}).listen(PORT, () => console.log(`\n🏷️  Etiquetador en  http://localhost:${PORT}\n`));
