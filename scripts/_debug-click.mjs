import puppeteer from 'puppeteer';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
p.on('console',m=>console.log('  [navegador]',m.text()));
await p.goto('http://localhost:3100/',{waitUntil:'networkidle0'});
await p.setViewport({width:1500,height:900});
await new Promise(r=>setTimeout(r,1500));
await p.evaluate(()=>{
  window.addEventListener('click',e=>console.log('click en:',e.target.tagName, e.target.className||'', 'defaultPrevented='+e.defaultPrevented),true);
  window.addEventListener('click',e=>console.log('burbuja final:',e.target.tagName,'defaultPrevented='+e.defaultPrevented));
});
const box=await p.evaluate(()=>{const c=document.querySelectorAll('.work-card')[0];const r=c.getBoundingClientRect();
  return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
console.log('punto de clic:',box);
console.log('elemento en ese punto:', await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y);return e.tagName+'.'+e.className;},box));
await p.mouse.click(box.x,box.y);
await new Promise(r=>setTimeout(r,1200));
console.log('ruta:', await p.evaluate(()=>location.pathname));
await b.close();
