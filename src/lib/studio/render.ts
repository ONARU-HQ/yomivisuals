import { StaticCanvas, FabricImage } from 'fabric';
import { Output, Mp4OutputFormat, BufferTarget, CanvasSource, AudioBufferSource, canEncodeVideo, canEncodeAudio } from 'mediabunny';
import { animatedLayer } from './motion';
import { sceneAt, totalDuration, validateDocument, type StudioDocument, type Scene, type Layer } from './model';
export async function loadScene(canvas:StaticCanvas,scene:Scene,resolve:(id:string)=>Promise<string>,signal?:AbortSignal){
 if(canvas.disposed||canvas.destroyed||signal?.aborted)return;const json=structuredClone(scene.canvas);
 async function hydrate(objects:Layer[]){for(const obj of objects){if(obj.assetId)obj.src=await resolve(obj.assetId);if(obj.objects)await hydrate(obj.objects);}}
 const viewport=[...canvas.viewportTransform] as typeof canvas.viewportTransform;
 await hydrate(json.objects);const fonts=new Set<string>();function collect(objects:Layer[]){for(const l of objects){if(l.fontFamily)fonts.add(`${l.fontWeight??400} 16px "${l.fontFamily}"`);if(l.objects)collect(l.objects);}}collect(json.objects);await Promise.all([...fonts].map(f=>document.fonts.load(f)));await document.fonts.ready;if(canvas.disposed||canvas.destroyed||signal?.aborted)return;await canvas.loadFromJSON(json,undefined,{signal});if(canvas.disposed||canvas.destroyed||signal?.aborted)return;canvas.setViewportTransform(viewport);canvas.renderAll();
}
export function applyFrame(canvas:StaticCanvas,scene:Scene,time:number){const objects=canvas.getObjects();scene.canvas.objects.forEach((layer,i)=>{const object=objects[i];if(!object)return;const frame=animatedLayer(layer,time,scene.duration);const props:Record<string,unknown>={};for(const key of ['left','top','scaleX','scaleY','angle','opacity','text','charSpacing','textBackgroundColor'])if(frame[key]!==undefined)props[key]=frame[key];object.set(props);});canvas.renderAll();}
export async function makeImage(doc:StudioDocument,scene:Scene,resolve:(id:string)=>Promise<string>,format:'png'|'jpeg',quality:number,jpegBackground:string){
 validateDocument(doc);await document.fonts.ready;const el=document.createElement('canvas');const canvas=new StaticCanvas(el,{width:doc.width,height:doc.height,enableRetinaScaling:false});
 try{await loadScene(canvas,scene,resolve);if(format==='jpeg')canvas.backgroundColor=jpegBackground;canvas.renderAll();const blob=await new Promise<Blob|null>(r=>el.toBlob(r,`image/${format}`,quality));if(!blob)throw new Error('Image export failed.');return blob;}finally{await canvas.dispose();}
}
export async function mixAudio(doc:StudioDocument,resolve:(id:string)=>Promise<string>,signal:AbortSignal){
 const duration=totalDuration(doc);const context=new OfflineAudioContext(2,Math.ceil(duration*48000),48000);
 for(const track of doc.audio.filter(t=>!t.muted)){
  if(signal.aborted)throw new Error('Export stopped.');const response=await fetch(await resolve(track.assetId),{signal});if(!response.ok)throw new Error(`Couldn't load ${track.name}.`);const buffer=await context.decodeAudioData(await response.arrayBuffer());
  const start=Math.max(0,track.start);const trimStart=Math.max(0,track.trimStart);const length=Math.min((track.trimEnd||buffer.duration)-trimStart,duration-start);if(length<=0)continue;
  const source=context.createBufferSource();source.buffer=buffer;const gain=context.createGain();gain.gain.setValueAtTime(track.fadeIn?0:track.volume,start);if(track.fadeIn)gain.gain.linearRampToValueAtTime(track.volume,start+Math.min(track.fadeIn,length/2));if(track.fadeOut){gain.gain.setValueAtTime(track.volume,start+Math.max(track.fadeIn,length-track.fadeOut));gain.gain.linearRampToValueAtTime(0,start+length);}source.connect(gain);gain.connect(context.destination);source.start(start,trimStart,length);
 }return context.startRendering();
}
export async function makeVideo(doc:StudioDocument,resolve:(id:string)=>Promise<string>,fps:number,quality:number,signal:AbortSignal,progress:(p:number)=>void){
 validateDocument(doc);const bitrate=Math.round(quality*8_000_000);if(!await canEncodeVideo('avc',{width:doc.width,height:doc.height,bitrate}))throw new Error('MP4 encoding is unavailable in this browser. Use a current Chrome or Edge browser with hardware video encoding.');
 await document.fonts.ready;const el=document.createElement('canvas');const canvas=new StaticCanvas(el,{width:doc.width,height:doc.height,enableRetinaScaling:false});const target=new BufferTarget();const output=new Output({format:new Mp4OutputFormat(),target});const video=new CanvasSource(el,{codec:'avc',bitrate});output.addVideoTrack(video,{frameRate:fps});let audio:AudioBufferSource|undefined;
 try{
  if(doc.audio.some(t=>!t.muted)){if(!await canEncodeAudio('aac'))throw new Error('AAC audio encoding is unavailable in this browser.');audio=new AudioBufferSource({codec:'aac',bitrate:192000});output.addAudioTrack(audio);}
  await output.start();if(audio){progress(1);await audio.add(await mixAudio(doc,resolve,signal));audio.close();}
  const frames=Math.ceil(totalDuration(doc)*fps);let current=-1;
  for(let i=0;i<frames;i++){if(signal.aborted)throw new Error('Export stopped.');const active=sceneAt(doc,i/fps);if(!active.scene)throw new Error('Scene missing.');if(active.index!==current){await loadScene(canvas,active.scene,resolve);current=active.index;}applyFrame(canvas,active.scene,active.local);if(active.scene.transition==='Fade'&&active.index>0&&active.local<.35){const ctx=el.getContext('2d');if(ctx){ctx.save();ctx.globalAlpha=1-active.local/.35;ctx.fillStyle=active.scene.canvas.background??'#080808';ctx.fillRect(0,0,doc.width,doc.height);ctx.restore();}}await video.add(i/fps,1/fps);if(i%10===0){progress(Math.round(i/frames*95));await new Promise(r=>setTimeout(r,0));}}
  video.close();await output.finalize();if(!target.buffer)throw new Error('The video encoder produced no file.');progress(100);return new Blob([target.buffer],{type:'video/mp4'});
 }catch(e){await output.cancel();throw e;}finally{await canvas.dispose();}
}
export async function addImage(canvas:StaticCanvas,url:string,width:number,height:number,assetId:string){const image=await FabricImage.fromURL(url,{crossOrigin:'anonymous'});image.scaleToWidth(width*.55);image.set({left:width*.2,top:height*.2,originX:'left',originY:'top'});Object.assign(image,{id:crypto.randomUUID(),label:'Image',assetId});canvas.add(image);canvas.requestRenderAll();return image;}