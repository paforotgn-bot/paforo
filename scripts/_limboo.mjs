import sharp from 'sharp';
import { execFileSync, } from 'node:child_process';
import { statSync, unlinkSync } from 'node:fs';
const DL='C:/Users/pafor/Downloads/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/limboo/';
const fotos=[
  ['terraza','759308967_18180384292416061_475137267356142279_n..jpg'],
  ['arroz','760536346_18180519292416061_3764488140624998908_n..jpg'],
  ['arroz-2','768969465_18181433431416061_3381994447687841608_n..jpg'],
  ['plato','765542799_18181434787416061_4893465881069700187_n..jpg'],
  ['cena','761028191_18180609076416061_22988586924206735_n..jpg'],
];
for(const [n,f] of fotos){
  await sharp(DL+f).resize(1500,1500,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  process.stdout.write(n+' ');
}
console.log();
const vids=[
  ['fiesta','AQNr5tMbZcLxZq3Cxmtak1cDUcz-dLJEHRcZsiY44GKN720uZa9k8AdT24ECoLJ5VPN_8waBx32hO1ALJGBFr1bUqHdgdjkD',16],
  ['postre','AQNKpyL08jrcb1GVQHFS051h_gpvUb-ndHs2R8LR6oCL6Syxs8hX-Yc-fBM-7pMDFddPdlpRB5Va-1X0_AyRA6N9VH0Xa2Ky',8],
  ['carne','AQPraIgBtTohxVxC-NFF9BVCebk4E08V9k-UgGd3fgGr0UMSEzs_VfXJ-DZftymSdL7UTgCINC7ha5I-3BEpe1sh9S6DCmeJ',13],
];
for(const [n,f,t] of vids){
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-t',String(t),'-i',DL+f+'.mp4','-an',
    '-vf','scale=560:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+n+'.mp4']);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','2','-i',DL+f+'.mp4','-frames:v','1','-y',OUT+'_'+n+'.jpg']);
  await sharp(OUT+'_'+n+'.jpg').resize(700).webp({quality:80}).toFile(OUT+n+'-poster.webp');
  console.log(n, (statSync(OUT+n+'.mp4').size/1048576).toFixed(1)+' MB');
}
for(const [n] of vids) unlinkSync(OUT+'_'+n+'.jpg');
