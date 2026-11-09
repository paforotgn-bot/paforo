/**
 * Construye CANDIDATOS a álbum a partir de curation.json y genera hojas de
 * contactos para revisarlas a ojo.
 *
 *   node scripts/albums.mjs candidates [--gap=30] [--min=10]
 *   node scripts/albums.mjs sheets [ids...] [--max=24] [--cols=6]
 *   node scripts/albums.mjs sheet-pool <YYYY>      → sobras pequeñas de un año
 *
 * Salida: src/content/fotos/album-candidates.json  +  caché _sheets/*.jpg
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const THUMBS = join(CACHE, '_thumbs');
const SHEETS = join(CACHE, '_sheets');
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const CAND_FILE = join(OUT_DIR, 'album-candidates.json');

const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
const byId = new Map(photos.map((p) => [p.id, p]));
const thumbPath = (id, big) => join(THUMBS, `${id}${big ? '_l' : ''}.webp`);
const src = (id) => (existsSync(thumbPath(id, true)) ? thumbPath(id, true) : existsSync(thumbPath(id, false)) ? thumbPath(id, false) : byId.get(id).path);
const arg = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=')[1] : def;
};

/* ───────── candidatos ───────── */
function cmdCandidates() {
  const cur = JSON.parse(readFileSync(join(OUT_DIR, 'curation.json'), 'utf8'));
  const GAP_H = Number(arg('gap', 30));
  const MIN = Number(arg('min', 10));
  const events = [...cur.events].sort((a, b) => a.start - b.start);

  const groups = [];
  let g = null;
  for (const e of events) {
    if (!g || (e.start - g.end) / 3600000 > GAP_H) {
      g = { events: [e], start: e.start, end: e.end, ids: [...e.ids] };
      groups.push(g);
    } else {
      g.events.push(e); g.end = e.end; g.ids.push(...e.ids);
    }
  }

  const shape = (g, i) => {
    const days = [...new Set(g.ids.map((id) => byId.get(id).iso.slice(0, 10)))].sort();
    const places = [...new Set(g.events.flatMap((e) => e.labelPlaces))];
    const prev = {};
    for (const e of g.events) for (const [k, v] of Object.entries(e.prevAlbums)) prev[k] = (prev[k] || 0) + v;
    const spanDays = Math.max(1, Math.round((g.end - g.start) / 86400000) + 1);
    return {
      cand: i + 1,
      n: g.ids.length,
      from: new Date(g.start).toISOString().slice(0, 10),
      to: new Date(g.end).toISOString().slice(0, 10),
      spanDays,
      perDay: +(g.ids.length / spanDays).toFixed(1),
      days,
      events: g.events.map((e) => e.id),
      labelPlaces: places,
      prevAlbums: prev,
      cover: g.events[0].cover,
      ids: g.ids,
    };
  };

  const all = groups.map(shape);
  const candidates = all.filter((c) => c.n >= MIN).map((c, i) => ({ ...c, cand: i + 1 }));
  const pool = all.filter((c) => c.n < MIN);
  const out = {
    generated: new Date().toISOString(),
    params: { GAP_H, MIN },
    totals: {
      candidates: candidates.length,
      photosInCandidates: candidates.reduce((a, c) => a + c.n, 0),
      poolGroups: pool.length,
      photosInPool: pool.reduce((a, c) => a + c.n, 0),
    },
    candidates,
    pool,
  };
  writeFileSync(CAND_FILE, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out.totals, null, 1));
  for (const c of candidates) {
    console.log(
      String(c.cand).padStart(3), String(c.n).padStart(4), c.from, '→', c.to,
      `(${c.spanDays}d, ${c.perDay}/d)`, '|', c.labelPlaces.join('/') || '—', '|', Object.keys(c.prevAlbums).join(',') || '—'
    );
  }
  console.log(`✓ → ${CAND_FILE}`);
}

/* ───────── hojas de contactos ───────── */
function pick(ids, max) {
  if (ids.length <= max) return ids;
  if (max <= 1) return ids.slice(0, 1);
  return Array.from({ length: max }, (_, i) => ids[Math.round((i * (ids.length - 1)) / (max - 1))]);
}

async function sheet(file, ids, cols, cell) {
  const rows = Math.ceil(ids.length / cols);
  const tiles = [];
  for (let i = 0; i < ids.length; i++) {
    let buf;
    try {
      buf = await sharp(src(ids[i]), { failOn: 'none' }).rotate().resize(cell, cell, { fit: 'cover' }).toBuffer();
    } catch {
      // formato ilegible (HEIF sin codec): casilla gris para no romper la hoja
      buf = await sharp({ create: { width: cell, height: cell, channels: 3, background: { r: 60, g: 60, b: 60 } } }).jpeg().toBuffer();
    }
    tiles.push({ input: buf, left: (i % cols) * cell, top: Math.floor(i / cols) * cell });
  }
  const labels = ids.map((id, i) => {
    const x = (i % cols) * cell + 4, y = Math.floor(i / cols) * cell + 14;
    return `<rect x="${x - 2}" y="${y - 11}" width="${String(i + 1).length * 8 + 8}" height="14" fill="#000" opacity="0.6"/><text x="${x + 2}" y="${y}" font-family="Arial" font-size="11" fill="#fff">${i + 1}</text>`;
  }).join('');
  const svg = Buffer.from(`<svg width="${cols * cell}" height="${rows * cell}">${labels}</svg>`);
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: { r: 17, g: 17, b: 17 } } })
    .composite([...tiles, { input: svg, left: 0, top: 0 }])
    .jpeg({ quality: 70 })
    .toFile(file);
}

async function cmdSheets() {
  const data = JSON.parse(readFileSync(CAND_FILE, 'utf8'));
  mkdirSync(SHEETS, { recursive: true });
  const only = process.argv.slice(3).filter((a) => !a.startsWith('--')).map(Number);
  const MAX = Number(arg('max', 24));
  const COLS = Number(arg('cols', 6));
  const CELL = Number(arg('cell', 190));
  let done = 0;
  for (const c of data.candidates) {
    if (only.length && !only.includes(c.cand)) continue;
    const ids = pick(c.ids, MAX);
    const file = join(SHEETS, `cand${String(c.cand).padStart(3, '0')}.jpg`);
    await sheet(file, ids, COLS, CELL);
    writeFileSync(file.replace('.jpg', '.json'), JSON.stringify({ cand: c.cand, shown: ids }, null, 1));
    process.stdout.write(`\r  ${++done} hojas`);
  }
  console.log(`\n✓ → ${SHEETS}`);
}

async function cmdSheetPool() {
  const data = JSON.parse(readFileSync(CAND_FILE, 'utf8'));
  const year = process.argv[3];
  mkdirSync(SHEETS, { recursive: true });
  const groups = data.pool.filter((p) => p.from.startsWith(year));
  const ids = groups.flatMap((p) => p.ids);
  const MAX = Number(arg('max', 48));
  const shown = pick(ids, MAX);
  const file = join(SHEETS, `pool${year}.jpg`);
  await sheet(file, shown, Number(arg('cols', 8)), Number(arg('cell', 150)));
  writeFileSync(file.replace('.jpg', '.json'), JSON.stringify({ year, groups: groups.length, photos: ids.length, shown }, null, 1));
  console.log(`✓ ${year}: ${groups.length} grupos, ${ids.length} fotos → ${file}`);
}

/* ───────── contacto del pool: 1 foto por grupo suelto, etiquetada ─────────
 * node scripts/albums.mjs pool-contact <YYYY> [--per=1] [--cols=8] */
async function cmdPoolContact() {
  const data = JSON.parse(readFileSync(CAND_FILE, 'utf8'));
  const cur = JSON.parse(readFileSync(join(OUT_DIR, 'curation.json'), 'utf8'));
  const covers = new Map(cur.events.map((e) => [e.id, e.cover]));
  mkdirSync(SHEETS, { recursive: true });
  const year = process.argv[3];
  const PER = Number(arg('per', 1));
  const COLS = Number(arg('cols', 8)), CELL = Number(arg('cell', 150));
  const groups = data.pool
    .map((p, i) => ({ ...p, idx: i + 1 }))
    .filter((p) => p.from.startsWith(year));
  const entries = [];
  for (const g of groups) {
    const best = g.events.map((e) => covers.get(e)).filter((x) => x != null);
    const shown = pick(best.length ? best : g.ids, PER);
    for (const id of shown) entries.push({ id, g });
  }
  const rows = Math.ceil(entries.length / COLS);
  const tiles = [], labels = [];
  for (let i = 0; i < entries.length; i++) {
    const { id, g } = entries[i];
    const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * CELL;
    let buf;
    try { buf = await sharp(src(id), { failOn: 'none' }).rotate().resize(CELL, CELL, { fit: 'cover' }).toBuffer(); }
    catch { buf = await sharp({ create: { width: CELL, height: CELL, channels: 3, background: { r: 60, g: 60, b: 60 } } }).jpeg().toBuffer(); }
    tiles.push({ input: buf, left: x, top: y });
    const tag = `g${g.idx} ${g.from.slice(5)} (${g.n})`;
    labels.push(`<rect x="${x}" y="${y}" width="${CELL}" height="15" fill="#000" opacity="0.65"/><text x="${x + 3}" y="${y + 11}" font-family="Arial" font-size="10" fill="#fff">${tag}</text>`);
  }
  const svg = Buffer.from(`<svg width="${COLS * CELL}" height="${rows * CELL}">${labels.join('')}</svg>`);
  const file = join(SHEETS, `poolc${year}.jpg`);
  await sharp({ create: { width: COLS * CELL, height: rows * CELL, channels: 3, background: { r: 17, g: 17, b: 17 } } })
    .composite([...tiles, { input: svg, left: 0, top: 0 }]).jpeg({ quality: 72 }).toFile(file);
  console.log(`✓ ${year}: ${groups.length} grupos (${groups.reduce((a, g) => a + g.n, 0)} fotos) → ${file}`);
}

/* ───────── revisión de descartes ─────────
 * Hoja con N clusters, una fila por cluster: primero la elegida, luego las descartadas. */
async function cmdClusters() {
  const cur = JSON.parse(readFileSync(join(OUT_DIR, 'curation.json'), 'utf8'));
  mkdirSync(SHEETS, { recursive: true });
  const min = Number(arg('min', 3)), max = Number(arg('max', 8));
  const rows = Number(arg('rows', 8));
  const seed = Number(arg('seed', 1));
  const pool = cur.clusters.filter((c) => c.size >= min && c.size <= max);
  const step = Math.max(1, Math.floor(pool.length / rows));
  const chosen = Array.from({ length: rows }, (_, i) => pool[(i * step + seed) % pool.length]).filter(Boolean);
  const COLS = max, CELL = 170;
  const tiles = [];
  const labels = [];
  for (let r = 0; r < chosen.length; r++) {
    const c = chosen[r];
    const ordered = [c.keep, ...c.ids.filter((id) => id !== c.keep)];
    for (let i = 0; i < ordered.length && i < COLS; i++) {
      let buf;
      try { buf = await sharp(src(ordered[i]), { failOn: 'none' }).rotate().resize(CELL, CELL, { fit: 'cover' }).toBuffer(); }
      catch { buf = await sharp({ create: { width: CELL, height: CELL, channels: 3, background: { r: 60, g: 60, b: 60 } } }).jpeg().toBuffer(); }
      tiles.push({ input: buf, left: i * CELL, top: r * CELL });
      const tag = i === 0 ? 'ELEGIDA' : c.reason;
      const color = i === 0 ? '#22c55e' : '#ef4444';
      labels.push(`<rect x="${i * CELL}" y="${r * CELL}" width="${CELL}" height="16" fill="#000" opacity="0.65"/><text x="${i * CELL + 4}" y="${r * CELL + 12}" font-family="Arial" font-size="11" fill="${color}">${tag} ${ordered[i]}</text>`);
    }
  }
  const svg = Buffer.from(`<svg width="${COLS * CELL}" height="${chosen.length * CELL}">${labels.join('')}</svg>`);
  const file = join(SHEETS, `clusters-${min}-${max}-s${seed}.jpg`);
  await sharp({ create: { width: COLS * CELL, height: chosen.length * CELL, channels: 3, background: { r: 17, g: 17, b: 17 } } })
    .composite([...tiles, { input: svg, left: 0, top: 0 }]).jpeg({ quality: 72 }).toFile(file);
  console.log(`✓ ${chosen.length} clusters → ${file}`);
}

/* ───────── construcción final de álbumes ─────────
 * Junta candidatos + decisiones (revisión visual) y absorbe los grupos sueltos
 * del pool que caen dentro del rango de fechas de un álbum (p. ej. días flojos
 * en mitad de un viaje largo). */
function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cmdBuild() {
  const data = JSON.parse(readFileSync(CAND_FILE, 'utf8'));
  const dec = JSON.parse(readFileSync(join(OUT_DIR, 'album-decisions.json'), 'utf8')).decisions;
  const cur = JSON.parse(readFileSync(join(OUT_DIR, 'curation.json'), 'utf8'));
  const byCand = new Map(data.candidates.map((c) => [c.cand, c]));
  const quality = new Map(); // orden estable por fecha, el cover ya viene elegido

  // clases por foto: gimnasio (selfies de espejo) y papeles; más las capturas PNG
  const classes = JSON.parse(readFileSync(join(OUT_DIR, 'classes.json'), 'utf8'));
  const meta = JSON.parse(readFileSync(join(CACHE, '_meta.json'), 'utf8'));
  const Q = JSON.parse(readFileSync(join(CACHE, '_quality.json'), 'utf8'));
  // portada: la más nítida y bien expuesta, con preferencia por las apaisadas
  const coverOf = (ids) => {
    let best = ids[0], bestScore = -1;
    for (const id of ids) {
      const q = Q[id]; if (!q) continue;
      const m = meta[id] || {};
      const apaisada = m.w && m.h && m.w > m.h ? 1 : 0;
      const expo = 1 - Math.min(1, Math.abs(q.mean - 120) / 120);
      const score = 0.45 * Math.min(1, (q.sharp || 0) / 900) + 0.25 * expo
        + 0.12 * Math.min(1, (q.std || 0) / 70) + 0.18 * apaisada;
      if (score > bestScore) { bestScore = score; best = id; }
    }
    return best;
  };
  const GYM = new Set(classes.gimnasio.ids);
  const BORRAR = new Set(classes.papeles.ids);
  for (const p of photos) if ((meta[p.id] || {}).ext === 'png') BORRAR.add(p.id); // capturas de pantalla
  const FUERA = new Set();           // ni álbum ni papelera (obra, precios)
  const sobras = [];                 // lo que cae a "Día a día"
  const clean = (ids) => ids.filter((id) => !GYM.has(id) && !BORRAR.has(id) && !FUERA.has(id));

  const used = new Set();
  const albums = [];
  const trabajo = [];
  const descartados = [];

  for (const d of dec) {
    const c = byCand.get(d.cand);
    if (!c) continue;
    if (d.status === 'merged') { used.add(d.cand); continue; }
    if (d.status === 'descarte') {
      used.add(d.cand);
      const rest = c.ids.filter((id) => !GYM.has(id) && !BORRAR.has(id));
      if (d.to === 'borrar') { for (const id of rest) BORRAR.add(id); }
      else if (d.to === 'fuera') { for (const id of rest) FUERA.add(id); }
      else sobras.push({ from: c.from, to: c.to, ids: rest });
      descartados.push({ cand: d.cand, n: c.n, from: c.from, to: c.to, reason: d.reason, destino: d.to || 'dia' });
      continue;
    }
    const parts = [c, ...(d.merge || []).map((m) => byCand.get(m)).filter(Boolean)];
    for (const p of parts) used.add(p.cand);
    let ids = parts.flatMap((p) => p.ids);
    let from = parts.map((p) => p.from).sort()[0];
    let to = parts.map((p) => p.to).sort().at(-1);
    if (d.spanFrom) from = d.spanFrom < from ? d.spanFrom : from;
    if (d.spanTo) to = d.spanTo > to ? d.spanTo : to;

    // absorber grupos sueltos dentro del rango
    const absorbed = [];
    for (const p of data.pool) {
      if (p.from >= from && p.to <= to) { ids.push(...p.ids); absorbed.push(p.ids.length); }
    }
    ids = clean([...new Set(ids)]).sort((a, b) => a - b);

    const album = {
      slug: slugify(d.title),
      title: d.title,
      place: d.place || null,
      from, to,
      days: Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1,
      n: ids.length,
      fromCandidates: parts.map((p) => p.cand),
      absorbedFromPool: absorbed.reduce((a, b) => a + b, 0),
      tags: d.tags || [],
      cover: coverOf(ids),
      ask: d.ask || null,
      kind: d.status,
      ids,
    };
    (d.status === 'trabajo' ? trabajo : albums).push(album);
  }

  let leftoverPool = data.pool
    .map((p, i) => ({ ...p, idx: i + 1 }))
    .filter((p) => ![...albums, ...trabajo].some((a) => p.from >= a.from && p.to <= a.to));

  // reparto de los grupos sueltos: curro / descarte / día a día por año
  const poolDec = JSON.parse(readFileSync(join(OUT_DIR, 'album-decisions.json'), 'utf8')).pool || {};
  const curroIdx = new Set(poolDec.curro || []);
  const borrarIdx = new Set(poolDec.borrar || []);
  const fueraIdx = new Set(poolDec.fuera || []);

  for (const p of leftoverPool) {
    if (borrarIdx.has(p.idx)) for (const id of p.ids) BORRAR.add(id);
    if (fueraIdx.has(p.idx)) for (const id of p.ids) FUERA.add(id);
  }
  const curroPool = leftoverPool.filter((p) => curroIdx.has(p.idx));
  const descPool = leftoverPool.filter((p) => borrarIdx.has(p.idx) || fueraIdx.has(p.idx));
  const diaria = [
    ...leftoverPool.filter((p) => !curroIdx.has(p.idx) && !borrarIdx.has(p.idx) && !fueraIdx.has(p.idx)),
    ...sobras,
  ];

  // un único álbum "Curros" con los candidatos de trabajo + los grupos sueltos de curro
  if (trabajo.length || curroPool.length) {
    const ids = clean([...new Set([...trabajo.flatMap((t) => t.ids), ...curroPool.flatMap((p) => p.ids)])]).sort((a, b) => a - b);
    const from = [...trabajo.map((t) => t.from), ...curroPool.map((p) => p.from)].sort()[0];
    const to = [...trabajo.map((t) => t.to), ...curroPool.map((p) => p.to)].sort().at(-1);
    trabajo.length = 0;
    trabajo.push({
      slug: 'curros', title: 'Curros', place: null, from, to,
      n: ids.length, tags: ['curro', 'coctelería', 'eventos'],
      cover: coverOf(ids), kind: 'trabajo', gruposSueltos: curroPool.length, ids,
    });
  }

  // "Día a día <año>" con el resto
  const porAnio = new Map();
  for (const p of diaria) {
    const y = p.from.slice(0, 4);
    if (!porAnio.has(y)) porAnio.set(y, []);
    porAnio.get(y).push(p);
  }
  const diarios = [...porAnio.entries()].sort().map(([y, gs]) => {
    const ids = clean([...new Set(gs.flatMap((g) => g.ids))]).sort((a, b) => a - b);
    return {
      slug: `dia-a-dia-${y}`, title: `Día a día ${y}`, place: null,
      from: gs.map((g) => g.from).sort()[0], to: gs.map((g) => g.to).sort().at(-1),
      n: ids.length, tags: ['día a día'], cover: coverOf(ids),
      kind: 'dia-a-dia', grupos: gs.length, ids,
    };
  });
  for (const d of diarios) if (d.n) albums.push(d);

  // álbum de gimnasio (selfies de progreso) con todo lo que cayó en esa clase
  const gymIds = [...GYM].sort((a, b) => a - b);
  if (gymIds.length) {
    const isos = gymIds.map((id) => byId.get(id).iso.slice(0, 10)).sort();
    albums.push({
      slug: 'gimnasio', title: 'Gimnasio', place: null,
      from: isos[0], to: isos.at(-1), n: gymIds.length,
      tags: ['gimnasio', 'progreso'], cover: coverOf(gymIds),
      kind: 'gimnasio', ids: gymIds,
    });
  }

  // manifiesto de borrado: capturas de pantalla + papeleo
  const borrarIds = [...BORRAR].sort((a, b) => a - b);
  const borrarList = borrarIds.map((id) => ({ id, path: byId.get(id).path, iso: byId.get(id).iso, ext: (meta[id] || {}).ext || null }));
  writeFileSync(join(OUT_DIR, 'borrar.json'), JSON.stringify({
    generated: new Date().toISOString(),
    criterio: 'capturas de pantalla (PNG) + fotos de contratos, albaranes y partes',
    n: borrarList.length,
    porTipo: borrarList.reduce((a, b) => ({ ...a, [b.ext]: (a[b.ext] || 0) + 1 }), {}),
    fotos: borrarList,
  }, null, 1));
  for (const p of descPool) descartados.push({ pool: p.idx, n: p.n, from: p.from, to: p.to, reason: borrarIdx.has(p.idx) ? 'pantallas o papeleo → borrar' : 'obra y precios → fuera del álbum' });
  leftoverPool = [];
  const out = {
    generated: new Date().toISOString(),
    totals: {
      albums: albums.length,
      fotosEnAlbumes: albums.reduce((a, x) => a + x.n, 0),
      albumesTrabajo: trabajo.length,
      fotosTrabajo: trabajo.reduce((a, x) => a + x.n, 0),
      candidatosDescartados: descartados.length,
      fotosDescartadasPorCandidato: descartados.reduce((a, x) => a + x.n, 0),
      gruposSueltosSinUbicar: leftoverPool.length,
      fotosSueltasSinUbicar: leftoverPool.reduce((a, x) => a + x.n, 0),
      dudas: albums.filter((a) => a.ask).length,
      gimnasio: gymIds.length,
      aBorrar: borrarIds.length,
      fueraDelAlbum: FUERA.size,
    },
    albums: albums.sort((a, b) => (a.from < b.from ? -1 : 1)),
    trabajo,
    descartados,
    sueltas: leftoverPool.map((p) => ({ from: p.from, to: p.to, n: p.n, ids: p.ids })),
  };
  writeFileSync(join(OUT_DIR, 'albums.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out.totals, null, 1));
  for (const a of out.albums) console.log(String(a.n).padStart(4), a.from, '→', a.to, ' ', a.title, a.ask ? '  ❓' : '');
  console.log(`✓ → ${join(OUT_DIR, 'albums.json')}`);
}

const cmd = process.argv[2];
if (cmd === 'build') cmdBuild();
else if (cmd === 'pool-contact') await cmdPoolContact();
else if (cmd === 'clusters') await cmdClusters();
else if (cmd === 'candidates') cmdCandidates();
else if (cmd === 'sheets') await cmdSheets();
else if (cmd === 'sheet-pool') await cmdSheetPool();
else console.error('Uso: node scripts/albums.mjs candidates|sheets|sheet-pool');

/* hoja de un álbum ya construido: node scripts/albums.mjs sheet-album <slug> */
if (process.argv[2] === 'sheet-album') {
  const a = JSON.parse(readFileSync(join(OUT_DIR, 'albums.json'), 'utf8'));
  const al = [...a.albums, ...a.trabajo].find((x) => x.slug === process.argv[3]);
  if (!al) { console.error('no existe ese slug'); process.exit(1); }
  mkdirSync(SHEETS, { recursive: true });
  const ids = pick(al.ids, Number(arg('max', 24)));
  const file = join(SHEETS, `album-${al.slug}.jpg`);
  await sheet(file, ids, 6, 190);
  console.log(`✓ ${al.title} (${al.n} fotos) → ${file}`);
}

/* varios grupos del pool enteros, una fila por grupo:
   node scripts/albums.mjs pool-group <idx> [<idx>...] */
if (process.argv[2] === 'pool-group') {
  const data = JSON.parse(readFileSync(CAND_FILE, 'utf8'));
  mkdirSync(SHEETS, { recursive: true });
  const idxs = process.argv.slice(3).filter((a) => !a.startsWith('--')).map(Number);
  const CELL = 150, COLS = 9;
  const tiles = [], labels = [];
  let row = 0;
  for (const idx of idxs) {
    const g = data.pool[idx - 1];
    if (!g) continue;
    const ids = pick(g.ids, COLS);
    for (let i = 0; i < ids.length; i++) {
      let buf;
      try { buf = await sharp(src(ids[i]), { failOn: 'none' }).rotate().resize(CELL, CELL, { fit: 'cover' }).toBuffer(); }
      catch { buf = await sharp({ create: { width: CELL, height: CELL, channels: 3, background: { r: 60, g: 60, b: 60 } } }).jpeg().toBuffer(); }
      tiles.push({ input: buf, left: i * CELL, top: row * CELL });
    }
    labels.push(`<rect x="0" y="${row * CELL}" width="${CELL}" height="15" fill="#000" opacity="0.7"/><text x="3" y="${row * CELL + 11}" font-family="Arial" font-size="10" fill="#0f0">g${idx} ${g.from} (${g.n})</text>`);
    row++;
  }
  const svg = Buffer.from(`<svg width="${COLS * CELL}" height="${row * CELL}">${labels.join('')}</svg>`);
  const file = join(SHEETS, `poolg-${idxs.join('_')}.jpg`);
  await sharp({ create: { width: COLS * CELL, height: row * CELL, channels: 3, background: { r: 17, g: 17, b: 17 } } })
    .composite([...tiles, { input: svg, left: 0, top: 0 }]).jpeg({ quality: 72 }).toFile(file);
  console.log(`✓ → ${file}`);
}
