import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { statSync, copyFileSync } from 'node:fs';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const D=SP+'/arqvs/';
const OUT='C:/Users/pafor/proyectos/agencia/public/work/arqvs/';
const DL='C:/Users/pafor/Downloads/';
const fotos=[['dj','g3.jpg'],['estelas','g7.jpg'],['aerea','g8.jpg'],['pantalla','g2.jpg'],
             ['banda','g1.jpg'],['gente','g6.jpg'],['brindis','dada.jpg'],['abanico','g9.jpg']];
for(const [n,f] of fotos){
  await sharp(D+f).resize(1500,1500,{fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(OUT+n+'.webp');
  process.stdout.write(n+' ');
}
console.log();
await sharp(D+'g3.jpg').resize(1100,1600,{fit:'inside',withoutEnlargement:true}).webp({quality:82})
  .toFile('C:/Users/pafor/proyectos/agencia/public/work/arqvs.webp');
const videos=[
  ['noche-1','AQNaBaDAIkKlbX3dLX2H8zmGArhr6ToIY1FmT774hKgNnNE1uRQnvhP1YeeH1QM2SwxLCH-A-hT2NQFE_dltXtW2MgG2xVfE'],
  ['noche-2','AQPczhngJT7M7PAQ-7k9gYtUSTEMFhZdDJr8u4x3N9OpG2tdtcrBmf_Gb8caijsM6DbnLkQe5nneg0-EhJIf342gH8obNw2T'],
  ['noche-3','AQOcxujhY9oju-TWojHnXFVqMEFUCkzP1bui0iAqu0rymhZ4hqYsiLbxo_N8ufk2BZk9I4K6Nai11VVDCvo0DCWuZFYgQic7'],
  ['noche-4','AQNxszpTaA3JBhhiX9-w9TtLRQ4sONBa2tUuN1-1zYblFyVoXESQmrRg_cxfHIxbdHqA_thybCC0_QJtx-lzODRUos08UM7K'],
];
for(const [n,f] of videos){
  // 16 s bastan para un bucle de mosaico; el original pesa entre 6 y 10 MB
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-t','16','-i',DL+f+'.mp4','-an',
    '-vf','scale=560:-2','-vcodec','libx264','-crf','30','-preset','slow','-movflags','+faststart','-pix_fmt','yuv420p','-y',OUT+n+'.mp4']);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','2','-i',DL+f+'.mp4','-frames:v','1','-y',OUT+'_'+n+'.jpg']);
  await sharp(OUT+'_'+n+'.jpg').resize(700).webp({quality:80}).toFile(OUT+n+'-poster.webp');
  console.log(n, (statSync(OUT+n+'.mp4').size/1048576).toFixed(1)+' MB');
}
const { unlinkSync } = await import('node:fs');
for (const [n] of videos) unlinkSync(OUT+'_'+n+'.jpg');
console.log('posters listos');
