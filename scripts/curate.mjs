/**
 * CURADOR automático de fotos (local, NO toca ni borra los originales).
 *
 *   node scripts/curate.mjs score   → calidad (nitidez/exposición/contraste) → caché _quality.json
 *   node scripts/curate.mjs group   → ráfagas, duplicados y eventos → src/content/fotos/curation.json
 *   node scripts/curate.mjs sheets  → contact sheets por evento → caché _sheets/
 *
 * La selección se guarda como keep/drop en curation.json: todo es reversible.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { histSim, structSim } from './feat.mjs';

const argOf = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=')[1] : def;
};

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE = 'C:/Users/pafor/.fotos-organizer/eaeac24834';
const THUMBS = join(CACHE, '_thumbs');
const OUT_DIR = join(ROOT, 'src', 'content', 'fotos');
const Q_FILE = join(CACHE, '_quality.json');
const CUR_FILE = join(OUT_DIR, 'curation.json');

const photos = JSON.parse(readFileSync(join(CACHE, '_index.json'), 'utf8'));
// _hashes2.json = huellas recalculadas bien (las de _hashes.json eran ruido)
const HASH2 = join(CACHE, '_hashes2.json');
const hashes = existsSync(HASH2) ? JSON.parse(readFileSync(HASH2, 'utf8')) : JSON.parse(readFileSync(join(CACHE, '_hashes.json'), 'utf8'));
const meta = existsSync(join(CACHE, '_meta.json')) ? JSON.parse(readFileSync(join(CACHE, '_meta.json'), 'utf8')) : {};
const byId = new Map(photos.map((p) => [p.id, p]));

const thumbPath = (id, big) => join(THUMBS, `${id}${big ? '_l' : ''}.webp`);
const src = (id) => (existsSync(thumbPath(id, true)) ? thumbPath(id, true) : existsSync(thumbPath(id, false)) ? thumbPath(id, false) : byId.get(id).path);

/* ───────────────────────── huella perceptual (dHash 64 bits) ─────────────────────────
 * OJO: sharp.greyscale() NO reduce a 1 canal; hay que forzar toColourspace('b-w'),
 * si no el raw sale entrelazado RGB y el hash es ruido. */
async function dhash(id) {
  const { data } = await sharp(src(id), { failOn: 'none' })
    .rotate().greyscale().toColourspace('b-w').resize(9, 8, { fit: 'fill' })
    .raw().toBuffer({ resolveWithObject: true });
  let bits = '';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += data[y * 9 + x] > data[y * 9 + x + 1] ? '1' : '0';
  let hex = '';
  for (let i = 0; i < 64; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex;
}

async function cmdHash() {
  const H_FILE = join(CACHE, '_hashes2.json');
  const h = existsSync(H_FILE) ? JSON.parse(readFileSync(H_FILE, 'utf8')) : {};
  const todo = photos.filter((p) => h[p.id] === undefined);
  console.log(`huellas: ${photos.length} fotos · pendientes ${todo.length}`);
  let i = 0, done = 0;
  const worker = async () => {
    while (i < todo.length) {
      const p = todo[i++];
      try { h[p.id] = await dhash(p.id); } catch { h[p.id] = null; }
      if (++done % 250 === 0) { writeFileSync(H_FILE, JSON.stringify(h)); process.stdout.write(`\r  ${done}/${todo.length}`); }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  writeFileSync(H_FILE, JSON.stringify(h));
  console.log(`\n✓ huellas → ${H_FILE}`);
}

/* ───────────────────────── calidad ───────────────────────── */
async function metrics(id) {
  const { data, info } = await sharp(src(id), { failOn: 'none' })
    .rotate().greyscale().toColourspace('b-w').resize(320, 320, { fit: 'inside', withoutEnlargement: true })
    .raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let sum = 0, sum2 = 0, dark = 0, blown = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    sum += v; sum2 += v * v;
    if (v < 8) dark++;
    if (v > 247) blown++;
  }
  const px = data.length;
  const mean = sum / px;
  const std = Math.sqrt(Math.max(0, sum2 / px - mean * mean));
  let lap = 0, lap2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const L = 4 * data[i] - data[i - 1] - data[i + 1] - data[i - w] - data[i + w];
      lap += L; lap2 += L * L; n++;
    }
  }
  const lm = lap / n;
  return {
    sharp: Math.round(lap2 / n - lm * lm),
    mean: Math.round(mean),
    std: Math.round(std),
    dark: +(dark / px).toFixed(3),
    blown: +(blown / px).toFixed(3),
  };
}

async function cmdScore() {
  const q = existsSync(Q_FILE) ? JSON.parse(readFileSync(Q_FILE, 'utf8')) : {};
  const todo = photos.filter((p) => q[p.id] === undefined);
  console.log(`calidad: ${photos.length} fotos · pendientes ${todo.length}`);
  let i = 0, done = 0;
  const worker = async () => {
    while (i < todo.length) {
      const p = todo[i++];
      try { q[p.id] = await metrics(p.id); } catch { q[p.id] = null; }
      if (++done % 200 === 0) { writeFileSync(Q_FILE, JSON.stringify(q)); process.stdout.write(`\r  ${done}/${todo.length}`); }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  writeFileSync(Q_FILE, JSON.stringify(q));
  console.log(`\n✓ calidad → ${Q_FILE}`);
}

/* ───────────────────────── agrupación ───────────────────────── */
const popcnt = (x) => { let c = 0; while (x) { x &= x - 1n; c++; } return c; };
const hamming = (a, b) => (!a || !b ? 64 : popcnt(BigInt('0x' + a) ^ BigInt('0x' + b)));

function kindOf(p) {
  const m = meta[p.id] || {};
  const soft = (m.soft || '').toLowerCase();
  const make = (m.make || '').toLowerCase();
  const name = p.path.split(/[\\/]/).pop();
  if (/instagram/.test(soft)) return 'instagram';
  if (/whatsapp/.test(soft) || /^IMG-\d{8}-WA/i.test(name)) return 'whatsapp';
  if (m.ext === 'png' || /screenshot/i.test(name)) return 'captura';
  if (make) return 'camara';
  return 'otra';
}

async function cmdGroup() {
  const Q = JSON.parse(readFileSync(Q_FILE, 'utf8'));
  const FEAT = JSON.parse(readFileSync(join(CACHE, '_feat.json'), 'utf8'));
  const labels = existsSync(join(OUT_DIR, 'labels.json')) ? JSON.parse(readFileSync(join(OUT_DIR, 'labels.json'), 'utf8')) : {};
  const orgState = existsSync(join(OUT_DIR, 'organizer-state.json')) ? JSON.parse(readFileSync(join(OUT_DIR, 'organizer-state.json'), 'utf8')) : { assign: {} };
  const prevAssign = new Map(Object.entries(orgState.assign || {}).map(([path, album]) => [path.toLowerCase(), album]));

  const items = photos
    .map((p) => ({
      id: p.id, path: p.path, iso: p.iso, t: Date.parse(p.iso),
      kind: kindOf(p), q: Q[p.id] || null, hash: hashes[p.id] || null,
      prev: prevAssign.get(p.path.toLowerCase()) || null,
    }))
    .filter((p) => Number.isFinite(p.t))
    .sort((a, b) => a.t - b.t);
  const itemById = new Map(items.map((p) => [p.id, p]));

  const sharpVals = items.map((p) => p.q?.sharp || 0).filter((v) => v > 0).sort((a, b) => a - b);
  const p90 = sharpVals[Math.floor(sharpVals.length * 0.9)] || 1;
  const quality = (p) => {
    if (!p.q) return 0;
    const s = Math.min(1, (p.q.sharp || 0) / p90);
    const expo = 1 - Math.min(1, Math.abs(p.q.mean - 118) / 118);
    const contrast = Math.min(1, (p.q.std || 0) / 70);
    const clip = 1 - Math.min(1, (p.q.blown + p.q.dark) * 2);
    const m = meta[p.id] || {};
    const mp = m.w && m.h ? Math.min(1, (m.w * m.h) / 12e6) : 0.6;
    return +(0.46 * s + 0.2 * expo + 0.14 * contrast + 0.1 * clip + 0.1 * mp).toFixed(4);
  };

  // 1 · ráfagas y casi-duplicados consecutivos
  //    El dHash no sirve aquí: la mayoría de repeticiones son re-encuadres (mismo
  //    plano con otro zoom) y eso le dispara la distancia. Se usa histograma de
  //    color + correlación estructural con tolerancia al zoom.
  const BURST_SEC = Number(argOf('burst', 150));   // disparos seguidos del mismo plano
  const NEAR_MIN = Number(argOf('near', 20));      // misma escena repetida al rato
  // puntuación combinada: el color solo no basta (dos playas se parecen) y la
  // estructura sola tampoco (el sujeto se mueve), así que se promedian.
  const T1 = Number(argOf('t1', 0.64));            // umbral dentro de la ráfaga
  const T2 = Number(argOf('t2', 0.78));            // umbral hasta NEAR_MIN
  const MIN_S = 0.35, MIN_H = 0.55;
  const EXACT_T = 0.93;
  const DIVERSE_T = Number(argOf('diverse', 0.84)); // rescate de planos distintos
  const GAP_H = Number(argOf('gap', 14));

  const pairScore = (a, b) => {
    const fa = FEAT[a.id], fb = FEAT[b.id];
    if (!fa || !fb) return { score: 0, h: 0, s: 0 };
    const h = histSim(fa.h, fb.h);
    const s = structSim(fa.g, fb.g);
    return { score: 0.5 * h + 0.5 * s, h, s };
  };

  const same = (a, b) => {
    const dt = (b.t - a.t) / 1000;
    if (dt > NEAR_MIN * 60) return false;
    const { score, h, s } = pairScore(a, b);
    if (s < MIN_S || h < MIN_H) return false;
    return score >= (dt <= BURST_SEC ? T1 : T2);
  };

  const clusters = [];
  let cur = [items[0]];
  for (let i = 1; i < items.length; i++) {
    const a = items[i - 1], b = items[i];
    if (a.kind === b.kind && same(a, b)) cur.push(b);
    else { clusters.push(cur); cur = [b]; }
  }
  clusters.push(cur);

  // 2 · la mejor de cada grupo
  const keep = new Set(), drop = new Map();
  const clusterInfo = [];
  for (const c of clusters) {
    if (c.length === 1) { keep.add(c[0].id); continue; }
    const ranked = [...c].sort((x, y) => quality(y) - quality(x));
    const best = ranked[0];
    keep.add(best.id);
    // En tandas largas puede haber planos realmente distintos dentro del mismo
    // grupo (primer plano vs foto de grupo): se rescatan hasta 2 "segundas miradas"
    // si se parecen poco a lo ya guardado.
    const extras = Math.min(2, Math.floor(c.length / 5));
    const saved = [best];
    for (let k = 0; k < extras; k++) {
      let cand = null, worst = 1;
      for (const p of ranked.slice(1)) {
        if (saved.includes(p)) continue;
        const sim = Math.max(...saved.map((s) => pairScore(s, p).score));
        if (sim < worst) { worst = sim; cand = p; }
      }
      if (cand && worst < DIVERSE_T) { keep.add(cand.id); saved.push(cand); }
    }
    const tight = c.every((p, i) => {
      if (i === 0) return true;
      const fa = FEAT[c[i - 1].id], fb = FEAT[p.id];
      return fa && fb && 0.5 * histSim(fa.h, fb.h) + 0.5 * structSim(fa.g, fb.g) >= EXACT_T;
    });
    const reason = tight ? 'duplicada' : 'rafaga';
    for (const p of ranked.slice(1)) if (!keep.has(p.id)) drop.set(p.id, reason);
    clusterInfo.push({
      size: c.length, keep: best.id, ids: c.map((p) => p.id), reason,
      day: new Date(c[0].t).toISOString().slice(0, 10),
      spreadSec: Math.round((c[c.length - 1].t - c[0].t) / 1000),
      margin: +(quality(best) - quality(ranked[1])).toFixed(4),
    });
  }

  // 3 · duplicados exactos repartidos en el tiempo (copias, reenvíos)
  const exact = new Map();
  for (const p of items) {
    if (!p.hash || !keep.has(p.id)) continue;
    if (!exact.has(p.hash)) exact.set(p.hash, []);
    exact.get(p.hash).push(p);
  }
  let exactDropped = 0;
  for (const [, group] of exact) {
    if (group.length < 2) continue;
    const ranked = group.sort((x, y) => quality(y) - quality(x));
    for (const p of ranked.slice(1)) { keep.delete(p.id); drop.set(p.id, 'copia'); exactDropped++; }
  }

  // 4 · eventos por hueco temporal (solo fotos de cámara que sobreviven)
  const kept = items.filter((p) => keep.has(p.id) && p.kind === 'camara');
  const events = [];
  let ev = null;
  for (const p of kept) {
    if (!ev || (p.t - ev.end) / 3600000 > GAP_H) { ev = { id: events.length + 1, start: p.t, end: p.t, ids: [p.id] }; events.push(ev); }
    else { ev.end = p.t; ev.ids.push(p.id); }
  }
  for (const e of events) {
    const days = [...new Set(e.ids.map((id) => itemById.get(id).iso.slice(0, 10)))];
    e.days = days;
    e.n = e.ids.length;
    e.from = new Date(e.start).toISOString();
    e.to = new Date(e.end).toISOString();
    e.labelPlaces = [...new Set(days.map((d) => labels[d]?.place).filter(Boolean))];
    e.labelTags = [...new Set(days.flatMap((d) => labels[d]?.tags || []))];
    const prevAlbums = {};
    for (const id of e.ids) { const a = itemById.get(id).prev; if (a) prevAlbums[a] = (prevAlbums[a] || 0) + 1; }
    e.prevAlbums = prevAlbums;
    e.cover = [...e.ids].sort((a, b) => quality(itemById.get(b)) - quality(itemById.get(a)))[0];
  }

  const byKind = {};
  for (const p of items) byKind[p.kind] = (byKind[p.kind] || 0) + 1;
  const dropReasons = {};
  for (const [, r] of drop) dropReasons[r] = (dropReasons[r] || 0) + 1;

  const out = {
    generated: new Date().toISOString(),
    source: 'C:/Users/pafor/Pictures/iCloud Photos/Photos',
    params: { BURST_SEC, NEAR_MIN, T1, T2, MIN_S, MIN_H, EXACT_T, DIVERSE_T, GAP_H },
    totals: {
      indexed: items.length, byKind, keep: keep.size, drop: drop.size, dropReasons,
      exactDropped, camaraKeep: kept.length, events: events.length,
    },
    drop: Object.fromEntries([...drop]),
    clusters: clusterInfo.sort((a, b) => b.size - a.size),
    events,
  };
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(CUR_FILE, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out.totals, null, 1));
  console.log(`✓ → ${CUR_FILE}`);
}

/* ───────────────────────── contact sheets ───────────────────────── */
async function cmdSheets() {
  const cur = JSON.parse(readFileSync(CUR_FILE, 'utf8'));
  const SHEETS = join(CACHE, '_sheets');
  mkdirSync(SHEETS, { recursive: true });
  const args = process.argv.slice(3);
  const only = args.filter((a) => !a.startsWith('--')).map(Number);
  const MAX = Number((args.find((a) => a.startsWith('--max=')) || '--max=24').split('=')[1]);
  const COLS = 6, CELL = 180;
  let done = 0;
  for (const e of cur.events) {
    if (only.length && !only.includes(e.id)) continue;
    const ids = e.ids.length <= MAX ? e.ids : Array.from({ length: MAX }, (_, i) => e.ids[Math.round((i * (e.ids.length - 1)) / (MAX - 1))]);
    const rows = Math.ceil(ids.length / COLS);
    const tiles = [];
    for (let i = 0; i < ids.length; i++) {
      const buf = await sharp(src(ids[i]), { failOn: 'none' }).rotate().resize(CELL, CELL, { fit: 'cover' }).toBuffer();
      tiles.push({ input: buf, left: (i % COLS) * CELL, top: Math.floor(i / COLS) * CELL });
    }
    const file = join(SHEETS, `ev${String(e.id).padStart(3, '0')}.jpg`);
    await sharp({ create: { width: COLS * CELL, height: rows * CELL, channels: 3, background: { r: 17, g: 17, b: 17 } } })
      .composite(tiles).jpeg({ quality: 70 }).toFile(file);
    process.stdout.write(`\r  ${++done} sheets`);
  }
  console.log(`\n✓ contact sheets → ${SHEETS}`);
}

const cmd = process.argv[2];
if (cmd === 'hash') await cmdHash();
else if (cmd === 'score') await cmdScore();
else if (cmd === 'group') await cmdGroup();
else if (cmd === 'sheets') await cmdSheets();
else console.error('Uso: node scripts/curate.mjs score|group|sheets');
