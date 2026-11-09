import puppeteer from 'puppeteer';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1500,height:900});
await p.goto('http://localhost:3100/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1200));
const m=await p.evaluate(()=>({
  bodyScrollH:document.body.scrollHeight, docScrollH:document.documentElement.scrollHeight,
  inner:innerHeight,
  htmlOverflow:getComputedStyle(document.documentElement).overflow,
  bodyOverflow:getComputedStyle(document.body).overflow,
  mainH:document.querySelector('main')?.getBoundingClientRect().height,
}));
console.log(JSON.stringify(m,null,1));
await p.evaluate(()=>scrollTo(0,400));
await new Promise(r=>setTimeout(r,300));
console.log('scrollY tras intentar bajar:', await p.evaluate(()=>scrollY));
await b.close();
