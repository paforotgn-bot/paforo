/**
 * Exporta el álbum como HTML estático junto a la caché de miniaturas.
 * No necesita servidor: se abre con doble clic (file://) y no hay proceso
 * que se pueda quedar sin memoria.
 *
 *   node scripts/export-html.mjs
 *   → C:\Users\pafor\.fotos-organizer\eaeac24834\album\index.html
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const SITE = join(CACHE, 'album');
mkdirSync(SITE, { recursive: true });

const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
const byId = new Map(photos.map((p) => [p.id, p]));
const albumsData = JSON.parse(readFileSync(join(OUT_DIR, 'albums.json'), 'utf8'));
const curation = JSON.parse(readFileSync(join(OUT_DIR, 'curation.json'), 'utf8'));

const albums = [...albumsData.albums, ...albumsData.trabajo].sort((a, b) => (a.from < b.from ? -1 : 1));

const descartesDe = new Map();
for (const c of curation.clusters) {
  const otras = c.ids.filter((id) => id !== c.keep);
  if (otras.length) descartesDe.set(c.keep, { r: c.reason, d: otras });
}

// las miniaturas están en ../_thumbs respecto a la carpeta album/
const t = (id) => `../_thumbs/${id}.webp`;
const l = (id) => (existsSync(join(CACHE, '_thumbs', `${id}_l.webp`)) ? `../_thumbs/${id}_l.webp` : `../_thumbs/${id}.webp`);
const fmt = (iso) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CSS = `
:root{color-scheme:dark;--bg:#0d0d0f;--card:#17171b;--fg:#ececf1;--dim:#9a9aa5;--accent:#c4b5fd}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif}
header{position:sticky;top:0;z-index:5;background:rgba(13,13,15,.93);backdrop-filter:blur(8px);padding:14px 20px;border-bottom:1px solid #26262c;display:flex;gap:14px;align-items:baseline;flex-wrap:wrap}
h1{font-size:19px;margin:0;font-weight:650;letter-spacing:-.01em}
.sub{color:var(--dim);font-size:13px}
a{color:inherit;text-decoration:none}
.wrap{padding:20px;max-width:1500px;margin:0 auto}
.albums{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
.card{background:var(--card);border-radius:12px;overflow:hidden;border:1px solid #26262c;transition:transform .12s,border-color .12s}
.card:hover{transform:translateY(-2px);border-color:#3c3c46}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:#222}
.card .meta{padding:10px 12px 12px}
.card .t{font-weight:600;font-size:14.5px;letter-spacing:-.01em}
.card .d{color:var(--dim);font-size:12.5px;margin-top:3px}
.tag{display:inline-block;font-size:11px;color:var(--accent);border:1px solid #3a3550;border-radius:99px;padding:1px 8px;margin-top:7px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:7px}
.cell{position:relative;aspect-ratio:1;background:#1b1b20;border-radius:7px;overflow:hidden;cursor:zoom-in}
.cell img{width:100%;height:100%;object-fit:cover;display:block}
.cell .n{position:absolute;left:5px;top:5px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;padding:1px 5px;border-radius:4px}
.cell.has-drop .n{background:rgba(192,84,46,.88)}
#lb{position:fixed;inset:0;background:rgba(5,5,7,.97);display:none;align-items:center;justify-content:center;flex-direction:column;z-index:20}
#lb.on{display:flex}
#lbimg{max-width:92vw;max-height:74vh;object-fit:contain;border-radius:6px}
#lbbar{color:var(--dim);font-size:13px;padding:10px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:center}
#lbbar button{background:#232329;color:var(--fg);border:1px solid #35353e;border-radius:7px;padding:5px 11px;font-size:13px;cursor:pointer}
#drops{display:flex;gap:6px;padding:4px 12px 12px;overflow-x:auto;max-width:92vw}
#drops img{height:74px;border-radius:5px;opacity:.6;border:1px solid #42302c}
.back{color:var(--dim);font-size:13px}
`;

/* índice */
const total = albums.reduce((a, b) => a + b.n, 0);
const cards = albums.map((a) => `
  <a class="card" href="a-${a.slug}.html">
    <img src="${t(a.cover)}">
    <div class="meta">
      <div class="t">${esc(a.title)}</div>
      <div class="d">${a.n} fotos · ${fmt(a.from)}${a.from !== a.to ? ' – ' + fmt(a.to) : ''}</div>
      ${a.place ? `<div class="d">${esc(a.place)}</div>` : ''}
      ${a.ask ? '<span class="tag">falta confirmar el sitio</span>' : ''}
    </div>
  </a>`).join('');

writeFileSync(join(SITE, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Álbum de fotos</title><style>${CSS}</style>
<header><h1>Álbum de fotos</h1><span class="sub">${albums.length} álbumes · ${total} fotos</span></header>
<div class="wrap"><div class="albums">${cards}</div></div>`);

/* una página por álbum */
for (const a of albums) {
  const conDescartes = a.ids.filter((id) => descartesDe.has(id)).length;
  const cells = a.ids.map((id, i) => {
    const d = descartesDe.get(id);
    return `<div class="cell${d ? ' has-drop' : ''}" data-i="${i}"><img loading="lazy" src="${t(id)}"><span class="n">${d ? '+' + d.d.length : i + 1}</span></div>`;
  }).join('');
  const datos = a.ids.map((id) => {
    const d = descartesDe.get(id);
    return { l: l(id), f: fmt(byId.get(id).iso), d: d ? d.d.map(t) : [], r: d ? d.r : '' };
  });
  writeFileSync(join(SITE, `a-${a.slug}.html`), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(a.title)}</title><style>${CSS}</style>
<header>
  <a class="back" href="index.html">← álbumes</a>
  <h1>${esc(a.title)}</h1>
  <span class="sub">${a.n} fotos · ${fmt(a.from)}${a.from !== a.to ? ' – ' + fmt(a.to) : ''}${a.place ? ' · ' + esc(a.place) : ''}</span>
  <span class="sub">${conDescartes} vienen de una ráfaga (marcadas en naranja)</span>
</header>
<div class="wrap"><div class="grid">${cells}</div></div>
<div id="lb"><img id="lbimg"><div id="drops"></div>
  <div id="lbbar"><button id="prev">← anterior</button><span id="cap"></span><button id="next">siguiente →</button><button id="close">cerrar</button></div>
</div>
<script>
const D=${JSON.stringify(datos)};
const lb=document.getElementById('lb'),img=document.getElementById('lbimg'),cap=document.getElementById('cap'),drops=document.getElementById('drops');
let cur=0;
function show(i){
  cur=(i+D.length)%D.length; const r=D[cur];
  img.src=r.l; lb.classList.add('on');
  cap.textContent=(cur+1)+' / '+D.length+' · '+r.f+(r.d.length?' · '+r.d.length+' descartadas de esta ráfaga ('+r.r+')':'');
  drops.innerHTML=r.d.map(s=>'<img src="'+s+'">').join('');
}
document.querySelectorAll('.cell').forEach(c=>c.onclick=()=>show(+c.dataset.i));
document.getElementById('next').onclick=()=>show(cur+1);
document.getElementById('prev').onclick=()=>show(cur-1);
document.getElementById('close').onclick=()=>lb.classList.remove('on');
document.onkeydown=e=>{if(!lb.classList.contains('on'))return;
  if(e.key==='ArrowRight')show(cur+1); if(e.key==='ArrowLeft')show(cur-1); if(e.key==='Escape')lb.classList.remove('on');};
</script>`);
}

console.log(`✓ ${albums.length} álbumes exportados → ${join(SITE, 'index.html')}`);
