/**
 * Capturas de la web propia en local, para revisar el diseño.
 * Uso: node scripts/shot-local.mjs <directorio-salida> [puerto]
 */
import puppeteer from 'puppeteer';

const OUT = process.argv[2];
const PORT = process.argv[3] || '3137';
const BASE = `http://localhost:${PORT}`;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: 'new',
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`${BASE}/es`, { waitUntil: 'networkidle2', timeout: 60000 });
await wait(2000);

await page.screenshot({ path: `${OUT}/home-hero.jpg`, type: 'jpeg', quality: 85 });

// El índice de trabajo, y el mismo índice con una fila en hover.
const index = await page.$('#trabajo');
if (index) {
  await index.scrollIntoView();
  await wait(900);
  await page.screenshot({ path: `${OUT}/home-index.jpg`, type: 'jpeg', quality: 85 });

  const rows = await page.$$('#trabajo li a, #trabajo li div');
  if (rows[2]) {
    await rows[2].hover();
    await wait(2200); // que arranque el vídeo
    await page.screenshot({ path: `${OUT}/home-hover.jpg`, type: 'jpeg', quality: 85 });
  }
}

for (const [name, selector] of [
  ['home-about', '#sobre-mi'],
  ['home-contacto', '#contacto'],
]) {
  const el = await page.$(selector);
  if (el) {
    await el.scrollIntoView();
    await wait(700);
    await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 85 });
  }
}

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
await wait(1800);
await page.screenshot({ path: `${OUT}/mobile-hero.jpg`, type: 'jpeg', quality: 85 });
await page.evaluate(() => document.querySelector('#trabajo')?.scrollIntoView());
await wait(1200);
await page.screenshot({ path: `${OUT}/mobile-index.jpg`, type: 'jpeg', quality: 85 });

await browser.close();
console.log('capturas listas en', OUT);
