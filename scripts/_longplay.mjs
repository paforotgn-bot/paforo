import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync, unlinkSync } from 'node:fs';
const P='C:/Users/pafor/proyectos/longplay/app/public/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/longplay/';
const fotos=[['club-gente','gallery/gal-1.jpg'],['club-champan','gallery/gal-3.jpg'],
             ['ranxito-barra','ranxito/ig-1.jpg'],['ranxito-playa','ranxito/ig-5.jpg'],
             ['xatarra-fuego','xatarra/ig-1.jpg'],['xatarra-dj','xatarra/ig-3.jpg']];
for(const [n,f] of fotos){
  await sharp(P+f).resize(1400,1400,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  process.stdout.write(n+' ');
}
console.log();
// el fotograma 4 de la xatarra sale casi negro: se busca más adelante
const vids=[['longplay','hero.mp4',18,'4'],['ranxito','ranxito.mp4',18,'6'],['xatarra','xatarra.mp4',18,'14']];
for(const [n,f,dur,poster] of vids){
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-t',String(dur),'-i',P+f,'-an',
    '-vf','scale=620:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+n+'.mp4']);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss',poster,'-i',P+f,'-frames:v','1','-y',OUT+'_'+n+'.jpg']);
  await sharp(OUT+'_'+n+'.jpg').resize(800).webp({quality:80}).toFile(OUT+n+'-poster.webp');
  console.log(n, (statSync(OUT+n+'.mp4').size/1048576).toFixed(1)+' MB');
}
for(const [n] of vids) unlinkSync(OUT+'_'+n+'.jpg');
