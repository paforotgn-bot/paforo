import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync, unlinkSync, readdirSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/venom/VENOM FITNESS/FOTOS/';
const V=SP+'/venom/VENOM FITNESS/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/venom-fitness/';
const map=[
  ['entreno-1','1.png'],['entreno-2','3.png'],['entreno-3','6.png'],
  ['sala-1','11.png'],['sala-2','33.png'],['sala-3','55.png'],['sala-4','66.png'],
  ['logo','0005_DSC05910.jpg'],
  ['disco','0003_DSC05918.jpg'],
  ['evento','0024_DSC05857.jpg'],
  ['hammer','0030_DSC05847.jpg'],
];
// Los nombres del zip vienen de macOS con el acento descompuesto, así que se
// buscan por el final del nombre en vez de por la cadena entera.
const archivos = readdirSync(D);
const buscar = (f) => (f.includes('/') || f.startsWith('Sin') || !f.includes('_') ? f : archivos.find((a) => a.endsWith(f)) ?? f);
for(const [n,f] of map){
  const real = buscar(f);
  const m = await sharp(D+real).metadata();
  await sharp(D+real).resize(1600,1600,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  console.log(n, m.width+'x'+m.height, (statSync(OUT+n+'.webp').size/1024).toFixed(0)+'KB');
}
// el vídeo vertical (4:5) es el que encaja en una celda del mosaico
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',V+'VideoWebHYBRID.mp4','-t','24','-an',
  '-vf','scale=560:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+'hybrid.mp4']);
console.log('hybrid.mp4',(statSync(OUT+'hybrid.mp4').size/1048576).toFixed(1)+' MB  (antes 28 MB)');
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','3','-i',V+'VideoWebHYBRID.mp4','-frames:v','1','-y',OUT+'_f.jpg']);
await sharp(OUT+'_f.jpg').resize(700).webp({quality:80}).toFile(OUT+'hybrid-poster.webp');
unlinkSync(OUT+'_f.jpg');
console.log('poster listo');
