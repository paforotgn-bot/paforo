import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage();
await p.setViewport({width:1400,height:900});
await p.goto('http://localhost:3100/trabajo/skeels',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
await p.screenshot({path:SP+'/full.png',fullPage:true});
const g=await p.evaluate(()=>{
  const m=document.querySelector('.mosaic');
  return [...m.children].map(c=>{const s=getComputedStyle(c);const r=c.getBoundingClientRect();
    return {col:s.gridColumn,row:s.gridRow,w:Math.round(r.width),h:Math.round(r.height)};});
});
console.log(JSON.stringify(g,null,0));
await b.close();
