import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync, unlinkSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/zea/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/albatarrec/';
const fotos=[['arco','a012.jpeg'],['corredor','b085.jpeg'],['salida','a004.jpeg'],['podio','a020.jpeg'],
             ['grupo','a028.jpeg'],['champan','a036.jpeg'],['medalla','b100.jpeg'],['equipo','b116.jpeg']];
for(const [n,f] of fotos){
  await sharp(D+f).resize(1400,1400,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  process.stdout.write(n+' ');
}
console.log();
await sharp(D+'a012.jpeg').resize(1100,1650,{fit:'inside',withoutEnlargement:true}).webp({quality:82})
  .toFile('C:/Users/pafor/proyectos/agencia/public/work/albatarrec.webp');
// el aftermovie dura 70 s y pesa 24 MB: 16 s bastan para el bucle
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-t','16','-i',D+'aftermovie.mp4','-an',
  '-vf','scale=620:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+'aftermovie.mp4']);
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','6','-i',D+'aftermovie.mp4','-frames:v','1','-y',OUT+'_a.jpg']);
await sharp(OUT+'_a.jpg').resize(800).webp({quality:80}).toFile(OUT+'aftermovie-poster.webp');
unlinkSync(OUT+'_a.jpg');
console.log('aftermovie.mp4', (statSync(OUT+'aftermovie.mp4').size/1048576).toFixed(1)+' MB  (antes 24 MB)');
