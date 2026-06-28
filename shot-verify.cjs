const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 760, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3137/es', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: 'v-top.jpg', type: 'jpeg', quality: 90 });
  // also check an inner page still clears the navbar
  await page.goto('http://localhost:3137/es/casos', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'v-inner.jpg', type: 'jpeg', quality: 90 });
  await browser.close();
})();
