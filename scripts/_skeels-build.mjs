import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/skeels/';
const D='C:/Users/pafor/Downloads/';
const VID='C:/Users/pafor/OneDrive/Escritorio/Grabación 2026-10-07 152448.mp4';
const imgs=[['detall-1','detall-1 (1).webp'],['detall-2','detall-2 (1).webp'],['detall-3','detall-3.webp'],['packaging','packaging-front.webp']];
for(const [name,f] of imgs){
  await sharp(D+f).resize(1600,1600,{fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(OUT+name+'.webp');
  console.log(name, (statSync(OUT+name+'.webp').size/1024).toFixed(0)+' KB');
}
// vídeo: sin audio, optimizado para reproducir en bucle dentro del mosaico
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',VID,'-an','-vcodec','libx264','-crf','26','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+'campana.mp4']);
console.log('campana.mp4', (statSync(OUT+'campana.mp4').size/1024).toFixed(0)+' KB');
// poster: primer fotograma, para que no haya hueco negro mientras carga
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',VID,'-frames:v','1','-y',OUT+'_frame.jpg']);
await sharp(OUT+'_frame.jpg').webp({quality:80}).toFile(OUT+'campana-poster.webp');
console.log('poster listo');
