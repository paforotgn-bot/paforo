import puppeteer from 'puppeteer';
const b = await puppeteer.launch();
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 1000 });
await p.goto(process.argv[2], { waitUntil: 'networkidle0' });
await p.screenshot({ path: process.argv[3] });
await b.close();
console.log('ok');
