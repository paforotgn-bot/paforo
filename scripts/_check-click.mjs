import puppeteer from 'puppeteer';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1500,height:900});
await p.goto('http://localhost:3100/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
// clic limpio sobre una tarjeta
const box=await p.evaluate(()=>{const c=document.querySelectorAll('.work-card')[0];const r=c.getBoundingClientRect();
  return {x:r.x+r.width/2,y:r.y+r.height/2,href:c.getAttribute('href')};});
console.log('tarjeta:',box.href);
await p.mouse.click(box.x,box.y);
await new Promise(r=>setTimeout(r,1500));
console.log('tras clic limpio →', await p.evaluate(()=>location.pathname));

// ahora comprobamos que arrastrando NO navega
await p.goto('http://localhost:3100/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
const b2=await p.evaluate(()=>{const c=document.querySelectorAll('.work-card')[0];const r=c.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
await p.mouse.move(b2.x,b2.y); await p.mouse.down();
for(let i=1;i<=10;i++){await p.mouse.move(b2.x-i*12,b2.y-i*6);await new Promise(r=>setTimeout(r,16));}
await p.mouse.up();
await new Promise(r=>setTimeout(r,1200));
console.log('tras arrastrar  →', await p.evaluate(()=>location.pathname));
await b.close();
