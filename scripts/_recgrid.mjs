import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const C='C:/Users/pafor/.fotos-organizer/eaeac24834';
const idx=JSON.parse(fs.readFileSync(C+'/_index.json','utf8'));
const byId=new Map(idx.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync('src/content/fotos/recurring.json','utf8'));
const srcf=(id)=>{const a=path.join(C,'_thumbs',id+'_l.webp'),b=path.join(C,'_thumbs',id+'.webp');return fs.existsSync(a)?a:fs.existsSync(b)?b:byId.get(id).path;};
const start=Number(process.argv[2]), end=Number(process.argv[3]);
const COLS=9, CELL=130;
const rows=Math.min(end,data.groups.length)-start+1;
const tiles=[],labels=[];
for(let r=0;r<rows;r++){
  const gi=start-1+r; const g=data.groups[gi]; if(!g) break;
  const ids=g.ids.slice(0,COLS-1);
  for(let i=0;i<ids.length;i++){
    let buf;
    try{ buf=await sharp(srcf(ids[i]),{failOn:'none'}).rotate().resize(CELL,CELL,{fit:'cover'}).toBuffer(); }
    catch{ buf=await sharp({create:{width:CELL,height:CELL,channels:3,background:{r:60,g:60,b:60}}}).jpeg().toBuffer(); }
    tiles.push({input:buf,left:(i+1)*CELL,top:r*CELL});
  }
  labels.push(`<rect x="0" y="${r*CELL}" width="${CELL}" height="${CELL}" fill="#000"/><text x="6" y="${r*CELL+24}" font-family="Arial" font-size="15" fill="#0f0">#${gi+1}</text><text x="6" y="${r*CELL+46}" font-family="Arial" font-size="11" fill="#fff">${g.n}f ${g.days}d</text><text x="6" y="${r*CELL+64}" font-family="Arial" font-size="10" fill="#aaa">${g.from.slice(2)}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
const out=`${C}/_sheets/recurring-${start}-${end}.jpg`;
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:17}}}).composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:70}).toFile(out);
console.log('✓',out);
