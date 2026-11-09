/**
 * Convierte un HTML en PDF (A4) con Puppeteer, en local.
 * Uso: node scripts/render-pdf.mjs <input.html> <output.pdf> ["Título cabecera"]
 */
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

const [inHtml, outPdf, headerTitle = ''] = process.argv.slice(2);
if (!inHtml || !outPdf) { console.error('Uso: node scripts/render-pdf.mjs <in.html> <out.pdf> ["título"]'); process.exit(1); }

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve(inHtml)).href, { waitUntil: 'networkidle0' });
await page.pdf({
  path: resolve(outPdf),
  format: 'A4',
  printBackground: true,
  margin: { top: '18mm', bottom: '16mm', left: '16mm', right: '16mm' },
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size:7px;color:#999;width:100%;padding:0 16mm;text-align:right;font-family:Arial">${headerTitle}</div>`,
  footerTemplate: `<div style="font-size:8px;color:#777;width:100%;padding:0 16mm;text-align:center;font-family:Arial"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
});
await browser.close();
console.log(`✓ PDF generado: ${outPdf}`);
