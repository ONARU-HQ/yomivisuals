import { PDFDocument, rgb } from 'pdf-lib';
import { makeImage } from './render';
import type { StudioDocument } from './model';
import { contactValue, type BrandInformation } from './catalogue';
export async function makePdf(doc:StudioDocument,resolve:(id:string)=>Promise<string>,pages:number[],bleed=false,progress:(value:number)=>void=()=>{}){
 const pdf=await PDFDocument.create();const padding=bleed?8.5:0;
 for(let n=0;n<pages.length;n++){const blob=await makeImage(doc,doc.scenes[pages[n]],resolve,'png',1,'');const image=await pdf.embedPng(await blob.arrayBuffer());const w=doc.width*72/300,h=doc.height*72/300;const p=pdf.addPage([w+padding*2,h+padding*2]);p.drawImage(image,{x:padding,y:padding,width:w,height:h});if(bleed){for(const x of [padding,w+padding])for(const y of [padding,h+padding]){p.drawLine({start:{x:x-6,y},end:{x:x-2,y},thickness:.4,color:rgb(0,0,0)});p.drawLine({start:{x,y:y-6},end:{x,y:y-2},thickness:.4,color:rgb(0,0,0)});}}progress(Math.round((n+1)/pages.length*90));}
 return new Blob([new Uint8Array(await pdf.save())],{type:'application/pdf'});
}
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]??c));
export function makeEmail(doc:StudioDocument,brand:string,info:BrandInformation){
 const sections=doc.scenes.map(s=>{const text=s.canvas.objects.filter(l=>l.text&&l.visible!==false);return `<tr><td style="padding:32px 24px;background:${/^#[\da-f]{6}$/i.test(s.canvas.background??'')?s.canvas.background:'#ffffff'}">${text.map(l=>`<p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:${l.role==='headline'?30:16}px;line-height:1.5;color:${/^#[\da-f]{6}$/i.test(l.fill??'')?l.fill:'#111111'}">${escape(l.text)}</p>`).join('')}</td></tr>`;}).join('');
 const links=['website','email','instagram'].filter(k=>contactValue(info,k)).map(k=>{const v=info[k as keyof BrandInformation]??'';const url=k==='email'?`mailto:${v}`:k==='instagram'?`https://instagram.com/${v.replace(/^@/,'')}`:v;if(!/^(https:\/\/|mailto:)/.test(url))return '';return `<a href="${escape(url)}" style="color:#111111">${escape(contactValue(info,k))}</a>`;}).join(' · ');
 return new Blob([`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(brand)}</title></head><body style="margin:0;background:#eeeeee"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px">${sections}<tr><td style="padding:24px;background:#ffffff;font:14px Arial;color:#111111">${escape(brand)}<br>${links}</td></tr></table></td></tr></table></body></html>`],{type:'text/html'});
}
// Uncompressed ZIP container with CRC32, no large binary database payloads.
export async function makeZip(files:{name:string;blob:Blob}[]){const parts:BlobPart[]=[];const central:BlobPart[]=[];let offset=0;let centralLength=0;const enc=new TextEncoder();
 const header=(size:number)=>{const b=new Uint8Array(size);return {b,v:new DataView(b.buffer)};};
 for(const f of files){const bytes=new Uint8Array(await f.blob.arrayBuffer()),name=enc.encode(f.name);let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;
 const h=header(30);h.v.setUint32(0,0x04034b50,true);h.v.setUint16(4,20,true);h.v.setUint16(6,0x800,true);h.v.setUint32(14,crc,true);h.v.setUint32(18,bytes.length,true);h.v.setUint32(22,bytes.length,true);h.v.setUint16(26,name.length,true);parts.push(h.b,name,bytes);
 const c=header(46);c.v.setUint32(0,0x02014b50,true);c.v.setUint16(4,20,true);c.v.setUint16(6,20,true);c.v.setUint16(8,0x800,true);c.v.setUint32(16,crc,true);c.v.setUint32(20,bytes.length,true);c.v.setUint32(24,bytes.length,true);c.v.setUint16(28,name.length,true);c.v.setUint32(42,offset,true);central.push(c.b,name);centralLength+=46+name.length;offset+=30+name.length+bytes.length;}
 const end=header(22);end.v.setUint32(0,0x06054b50,true);end.v.setUint16(8,files.length,true);end.v.setUint16(10,files.length,true);end.v.setUint32(12,centralLength,true);end.v.setUint32(16,offset,true);return new Blob([...parts,...central,end.b],{type:'application/zip'});
}
