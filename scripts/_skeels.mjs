import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D='C:/Users/pafor/Downloads/';
const files=[['detall-1','detall-1 (1).webp'],['detall-2','detall-2 (1).webp'],['detall-3','detall-3.webp'],
 ['packaging-front','packaging-front.webp'],['packaging-front(1)','packaging-front (1).webp'],['gallery-4','gallery-4.webp']];
// fotograma del vídeo
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i','C:/Users/pafor/OneDrive/Escritorio/Grabación 2026-10-07 152448.mp4','-frames:v','1','-y',SP+'/vid-frame.jpg']);
files.push(['VÍDEO (frame)',null]);
const COLS=4, CELL=300, PAD=6;
const rows=Math.ceil(files.length/COLS);
const tiles=[],labels=[];
for(let i=0;i<files.length;i++){
  const [name,f]=files[i];
  const src = f ? D+f : SP+'/vid-frame.jpg';
  const x=(i%COLS)*CELL, y=Math.floor(i/COLS)*CELL;
  const buf=await sharp(src,{failOn:'none'}).resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:84}).toBuffer();
  tiles.push({input:buf,left:x+PAD,top:y+PAD});
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="150" height="17" fill="#000" opacity="0.8"/><text x="${x+PAD+4}" y="${y+PAD+13}" font-family="Arial" font-size="11" fill="#0f0">${name}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:82}).toFile(SP+'/skeels.jpg');
console.log('ok');
