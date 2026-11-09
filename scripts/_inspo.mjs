import sharp from 'sharp';
const files = [
 ["THUMBNAIL","C:/Users/pafor/OneDrive/Escritorio/THUMBNAIL.png"],
 ["22","C:/Users/pafor/OneDrive/Escritorio/22.png"],
 ["6","C:/Users/pafor/OneDrive/Escritorio/6.png"],
 ["11","C:/Users/pafor/OneDrive/Escritorio/11.png"],
 ["1","C:/Users/pafor/OneDrive/Escritorio/1.png"],
 ["2","C:/Users/pafor/OneDrive/Escritorio/2.png"],
 ["limboo","C:/Users/pafor/OneDrive/Escritorio/limboo - copia.png"],
 ["fontanet","C:/Users/pafor/OneDrive/Escritorio/fontanettgn - copia.avif"],
 ["whatsapp","C:/Users/pafor/Downloads/WhatsApp Image 2026-10-07 at 14.48.48.jpeg"],
 ["077","C:/Users/pafor/Downloads/077.jpg"],
 ["packaging","C:/Users/pafor/Downloads/packaging-front.webp"],
 ["gallery4","C:/Users/pafor/Downloads/gallery-4.webp"],
];
const COLS=6, CELL=320, PAD=8;
const rows=Math.ceil(files.length/COLS);
const tiles=[], labels=[];
for(let i=0;i<files.length;i++){
  const [name,path]=files[i];
  const x=(i%COLS)*CELL, y=Math.floor(i/COLS)*CELL;
  let buf;
  try{ buf=await sharp(path,{failOn:'none'}).rotate().resize(CELL-PAD*2,CELL-PAD*2,{fit:'contain',background:{r:17,g:17,b:17}}).jpeg({quality:82}).toBuffer(); }
  catch(e){ buf=await sharp({create:{width:CELL-PAD*2,height:CELL-PAD*2,channels:3,background:{r:70,g:30,b:30}}}).jpeg().toBuffer(); }
  tiles.push({input:buf,left:x+PAD,top:y+PAD});
  labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="110" height="17" fill="#000" opacity="0.75"/><text x="${x+PAD+4}" y="${y+PAD+13}" font-family="Arial" font-size="12" fill="#0f0">${name}</text>`);
}
const svg=Buffer.from(`<svg width="${COLS*CELL}" height="${rows*CELL}">${labels.join('')}</svg>`);
await sharp({create:{width:COLS*CELL,height:rows*CELL,channels:3,background:{r:17,g:17,b:19}}})
 .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:80})
 .toFile('C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad/portadas.jpg');
console.log('ok');
