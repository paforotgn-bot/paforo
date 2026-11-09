import puppeteer from 'puppeteer';
const b=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1500,height:1000});
await p.goto('http://localhost:3100/trabajo/skeels',{waitUntil:'networkidle0'});
const info=await p.evaluate(()=>{
  const m=document.querySelector('.mosaic');
  const blocks=[...document.querySelectorAll('.mosaic-block')];
  const cs=getComputedStyle(m);
  return {
    mosaic:{display:cs.display,cols:cs.gridTemplateColumns,width:m.getBoundingClientRect().width},
    blocks:blocks.map(bl=>{const c=getComputedStyle(bl);const r=bl.getBoundingClientRect();
      return {display:c.display,ratio:c.aspectRatio,cols:c.gridTemplateColumns,
        varCols:bl.style.getPropertyValue('--cols'),varRatio:bl.style.getPropertyValue('--ratio'),
        w:Math.round(r.width),h:Math.round(r.height),cells:bl.children.length};}),
  };
});
console.log(JSON.stringify(info,null,1));
await b.close();
