import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const T=SP+'/tees/TEES/';
const names=['1','1-1','2','2-1','3','3-1','4','4-1','5','5-1','6','7','8','9','10','11','THUMBNAIL'];
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',T+'EventVibe_NoWaltz_Skeels.prproj.mp4','-vf','fps=1/6,scale=180:-1,tile=6x1','-frames:v','1','-y',SP+'/nw-video.jpg']);
const COLS=6, CELL=260, PAD=5;
const rows=Math.ceil(names.length/COLS);
const tiles=[],labels=[];
for(let i=0;i<names.length;i++){
  const x=(i%COLS)*CELL, y=Math.floor(i/COLS)*CELL;
  const buf=await sharp(T+names[i]+'.png').resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:82}).toBuffer();
  tiles.push({input:buf,left:x+PAD,top:y+PAD});
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="110" height="16" fill="#000" opacity="0.8"/><text x="${x+PAD+4}" y="${y+PAD+12}" font-family="Arial" font-size="11" fill="#0f0">${names[i]}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:80}).toFile(SP+'/nowaltz.jpg');
console.log('ok');
