import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage();
await p.setViewport({width:1400,height:900});
await p.goto('http://localhost:3100/trabajo/sanros',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,2500));
await p.screenshot({path:SP+'/sr2-full.png',fullPage:true});
await b.close(); console.log('ok');
