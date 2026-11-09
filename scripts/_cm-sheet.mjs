import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/canmatt/CANMATT/';
const P=D+'PICS EDIT/';
for(const [n,f] of [['v1','DiaCanmatt'],['v2','LifestyleTgn_3'],['v3','MakingOf']])
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','5','-i',D+f+'.mp4','-frames:v','1','-y',SP+'/cm-'+n+'.jpg']);
const todas=readdirSync(P).filter(f=>f.endsWith('.jpg')&&!f.startsWith('._')).sort();
// una muestra repartida de las 57 fotos
const muestra=Array.from({length:21},(_,i)=>todas[Math.round(i*(todas.length-1)/20)]);
const items=[['v1 DiaCanmatt',SP+'/cm-v1.jpg'],['v2 Lifestyle',SP+'/cm-v2.jpg'],['v3 MakingOf',SP+'/cm-v3.jpg'],
  ...muestra.map(f=>[f.replace('Coworking_CANMATT26_ROCH_n_VibePics','CW').replace('HabPilot_CanMatt','HAB').replace('.jpg',''),P+f])];
const COLS=8,CELL=200,PAD=3;const rows=Math.ceil(items.length/COLS);
const tiles=[],labels=[];
for(let i=0;i<items.length;i++){
  const [lbl,src]=items[i];
  const x=(i%COLS)*CELL,y=Math.floor(i/COLS)*CELL;
  tiles.push({input:await sharp(src).resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:78}).toBuffer(),left:x+PAD,top:y+PAD});
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${lbl.length*6+6}" height="14" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+10}" font-family="Arial" font-size="9" fill="#0f0">${lbl}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:78}).toFile(SP+'/canmatt.jpg');
console.log('fotos totales:',todas.length,'| hoja lista');
