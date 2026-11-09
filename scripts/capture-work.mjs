/**
 * Captura material de portfolio de las webs en producción.
 *
 * En vez de un vídeo de scroll, saca una RÁFAGA de fotogramas: las secciones
 * de la home más las páginas internas del menú. El índice de la web los pasa
 * a cortes secos, que enseñan mucho más que un scroll lento.
 *
 * Salida: public/images/work/<slug>-01.jpg ... -NN.jpg
 *
 * Uso:  node scripts/capture-work.mjs [slug...]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const SITES = [
  { slug: 'fontanet', url: 'https://fontanettgn.es' },
  { slug: 'arqvs', url: 'https://arqvs.es' },
  { slug: 'limboo', url: 'https://limboobeachclub.com' },
  { slug: 'zea', url: 'https://zealbatarrec.com' },
  { slug: 'longplay', url: 'https://longplaytorredembarra.com' },
  { slug: 'rodaventura', url: 'https://rodaventura.es' },
  { slug: 'craftline', url: 'https://craftline.es' },
  { slug: 'sanros', url: 'https://sanros.es' },
];

/** Un dominio aparcado devuelve 200 igual que una web real: hay que mirar el contenido. */
const PARKED =
  /godaddy|this domain|domain (is )?(for sale|parked)|sedoparking|afternic|parkingcrew|buy this domain/i;

/** Páginas que no aportan nada a un portfolio. */
const BORING =
  /cookie|privac|legal|terme|termino|condicion|avis|aviso|login|acces|carrito|cart|checkout/i;

const OUT = 'public/images/work';
const VIEWPORT = { width: 1280, height: 800 };
const MAX_FRAMES = 9;
const MAX_INNER_PAGES = 3;

const args = process.argv.slice(2);
const wanted = args.filter((a) => !a.startsWith('--'));
const targets = wanted.length ? SITES.filter((s) => wanted.includes(s.slug)) : SITES;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Hay webs que no scrollean la ventana sino un contenedor interno
 * (`overflow-y: scroll` a pantalla completa, típico de layouts con snap).
 * Sin esto, `body.scrollHeight` mide una pantalla y la ráfaga sale de un
 * solo fotograma. Se reinyecta tras cada navegación.
 */
async function installHelpers(page) {
  await page.evaluate(() => {
    window.__pf = {
      scroller() {
        if (document.documentElement.scrollHeight > window.innerHeight + 100) return null;
        let best = null;
        let bestHeight = 0;
        for (const el of document.querySelectorAll('div, main, section')) {
          const overflow = getComputedStyle(el).overflowY;
          if (
            (overflow === 'auto' || overflow === 'scroll') &&
            el.scrollHeight > el.clientHeight + 200 &&
            el.scrollHeight > bestHeight
          ) {
            best = el;
            bestHeight = el.scrollHeight;
          }
        }
        return best;
      },
      metrics() {
        const el = window.__pf.scroller();
        return el
          ? { height: el.clientHeight, max: el.scrollHeight - el.clientHeight }
          : {
              height: window.innerHeight,
              max: document.documentElement.scrollHeight - window.innerHeight,
            };
      },
      scrollTo(y) {
        const el = window.__pf.scroller();
        if (el) el.scrollTop = y;
        else window.scrollTo(0, y);
      },
      offsetOf(node) {
        const el = window.__pf.scroller();
        if (!el) return node.getBoundingClientRect().top + window.scrollY;
        return (
          node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
        );
      },
    };
  });
}

async function dismissCookies(page) {
  await page.evaluate(() => {
    // Palabra suelta, no subcadena: "cookies" contiene "ok" y nos llevaba a la página legal.
    const re =
      /^(aceptar|acceptar|accept|accept all|aceptar todo|aceptar todas|acceptar-ho tot|entendido|entès|de acuerdo|ok|got it|allow all)\b/;
    for (const el of document.querySelectorAll('button, [role="button"]')) {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text.length < 40 && re.test(text)) {
        el.click();
        return;
      }
    }
  });
  await wait(700);
}

/** Fuerza la carga de imágenes lazy recorriendo la página y volviendo arriba. */
async function preload(page) {
  await page.evaluate(async () => {
    const { height, max } = window.__pf.metrics();
    // Tope de pasadas: hay páginas de 20 pantallas y el evaluate agotaba el protocolTimeout.
    const limit = Math.min(max, height * 14);
    for (let y = 0; y <= limit; y += height) {
      window.__pf.scrollTo(y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.__pf.scrollTo(0);
    document
      .querySelectorAll('img[loading="lazy"]')
      .forEach((img) => img.removeAttribute('loading'));
  });
  await wait(1100);
}

/**
 * Posiciones de scroll donde empieza cada bloque con entidad propia.
 * Si la web no usa <section>, cae a cortes cada pantalla.
 */
async function sectionOffsets(page) {
  return page.evaluate(() => {
    const candidates = [
      ...document.querySelectorAll('main > *, body > section, section, [data-section]'),
    ];
    const { height, max } = window.__pf.metrics();

    const tops = candidates
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        // El footer es una sección como cualquier otra para el DOM, pero
        // un pie de página con avisos legales no vende ningún proyecto.
        if (el.closest('footer')) return false;
        return rect.height > 280 && style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((el) => window.__pf.offsetOf(el));

    const fallback = [];
    for (let y = 0; y <= max; y += height * 0.9) fallback.push(y);

    // Ordena, recorta al alto real y descarta bloques casi pegados.
    const dedupe = (list) => {
      const seen = [];
      for (const top of [...list].sort((a, b) => a - b)) {
        const y = Math.max(0, Math.min(top, max));
        if (!seen.length || y - seen[seen.length - 1] > height * 0.55) seen.push(y);
      }
      return seen;
    };

    // Si las secciones colapsan en uno o dos cortes, tira de pantallas.
    const bySection = dedupe(tops);
    return bySection.length >= 3 ? bySection : dedupe(fallback);
  });
}

/**
 * Páginas internas que merezca la pena fotografiar. Primero el menú; si la
 * web es de una sola página y su menú son anclas (ARQVS), se busca en todo
 * el documento. Prioriza una por área antes de repetir sección.
 */
async function innerLinks(page, origin) {
  const collect = async (scopeSelector) =>
    page.evaluate(
      (origin, scopeSelector) => {
        const scope = scopeSelector
          ? document.querySelector(scopeSelector) || document.body
          : document.body;
        return [...scope.querySelectorAll('a[href]')]
          .map((a) => a.href)
          .filter((href) => href.startsWith(origin));
      },
      origin,
      scopeSelector
    );

  const paths = (links) => {
    const seen = new Set();
    const out = [];
    for (const href of links) {
      const key = new URL(href).pathname.replace(/\/$/, '');
      // La home y las anclas dan pathname vacío: no son páginas nuevas.
      if (!key || seen.has(key) || BORING.test(key)) continue;
      seen.add(key);
      out.push(key);
    }
    return out;
  };

  let candidates = paths(await collect('header, nav'));
  if (!candidates.length) candidates = paths(await collect(null));

  // Una por primer segmento de ruta, para no llevarse tres galerías
  // seguidas antes que la página de eventos.
  const byArea = [];
  const rest = [];
  const areas = new Set();
  for (const key of candidates) {
    const area = key.split('/')[1] || '';
    if (areas.has(area)) rest.push(key);
    else {
      areas.add(area);
      byArea.push(key);
    }
  }

  return [...byArea, ...rest].slice(0, MAX_INNER_PAGES).map((key) => origin + key);
}

async function shootSections(page, slug, counter, budget) {
  const offsets = await sectionOffsets(page);
  let taken = 0;

  for (const y of offsets) {
    if (counter.n >= MAX_FRAMES || taken >= budget) break;
    await page.evaluate((y) => window.__pf.scrollTo(y), y);
    await wait(650);
    counter.n += 1;
    taken += 1;
    await page.screenshot({
      path: path.join(OUT, `${slug}-${String(counter.n).padStart(2, '0')}.jpg`),
      type: 'jpeg',
      quality: 76,
    });
  }
  return taken;
}

async function capture(browser, site) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(1600);
  await installHelpers(page);

  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 600));
  if (PARKED.test(title) || PARKED.test(bodyText)) {
    await page.close();
    throw new Error(`dominio aparcado, no es la web real (título: "${title}")`);
  }

  await dismissCookies(page);
  await preload(page);

  const counter = { n: 0 };
  await shootSections(page, site.slug, counter, 5);

  const origin = new URL(site.url).origin;
  const pages = await innerLinks(page, origin);

  for (const inner of pages) {
    if (counter.n >= MAX_FRAMES) break;
    try {
      await page.goto(inner, { waitUntil: 'networkidle2', timeout: 45000 });
      await wait(1400);
      await installHelpers(page);
      await preload(page);
      await shootSections(page, site.slug, counter, 2);
    } catch {
      /* una página interna caída no debe tumbar la ráfaga entera */
    }
  }

  await page.close();
  return counter.n;
}

const browser = await puppeteer.launch({
  headless: 'new',
  protocolTimeout: 180000,
  args: ['--no-sandbox', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});

await fs.mkdir(OUT, { recursive: true });

for (const site of targets) {
  // Limpia los fotogramas anteriores de este slug: si ahora salen menos,
  // quedarían sueltos los viejos y el índice los seguiría pidiendo.
  const existing = await fs.readdir(OUT);
  await Promise.all(
    existing
      .filter((f) => new RegExp(`^${site.slug}-\\d\\d\\.jpg$`).test(f))
      .map((f) => fs.rm(path.join(OUT, f), { force: true }))
  );

  process.stdout.write(`→ ${site.slug} ... `);
  try {
    const frames = await capture(browser, site);
    console.log(`${frames} fotogramas`);
  } catch (err) {
    console.log(`FALLO: ${err.message}`);
  }
}

await browser.close();
