import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
const CACHE='C:/Users/pafor/.fotos-organizer/eaeac24834';
const SITE=join(CACHE,'album'), THUMBS=join(CACHE,'_thumbs');
const photos=JSON.parse(readFileSync(join(CACHE,'_index.json'),'utf8'));
const byId=new Map(photos.map(p=>[p.id,p]));
const faltan=new Set();
for(const f of readdirSync(SITE).filter(x=>x.endsWith('.html'))){
  const html=readFileSync(join(SITE,f),'utf8');
  for(const m of html.matchAll(/\.\.\/_thumbs\/([0-9]+)(_l)?\.webp/g))
    if(!existsSync(join(THUMBS,m[1]+(m[2]||'')+'.webp'))) faltan.add(m[1]+(m[2]||''));
}
console.log('miniaturas a generar:',faltan.size);
let ok=0,err=0;
for(const name of faltan){
  const big=name.endsWith('_l');
  const id=Number(big?name.slice(0,-2):name);
  const p=byId.get(id);
  if(!p){err++;continue;}
  try{
    const buf=await sharp(p.path,{failOn:'none'}).rotate()
      .resize(big?1400:190,big?1400:190,{fit:'inside',withoutEnlargement:true})
      .webp({quality:big?82:62}).toBuffer();
    writeFileSync(join(THUMBS,name+'.webp'),buf); ok++;
  }catch{ err++; }
}
console.log(`✓ generadas ${ok} · fallidas ${err}`);
