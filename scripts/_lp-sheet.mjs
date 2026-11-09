import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const P='C:/Users/pafor/proyectos/longplay/app/public/';
for(const [n,f] of [['v-longplay','hero.mp4'],['v-ranxito','ranxito.mp4'],['v-xatarra','xatarra.mp4']])
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','4','-i',P+f,'-frames:v','1','-y',SP+'/lp-'+n+'.jpg']);
const items=[
  ['v-longplay',SP+'/lp-v-longplay.jpg'],['v-ranxito',SP+'/lp-v-ranxito.jpg'],['v-xatarra',SP+'/lp-v-xatarra.jpg'],
  ['club-1',P+'club/club-1.jpg'],['club-3',P+'club/club-3.jpg'],
  ['gal-1',P+'gallery/gal-1.jpg'],['gal-3',P+'gallery/gal-3.jpg'],['gal-5',P+'gallery/gal-5.jpg'],
  ['ranxito ig-1',P+'ranxito/ig-1.jpg'],['ranxito ig-5',P+'ranxito/ig-5.jpg'],
  ['xatarra ig-1',P+'xatarra/ig-1.jpg'],['xatarra ig-3',P+'xatarra/ig-3.jpg'],
];
const COLS=6,CELL=250,PAD=4;const tiles=[],labels=[];
for(let i=0;i<items.length;i++){
  const [lbl,src]=items[i];
  const m=await sharp(src).metadata();
  const x=(i%COLS)*CELL,y=Math.floor(i/COLS)*CELL;
  tiles.push({input:await sharp(src).resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:80}).toBuffer(),left:x+PAD,top:y+PAD});
  const t=lbl+' '+m.width+'x'+m.height;
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${t.length*6+8}" height="15" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+11}" font-family="Arial" font-size="10" fill="#0f0">${t}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${2*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:2*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:80}).toFile(SP+'/longplay.jpg');
console.log('hoja lista');
