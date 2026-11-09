import sharp from 'sharp';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
async function sheet(dir,files,out,cols,cell){
  const rows=Math.ceil(files.length/cols);const tiles=[],labels=[];const PAD=4;
  for(let i=0;i<files.length;i++){
    const x=(i%cols)*cell,y=Math.floor(i/cols)*cell;
    const m=await sharp(dir+files[i]).metadata();
    tiles.push({input:await sharp(dir+files[i]).resize(cell-PAD*2,cell-PAD*2,{fit:'contain',background:{r:17,g:17,b:19}}).jpeg({quality:80}).toBuffer(),left:x+PAD,top:y+PAD});
    const lbl=files[i].replace(/\.(png|jpg|JPG)$/,'')+' '+m.width+'x'+m.height;
    labels.push(`<rect x="${x+PAD}" y="${y+PAD}" width="${lbl.length*6+8}" height="15" fill="#000" opacity="0.8"/><text x="${x+PAD+3}" y="${y+PAD+11}" font-family="Arial" font-size="10" fill="#0f0">${lbl}</text>`);
  }
  const svg=Buffer.from(`<svg width="${cols*cell}" height="${rows*cell}">${labels.join('')}</svg>`);
  await sharp({create:{width:cols*cell,height:rows*cell,channels:3,background:{r:17,g:17,b:19}}})
    .composite([...tiles,{input:svg,left:0,top:0}]).jpeg({quality:80}).toFile(out);
}
await sheet(SP+'/twojeys/TWOJEYS/',['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png'],SP+'/tj.jpg',5,280);
await sheet(SP+'/mastinell/BODEGAS MASTINELL/',['DJI_0312.JPG','DJI_0314.JPG','DJI_0315.JPG','THUMBNAIL.png'],SP+'/mt.jpg',4,320);
console.log('hojas listas');
