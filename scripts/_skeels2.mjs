import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/skeels/';
const D='C:/Users/pafor/Downloads/';
const VID='C:/Users/pafor/OneDrive/Escritorio/Grabación 2026-10-07 154529.mp4';
for(const [name,f] of [['producte-front','producte-front.webp'],['producte-back','producte-back (1).webp']]){
  await sharp(D+f).resize(1600,1600,{fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(OUT+name+'.webp');
  console.log(name,(statSync(OUT+name+'.webp').size/1024).toFixed(0)+' KB');
}
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',VID,'-an','-vcodec','libx264','-crf','28','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+'preventa.mp4']);
console.log('preventa.mp4',(statSync(OUT+'preventa.mp4').size/1024).toFixed(0)+' KB  (antes 2892 KB)');
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',VID,'-frames:v','1','-y',OUT+'_f.jpg']);
await sharp(OUT+'_f.jpg').webp({quality:80}).toFile(OUT+'preventa-poster.webp');
console.log('poster listo');
