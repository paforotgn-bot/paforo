import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync, unlinkSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/canmatt/CANMATT/';
const P=D+'PICS EDIT/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/can-matt/';
const CW='Coworking_CANMATT26_ROCH_n_VibePics';
const fotos=[
  ['recepcion',CW+'-16.jpg'], ['sofa',CW+'-18.jpg'], ['muro-verde',CW+'-7.jpg'],
  ['sala',CW+'-10.jpg'], ['fachada',CW+'-4.jpg'],
  ['habitacion','HabPilot_CanMatt-33.jpg'], ['escritorio','HabPilot_CanMatt-36.jpg'],
];
for(const [n,f] of fotos){
  const m=await sharp(P+f).metadata();
  await sharp(P+f).resize(1500,1500,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  console.log(n, m.width+'x'+m.height, (statSync(OUT+n+'.webp').size/1024).toFixed(0)+'KB');
}
await sharp(P+CW+'-16.jpg').resize(1100,1600,{fit:'inside',withoutEnlargement:true}).webp({quality:82})
  .toFile('C:/Users/pafor/proyectos/agencia/public/work/can-matt.webp');
const vids=[['dia','DiaCanmatt',15,'6'],['lifestyle','LifestyleTgn_3',15,'4'],['makingof','MakingOf',15,'5']];
for(const [n,f,dur,poster] of vids){
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-t',String(dur),'-i',D+f+'.mp4','-an',
    '-vf','scale=620:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+n+'.mp4']);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss',poster,'-i',D+f+'.mp4','-frames:v','1','-y',OUT+'_'+n+'.jpg']);
  await sharp(OUT+'_'+n+'.jpg').resize(800).webp({quality:80}).toFile(OUT+n+'-poster.webp');
  console.log(n+'.mp4', (statSync(OUT+n+'.mp4').size/1048576).toFixed(1)+' MB');
}
for(const [n] of vids) unlinkSync(OUT+'_'+n+'.jpg');
