import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/venom/VENOM FITNESS/FOTOS/';
async function sheet(files,out,cols,cell){
  const rows=Math.ceil(files.length/cols);const tiles=[],labels=[];const PAD=4;
  for(let i=0;i<files.length;i++){
    const x=(i%cols)*cell,y=Math.floor(i/cols)*cell;
    try{ tiles.push({input:await sharp(D+files[i]).resize(cell-PAD*2,cell-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:80}).toBuffer(),left:x+PAD,top:y+PAD}); }catch{}
    const lbl=files[i].replace('Sin título-1_','').replace('.jpg','').replace('.png','');
    labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${lbl.length*6+8}" height="15" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+11}" font-family="Arial" font-size="10" fill="#0f0">${lbl}</text>`);
  }
  const svg=Buffer.from(`<svg width="${cols*cell}" height="${rows*cell}">${labels.join('')}</svg>`);
  await sharp({create:{width:cols*cell,height:rows*cell,channels:3,background:{r:17,g:17,b:19}}})
    .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:78}).toFile(out);
}
const pngs=['1.png','11.png','2.png','22.png','3.png','33.png','4.png','44.png','5.png','55.png','6.png','66.png'];
await sheet(pngs,SP+'/venom-creativos.jpg',6,260);
const jpgs=readdirSync(D).filter(f=>f.endsWith('.jpg')).sort();
await sheet(jpgs,SP+'/venom-fotos.jpg',8,190);
console.log('creativos:',pngs.length,'| fotos:',jpgs.length);
