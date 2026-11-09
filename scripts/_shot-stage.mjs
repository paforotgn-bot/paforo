import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1500,height:950});
await p.goto('file:///C:/Users/pafor/proyectos/agencia/proto/index.html',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1200));
await p.screenshot({path:SP+'/st1.png'});
// simula el cursor encima de una tarjeta
await p.mouse.move(700,480); await new Promise(r=>setTimeout(r,800));
await p.screenshot({path:SP+'/st2.png'});
// arrastra
await p.mouse.move(1100,700); await p.mouse.down();
for(let i=0;i<12;i++){ await p.mouse.move(1100-i*28,700-i*14); await new Promise(r=>setTimeout(r,16)); }
await p.mouse.up(); await new Promise(r=>setTimeout(r,900));
await p.screenshot({path:SP+'/st3.png'});
const m=await b.newPage();
await m.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
await m.goto('file:///C:/Users/pafor/proyectos/agencia/proto/index.html',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1200));
await m.screenshot({path:SP+'/st-mob.png'});
await b.close(); console.log('ok');
