import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const m=await b.newPage();
await m.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true});
await m.goto('file:///C:/Users/pafor/proyectos/agencia/proto/index.html',{waitUntil:'networkidle0'});
await m.evaluate(()=>scrollTo(0,1150)); await new Promise(r=>setTimeout(r,900));
await m.screenshot({path:SP+'/ag-mobile2.png'});
await b.close(); console.log('ok');
