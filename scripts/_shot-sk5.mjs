import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage();
await p.setViewport({width:1500,height:1000});
await p.goto('http://localhost:3100/trabajo/skeels',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
await p.screenshot({path:SP+'/sk5-top.png'});
// probar el botón de dar la vuelta
const btn=await p.$('button[aria-label]');
if(btn){ await btn.click(); await new Promise(r=>setTimeout(r,700)); await p.screenshot({path:SP+'/sk5-flip.png'}); }
await p.evaluate(()=>{const m=document.querySelector('.mosaic');scrollTo(0,m.getBoundingClientRect().top+scrollY-10);});
await new Promise(r=>setTimeout(r,1200));
await p.screenshot({path:SP+'/sk5-mosaic.png'});
const m=await b.newPage();
await m.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true});
await m.goto('http://localhost:3100/trabajo/skeels',{waitUntil:'networkidle0'});
await m.evaluate(()=>{const g=document.querySelector('.mosaic');scrollTo(0,g.getBoundingClientRect().top+scrollY-4);});
await new Promise(r=>setTimeout(r,1000));
await m.screenshot({path:SP+'/sk5-mob.png'});
await b.close(); console.log('ok');
