import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/zea/';
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','6','-i',D+'aftermovie.mp4','-frames:v','1','-y',SP+'/zea-v.jpg']);
const fotos=readdirSync(D).filter(f=>f.endsWith('.jpeg')).sort();
const items=[['aftermovie',SP+'/zea-v.jpg'],...fotos.map(f=>[f.replace('.jpeg',''),D+f])];
const COLS=7,CELL=230,PAD=4;const rows=Math.ceil(items.length/COLS);
const tiles=[],labels=[];
for(let i=0;i<items.length;i++){
  const [lbl,src]=items[i];
  const m=await sharp(src).metadata();
  const x=(i%COLS)*CELL,y=Math.floor(i/COLS)*CELL;
  tiles.push({input:await sharp(src).resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:80}).toBuffer(),left:x+PAD,top:y+PAD});
  const t=lbl+' '+m.width+'x'+m.height;
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${t.length*6+6}" height="14" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+10}" font-family="Arial" font-size="9" fill="#0f0">${t}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:80}).toFile(SP+'/zea.jpg');
console.log('hoja lista');
