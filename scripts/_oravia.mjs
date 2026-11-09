import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync, unlinkSync } from 'node:fs';
const P='C:/Users/pafor/proyectos/oravia travel group/sportsincoming/public/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/oravia/';
const fotos=[['portero','collage/collage-02.jpg'],['entreno','collage/collage-05.jpg'],
             ['estadio','collage/beyond-the-game.jpg'],['entrenador','collage/collage-18.jpg'],
             ['atletas','collage/collage-20.jpg'],['camps','collage/training-camps.jpg'],
             ['jugadora','collage/collage-23.jpg']];
for(const [n,f] of fotos){
  await sharp(P+f).resize(1500,1500,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  process.stdout.write(n+' ');
}
console.log();
await sharp(P+'collage/collage-02.jpg').resize(1100,1650,{fit:'inside',withoutEnlargement:true}).webp({quality:82})
  .toFile('C:/Users/pafor/proyectos/agencia/public/work/oravia.webp');
const vids=[['torneos','tournaments/hero',14,'4'],['rugby','communities/rugby/hero',14,'6']];
for(const [n,f,dur,poster] of vids){
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-t',String(dur),'-i',P+f+'.mp4','-an',
    '-vf','scale=560:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+n+'.mp4']);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss',poster,'-i',P+f+'.mp4','-frames:v','1','-y',OUT+'_'+n+'.jpg']);
  await sharp(OUT+'_'+n+'.jpg').resize(700).webp({quality:80}).toFile(OUT+n+'-poster.webp');
  console.log(n+'.mp4', (statSync(OUT+n+'.mp4').size/1048576).toFixed(1)+' MB');
}
for(const [n] of vids) unlinkSync(OUT+'_'+n+'.jpg');
