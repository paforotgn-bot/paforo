import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage();
await p.setViewport({width:1400,height:900});
for(const [slug,file] of [['oravia','or']]){
  const r=await p.goto('http://localhost:3100/trabajo/'+slug,{waitUntil:'networkidle0'});
  await new Promise(x=>setTimeout(x,2000));
  await p.screenshot({path:SP+'/'+file+'.png',fullPage:true});
  console.log(slug, r.status());
}
await b.close();
