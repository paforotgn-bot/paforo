import puppeteer from 'puppeteer';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1400,height:1000});
const r=await p.goto('http://localhost:3100/contacto',{waitUntil:'networkidle0'});
await new Promise(x=>setTimeout(x,800));
await p.screenshot({path:SP+'/con.png',fullPage:true});
console.log('contacto', r.status());
// probar el envío sin configuración: debe avisar con claridad
await p.type('input[name="nombre"]','Prueba');
await p.type('input[name="email"]','prueba@ejemplo.com');
await p.type('textarea[name="mensaje"]','Mensaje de prueba');
await p.click('button[type="submit"]');
await new Promise(x=>setTimeout(x,1500));
await p.screenshot({path:SP+'/con-error.png'});
console.log('aviso:', await p.evaluate(()=>document.querySelector('form span.text-accent')?.textContent ?? '—'));
await b.close();
