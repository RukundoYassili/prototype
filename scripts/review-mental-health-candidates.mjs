import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const ids=[5699424,9064381,7176302,5699456,7269394,3958396,9775861];
await mkdir('artifacts/mental-health-candidates',{recursive:true});
const results=await Promise.allSettled(ids.map(async id=>{
 const url=`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=3000`;
 const response=await fetch(url);if(!response.ok)throw Error(`${id}: ${response.status}`);
 const buffer=Buffer.from(await response.arrayBuffer());const meta=await sharp(buffer).metadata();
 await writeFile(`artifacts/mental-health-candidates/${id}.jpg`,buffer);
 const preview=await sharp(buffer).resize(520,330,{fit:'contain',background:'#f0f3ec'}).png().toBuffer();
 return {id,width:meta.width,height:meta.height,bytes:buffer.length,preview};
}));
const chosen=[];for(let i=0;i<results.length;i++){const r=results[i];if(r.status==='fulfilled'){chosen.push(r.value);console.log({...r.value,preview:undefined})}else console.log({id:ids[i],error:String(r.reason)})}
await sharp({create:{width:1040,height:Math.ceil(chosen.length/2)*330,channels:3,background:'#fff'}}).composite(chosen.map((r,i)=>({input:r.preview,left:(i%2)*520,top:Math.floor(i/2)*330}))).png().toFile('artifacts/mental-health-photo-review.png');
if(chosen.length!==ids.length)process.exitCode=1;
