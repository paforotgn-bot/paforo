import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
const DL='C:/Users/pafor/Downloads/';
const fotos=['759308967_18180384292416061_475137267356142279_n.','760536346_18180519292416061_3764488140624998908_n.','768969465_18181433431416061_3381994447687841608_n.','765542799_18181434787416061_4893465881069700187_n.'];
const vids=[['v1','AQNr5tMbZcLxZq3Cxmtak1cDUcz-dLJEHRcZsiY44GKN720uZa9k8AdT24ECoLJ5VPN_8waBx32hO1ALJGBFr1bUqHdgdjkD'],['v2','AQNKpyL08jrcb1GVQHFS051h_gpvUb-ndHs2R8LR6oCL6Syxs8hX-Yc-fBM-7pMDFddPdlpRB5Va-1X0_AyRA6N9VH0Xa2Ky'],['v3','AQPraIgBtTohxVxC-NFF9BVCebk4E08V9k-UgGd3fgGr0UMSEzs_VfXJ-DZftymSdL7UTgCINC7ha5I-3BEpe1sh9S6DCmeJ']];
for(const [n,f] of vids) execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','3','-i',DL+f+'.mp4','-frames:v','1','-y',SP+'/lb-'+n+'.jpg']);
const items=[...fotos.map((f,i)=>['f'+(i+1),DL+f+'.jpg']), ...vids.map(([n])=>[n+' (vídeo)',SP+'/lb-'+n+'.jpg'])];
const COLS=4,CELL=300,PAD=4;const tiles=[],labels=[];
for(let i=0;i<items.length;i++){
  const [lbl,src]=items[i];
  const x=(i%COLS)*CELL,y=Math.floor(i/COLS)*CELL;
  tiles.push({input:await sharp(src).resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:82}).toBuffer(),left:x+PAD,top:y+PAD});
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${lbl.length*7+8}" height="15" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+11}" font-family="Arial" font-size="10" fill="#0f0">${lbl}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${2*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:2*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:82}).toFile(SP+'/limboo2.jpg');
console.log('hoja lista');
