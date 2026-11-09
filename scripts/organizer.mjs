/**
 * ORGANIZADOR visual local (no forma parte de la web).
 * Arrastra fotos a álbumes, bórralas fácil, crea/renombra álbumes.
 * Autoguarda en src/content/fotos/organizer-state.json (por ruta de archivo).
 *
 * Uso: node scripts/organizer.mjs "C:\ruta\a\fotos" [--port=4173]
 * Abre http://localhost:4173
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
const GAP = 5;
if (!SRC || !existsSync(SRC)) { console.error('Uso: node scripts/organizer.mjs "<carpeta>"'); process.exit(1); }
mkdirSync(OUT_DIR, { recursive: true });

const IMG = /\.(jpe?g|png|heic|heif|webp|tif|tiff|avif)$/i;
// Caché FUERA de la carpeta origen (para no tocar carpetas de iCloud/OneDrive)
const CACHE_DIR = join(process.env.USERPROFILE || ROOT, '.fotos-organizer', createHash('sha1').update(SRC).digest('hex').slice(0, 10));
const THUMB_DIR = join(CACHE_DIR, '_thumbs'); mkdirSync(THUMB_DIR, { recursive: true });
const INDEX_FILE = join(CACHE_DIR, '_index.json');
const LABELS_FILE = join(OUT_DIR, 'labels.json');
const STATE_FILE = join(OUT_DIR, 'organizer-state.json');

function walk(dir, acc = []) { for (const n of readdirSync(dir)) { if (n.startsWith('.') || n.startsWith('_')) continue; const f = join(dir, n); const st = statSync(f); if (st.isDirectory()) walk(f, acc); else if (IMG.test(extname(n))) acc.push(f); } return acc; }
const dayStr = (iso) => iso.slice(0, 10);

// ---- Índice de fotos (cacheado) ----
let photos;
if (existsSync(INDEX_FILE)) { photos = JSON.parse(readFileSync(INDEX_FILE, 'utf8')); }
else {
  console.log('Leyendo fechas (una vez)...');
  const files = walk(SRC); photos = []; let i = 0;
  for (const f of files) { const ex = await exifr.parse(f, { pick: ['DateTimeOriginal', 'CreateDate'] }).catch(() => null); const d = ex?.DateTimeOriginal || ex?.CreateDate; const iso = d instanceof Date && !isNaN(d) ? d.toISOString() : statSync(f).mtime.toISOString(); photos.push({ path: f, iso, noDate: !(d instanceof Date && !isNaN(d)) }); if (++i % 200 === 0) process.stdout.write(`\r  ${i}/${files.length}`); }
  process.stdout.write('\n'); photos.sort((a, b) => (a.iso < b.iso ? -1 : 1)); photos.forEach((p, idx) => (p.id = idx)); writeFileSync(INDEX_FILE, JSON.stringify(photos));
}
console.log(`${photos.length} fotos`);
const byPath = new Map(photos.map((p) => [p.path, p]));

// ---- Estado (autoguardado) ----
// state = { places:[{name,tags}], assign:{path:placeName|null}, deleted:[path] }
let state;
if (existsSync(STATE_FILE)) { state = JSON.parse(readFileSync(STATE_FILE, 'utf8')); }
else {
  // migrar desde labels.json (por día)
  state = { places: [], assign: {}, deleted: [] };
  const labels = existsSync(LABELS_FILE) ? JSON.parse(readFileSync(LABELS_FILE, 'utf8')) : {};
  const placeMap = new Map();
  for (const p of photos) {
    const lab = labels[dayStr(p.iso)];
    if (lab?.place) {
      if (/^\s*eliminar\s*$/i.test(lab.place)) { state.deleted.push(p.path); continue; }
      if (!placeMap.has(lab.place)) placeMap.set(lab.place, { name: lab.place, tags: lab.tags || [] });
      state.assign[p.path] = lab.place;
    }
  }
  state.places = [...placeMap.values()];
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(`Migrado desde labels.json: ${state.places.length} álbumes, ${state.deleted.length} en papelera`);
}
const persist = () => writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

function clientState() {
  const del = new Set(state.deleted);
  return {
    places: state.places,
    photos: photos.map((p) => ({ id: p.id, iso: p.iso, noDate: p.noDate, place: del.has(p.path) ? '__trash' : (state.assign[p.path] || null) })),
  };
}

// ---- HTML ----
const PAGE = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Organizar fotos</title>
<style>
:root{--bg:#0f1020;--card:#1a1b2e;--tx:#e8e8f0;--mut:#9a9ab0;--acc:#7c5cff;--dnd:#2b8a5b}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:var(--bg);color:var(--tx)}
header{position:sticky;top:0;z-index:20;background:#12132a;padding:10px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2b45}
header b{font-size:15px}.sp{flex:1}.mut{color:var(--mut);font-size:13px}
button{background:var(--acc);color:#fff;border:0;padding:8px 12px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px}
button.g{background:#33344f}input{background:#0e0f22;border:1px solid #33344f;color:var(--tx);padding:8px 10px;border-radius:7px;font-size:13px}
#trash{background:#3a1e28;border:1px dashed #7a3b4b;color:#f0b8c4}
.wrap{padding:12px}
.album{margin:12px 0;background:var(--card);border:1px solid #2a2b45;border-radius:12px;padding:10px}
.album.drop{outline:2px solid var(--dnd);outline-offset:2px}
.ah{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.ah .nm{font-weight:700;font-size:14px;background:transparent;border:0;color:var(--tx);width:auto;min-width:120px}
.ah .cnt{color:var(--mut);font-size:12px}.ah .tg{width:180px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:5px;min-height:40px}
.tile{position:relative;aspect-ratio:1;border-radius:6px;overflow:hidden;cursor:grab;background:#222}
.tile img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.tile.sel{outline:3px solid var(--acc);outline-offset:-3px}
.tile .x{position:absolute;top:2px;right:2px;background:rgba(0,0,0,.6);color:#fff;border-radius:50%;width:20px;height:20px;font-size:13px;line-height:20px;text-align:center;opacity:0;cursor:pointer}
.tile:hover .x{opacity:1}
#modal{position:fixed;inset:0;background:rgba(0,0,0,.92);display:none;align-items:center;justify-content:center;z-index:50}#modal img{max-width:94vw;max-height:94vh;border-radius:8px}
.small{font-size:12px}
</style></head><body>
<header>
 <b>🗂️ Organizar</b><span class="mut" id="counts"></span>
 <span class="sp"></span>
 <span class="mut" id="selinfo">0 seleccionadas</span>
 <input id="newname" placeholder="Nuevo álbum (ej. La Fortuna)"><button class="g" onclick="newAlbum()">+ Álbum</button>
 <button id="trash" ondragover="event.preventDefault();this.classList.add('drop')" ondragleave="this.classList.remove('drop')" ondrop="dropTo(event,'__trash')">🗑️ Papelera</button>
 <span class="mut" id="status">guardado ✓</span>
</header>
<div class="wrap">
 <div class="album" id="al-__unclassified" ondragover="event.preventDefault();this.classList.add('drop')" ondragleave="this.classList.remove('drop')" ondrop="dropTo(event,null)">
   <div class="ah"><span class="nm">📍 Sin clasificar</span><span class="cnt" id="cnt-__unclassified"></span><span class="mut small">— arrastra estas a un álbum</span></div>
   <div class="grid" id="grid-__unclassified"></div>
 </div>
 <div id="albums"></div>
 <details style="margin-top:20px"><summary class="mut">🗑️ Papelera (<span id="cnt-__trash">0</span>) — arrastra aquí para restaurar</summary>
   <div class="album" id="al-__trash" ondragover="event.preventDefault();this.classList.add('drop')" ondragleave="this.classList.remove('drop')" ondrop="dropTo(event,null)"><div class="grid" id="grid-__trash"></div></div>
 </details>
</div>
<div id="modal" onclick="this.style.display='none'"><img id="mimg"></div>
<script>
let S, sel=new Set();
const $=(id)=>document.getElementById(id);
const slug=(s)=>(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'x';
async function load(){S=await (await fetch('/state.json')).json();render();}
function tileEl(p){const t=document.createElement('div');t.className='tile';t.draggable=true;t.dataset.id=p.id;
 t.innerHTML='<img loading="lazy" src="/thumb/'+p.id+'"><div class="x" title="borrar">×</div>';
 t.querySelector('img').onclick=(e)=>{e.stopPropagation();big(p.id)};
 t.onclick=(e)=>{toggle(p.id,t)};
 t.querySelector('.x').onclick=(e)=>{e.stopPropagation();op('assign',[p.id],'__trash');moveTile(p.id,'__trash')};
 t.ondragstart=(e)=>{if(!sel.has(p.id)){clearSel();toggle(p.id,t)}e.dataTransfer.setData('ids',JSON.stringify([...sel]))};
 return t;}
function render(){
 const groups={__unclassified:[],__trash:[]};
 for(const pl of S.places)groups[pl.name]=[];
 for(const p of S.photos){const k=p.place==null?'__unclassified':p.place;(groups[k]=groups[k]||[]).push(p);}
 // sin clasificar
 fill('grid-__unclassified',groups.__unclassified);$('cnt-__unclassified').textContent=groups.__unclassified.length+' fotos';
 // álbumes
 const cont=$('albums');cont.innerHTML='';
 for(const pl of S.places){const g=groups[pl.name]||[];cont.appendChild(albumEl(pl,g));}
 // papelera
 fill('grid-__trash',groups.__trash);$('cnt-__trash').textContent=groups.__trash.length;
 $('counts').textContent=S.photos.length+' fotos · '+S.places.length+' álbumes';
 updateSel();
}
function albumEl(pl,g){const d=document.createElement('div');d.className='album';d.id='al-'+slug(pl.name);
 d.ondragover=(e)=>{e.preventDefault();d.classList.add('drop')};d.ondragleave=()=>d.classList.remove('drop');d.ondrop=(e)=>dropTo(e,pl.name);
 const h=document.createElement('div');h.className='ah';
 h.innerHTML='<input class="nm" value="'+pl.name.replace(/"/g,'&quot;')+'"><span class="cnt">'+g.length+' fotos</span><input class="tg" placeholder="etiquetas (coma)" value="'+((pl.tags||[]).join(', ')).replace(/"/g,'&quot;')+'"><button class="g small" title="borrar álbum (las fotos vuelven a Sin clasificar)">✕ álbum</button>';
 const nm=h.querySelector('.nm');nm.onchange=()=>op('rename',null,null,{from:pl.name,to:nm.value.trim()}).then(load);
 const tg=h.querySelector('.tg');tg.onchange=()=>op('tags',null,pl.name,{tags:tg.value.split(',').map(s=>s.trim()).filter(Boolean)});
 h.querySelector('button').onclick=()=>{if(confirm('¿Borrar el álbum "'+pl.name+'"? Las fotos van a Sin clasificar.'))op('delPlace',null,pl.name).then(load)};
 d.appendChild(h);const grid=document.createElement('div');grid.className='grid';grid.id='grid-'+slug(pl.name);d.appendChild(grid);
 fillEl(grid,g);return d;}
function fill(id,arr){fillEl($(id),arr)}
function fillEl(el,arr){el.innerHTML='';const frag=document.createDocumentFragment();for(const p of arr)frag.appendChild(tileEl(p));el.appendChild(frag);}
function toggle(id,t){if(sel.has(id)){sel.delete(id);t.classList.remove('sel')}else{sel.add(id);t.classList.add('sel')}updateSel()}
function clearSel(){sel.clear();document.querySelectorAll('.tile.sel').forEach(t=>t.classList.remove('sel'));updateSel()}
function updateSel(){$('selinfo').textContent=sel.size+' seleccionadas'}
function gridIdFor(place){return place==null?'grid-__unclassified':place==='__trash'?'grid-__trash':'grid-'+slug(place)}
function moveTile(id,place){const t=document.querySelector('.tile[data-id="'+id+'"]');if(!t)return;const g=$(gridIdFor(place));if(g)g.appendChild(t);
 const p=S.photos.find(x=>x.id===id);if(p)p.place=(place==='__trash')?'__trash':place;}
function dropTo(e,place){e.preventDefault();document.querySelectorAll('.album.drop,#trash.drop').forEach(x=>x.classList.remove('drop'));
 let ids;try{ids=JSON.parse(e.dataTransfer.getData('ids'))}catch{ids=[...sel]}
 const dest=(place==='__trash')?'__trash':place;
 for(const id of ids)moveTile(id,dest==='__trash'?'__trash':dest);
 op('assign',ids,dest);clearSel();render();}
async function newAlbum(){const n=$('newname').value.trim();if(!n)return;$('newname').value='';await op('newPlace',null,n);await load();}
function big(id){$('mimg').src='/large/'+id;$('modal').style.display='flex';}
async function op(action,ids,place,extra){$('status').textContent='guardando...';
 await fetch('/op',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,ids,place,...(extra||{})})});
 $('status').textContent='guardado ✓';}
document.addEventListener('keydown',(e)=>{if((e.key==='Delete'||e.key==='Backspace')&&sel.size){const ids=[...sel];for(const id of ids)moveTile(id,'__trash');op('assign',ids,'__trash');clearSel();render();}if(e.key==='Escape')clearSel();});
load();
</script></body></html>`;

// ---- Server ----
createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); return res.end(PAGE); }
  if (u.pathname === '/state.json') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(clientState())); }
  if (u.pathname.startsWith('/thumb/') || u.pathname.startsWith('/large/')) {
    const big = u.pathname.startsWith('/large/'); const id = Number(u.pathname.split('/')[2]); const p = photos[id];
    if (!p) { res.statusCode = 404; return res.end(); }
    const cache = join(THUMB_DIR, `${id}${big ? '_l' : ''}.webp`);
    try { let buf; if (existsSync(cache)) buf = readFileSync(cache); else { buf = await sharp(p.path, { failOn: 'none' }).rotate().resize(big ? 1400 : 190, big ? 1400 : 190, { fit: 'inside', withoutEnlargement: true }).webp({ quality: big ? 82 : 62 }).toBuffer(); writeFileSync(cache, buf); }
      res.setHeader('content-type', 'image/webp'); res.setHeader('cache-control', 'max-age=604800'); return res.end(buf); }
    catch { res.statusCode = 500; return res.end(); }
  }
  if (u.pathname === '/op' && req.method === 'POST') {
    let body = ''; for await (const c of req) body += c; const { action, ids, place, from, to, tags } = JSON.parse(body);
    const paths = (ids || []).map((id) => photos[id]?.path).filter(Boolean);
    if (action === 'assign') {
      for (const pth of paths) {
        state.deleted = state.deleted.filter((d) => d !== pth);
        if (place === '__trash') { delete state.assign[pth]; state.deleted.push(pth); }
        else if (place == null) { delete state.assign[pth]; }
        else { state.assign[pth] = place; }
      }
    } else if (action === 'newPlace') { if (place && !state.places.some((p) => p.name === place)) state.places.push({ name: place, tags: [] }); }
    else if (action === 'delPlace') { state.places = state.places.filter((p) => p.name !== place); for (const k of Object.keys(state.assign)) if (state.assign[k] === place) delete state.assign[k]; }
    else if (action === 'rename') { const pl = state.places.find((p) => p.name === from); if (pl && to) { pl.name = to; for (const k of Object.keys(state.assign)) if (state.assign[k] === from) state.assign[k] = to; } }
    else if (action === 'tags') { const pl = state.places.find((p) => p.name === place); if (pl) pl.tags = tags || []; }
    persist(); res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ ok: true }));
  }
  res.statusCode = 404; res.end();
}).listen(PORT, () => console.log(`\n🗂️  Organizador en  http://localhost:${PORT}\n`));
