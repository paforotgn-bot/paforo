import sharp from 'sharp';
const SP='C:/Users/pafor/AppData/Local/Temp/claude/C--Users-pafor-proyectos-paforo/27182f41-37be-4c33-9c37-d7ac5e2f0a24/scratchpad';
await sharp(SP+'/or.png').extract({left:0,top:0,width:1400,height:560}).jpeg({quality:88}).toFile(SP+'/or-top.jpg');
console.log('ok');
