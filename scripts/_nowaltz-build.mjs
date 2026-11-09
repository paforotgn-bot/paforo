import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const T=SP+'/tees/TEES/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/no-waltz/';
const map=[
  ['tee-blanca','2-1'], ['tee-negra','6'], ['hoodie','10'], ['gorras','11'],
  ['publico','THUMBNAIL'], ['editorial','1'],
  ['tee-blanca-back','3-1'], ['tee-negra-model','5-1'], ['tee-negra-back','7'], ['hoodie-model','9'],
];
for(const [name,file] of map){
  await sharp(T+file+'.png').resize(1600,1600,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+name+'.webp');
  process.stdout.write(`${name} `);
}
console.log();
// vídeo: 1080x1920 y 68 MB → 720 de ancho, sin audio
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',T+'EventVibe_NoWaltz_Skeels.prproj.mp4',
  '-an','-vf','scale=720:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+'campana.mp4']);
console.log('campana.mp4', (statSync(OUT+'campana.mp4').size/1048576).toFixed(1)+' MB  (antes 68 MB)');
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','2','-i',T+'EventVibe_NoWaltz_Skeels.prproj.mp4','-frames:v','1','-y',OUT+'_f.jpg']);
await sharp(OUT+'_f.jpg').resize(900).webp({quality:80}).toFile(OUT+'campana-poster.webp');
(await import('node:fs')).unlinkSync(OUT+'_f.jpg');
console.log('poster listo');
