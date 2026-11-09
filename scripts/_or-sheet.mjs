import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const P='C:/Users/pafor/proyectos/oravia travel group/sportsincoming/public/';
for(const [n,f] of [['v1','videos/hero-oravia-v2'],['v2','tournaments/hero'],['v3','communities/rugby/hero'],['v4','communities/swimming/hero']])
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','5','-i',P+f+'.mp4','-frames:v','1','-y',SP+'/or-'+n+'.jpg']);
const collage=readdirSync(P+'collage').filter(f=>f.endsWith('.jpg')).sort();
const muestra=Array.from({length:12},(_,i)=>collage[Math.round(i*(collage.length-1)/11)]);
const items=[['v1 hero',SP+'/or-v1.jpg'],['v2 tournaments',SP+'/or-v2.jpg'],['v3 rugby',SP+'/or-v3.jpg'],['v4 swim',SP+'/or-v4.jpg'],
  ...muestra.map(f=>[f.replace('.jpg',''),P+'collage/'+f])];
const COLS=8,CELL=210,PAD=4;const rows=Math.ceil(items.length/COLS);
const tiles=[],labels=[];
for(let i=0;i<items.length;i++){
  const [lbl,src]=items[i];
  const m=await sharp(src).metadata();
  const x=(i%COLS)*CELL,y=Math.floor(i/COLS)*CELL;
  tiles.push({input:await sharp(src).resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:78}).toBuffer(),left:x+PAD,top:y+PAD});
  const t=lbl+' '+m.width+'x'+m.height;
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${t.length*6+6}" height="14" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+10}" font-family="Arial" font-size="9" fill="#0f0">${t}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:78}).toFile(SP+'/oravia.jpg');
console.log('collage total:',collage.length,'| hoja lista');
