import puppeteer from 'puppeteer';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1500,height:900});
await p.goto('http://localhost:3100/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1200));
const before=await p.evaluate(()=>document.querySelector('.work-card').style.transform);
// rueda: debe mover el lienzo, no la página
await p.mouse.move(750,450);
await p.mouse.wheel({deltaY:500});
await new Promise(r=>setTimeout(r,500));
const after=await p.evaluate(()=>document.querySelector('.work-card').style.transform);
console.log('html overflow:', await p.evaluate(()=>getComputedStyle(document.documentElement).overflow));
console.log('scrollY:', await p.evaluate(()=>scrollY));
console.log('el lienzo se movió con la rueda:', before!==after);
// y al entrar en una ficha el scroll vuelve
await p.goto('http://localhost:3100/trabajo/skeels',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,800));
await p.evaluate(()=>scrollTo(0,600));
await new Promise(r=>setTimeout(r,400));
console.log('en la ficha scrollY:', await p.evaluate(()=>scrollY));
await b.close();
