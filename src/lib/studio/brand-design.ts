import type { Asset, Brand } from './data';
import { kitOf } from './data';
import { buildRecipe } from './resources';
import type { BrandInformation } from './catalogue';
import { uid, type Layer, type StudioDocument } from './model';

export function websiteLabel(value:string){return value.replace(/^https?:\/\//i,'').replace(/\/$/,'');}
export function productionAsset(asset:Asset,brandId:string){return asset.brand_id===brandId&&asset.approved&&['image','logo','logo-cutout','icon'].includes(asset.kind)&&!/(reference|inspiration)/i.test(asset.name);}
export function applyBrandDesign(source:StudioDocument,brand:Brand,assets:Asset[]):StudioDocument{
 const doc=structuredClone(source),kit=kitOf(brand);
 const approved=assets.filter(a=>productionAsset(a,brand.id));
 const imageFor=(role:string)=>approved.find(a=>a.kind==='image'&&(a.metadata as Record<string,unknown>)?.templateRole===role);
 const logo=approved.find(a=>a.id===brand.logo_asset_id);
 const recolour=(value:unknown):unknown=>{if(value==='#101113')return kit.colors[0]??value;if(value==='#FFFFFF')return kit.colors[1]??value;if(value&&typeof value==='object'){const v=structuredClone(value) as Record<string,unknown>;if(Array.isArray(v.colorStops))v.colorStops=v.colorStops.map(s=>({...s,color:recolour(s.color)}));return v;}return value;};
 for(const scene of doc.scenes){if(scene.canvas.background==='#101113')scene.canvas.background=kit.colors[0]??scene.canvas.background;
  scene.canvas.objects=scene.canvas.objects.filter(l=>!(logo&&l.role==='brand'&&l.top<150));
  for(const l of scene.canvas.objects){l.fill=recolour(l.fill);l.stroke=recolour(l.stroke);
   if(l.text&& !['arrow','dial'].includes(l.role)){l.fitHeight=Math.max(40,(l.fontSize??24)*1.35*String(l.text).split('\n').length);l.fontFamily=['headline','keyword'].includes(l.role)?kit.font:(kit.bodyFont||kit.font);l.charSpacing=0;}
   if(l.role==='contact'&&typeof l.text==='string')l.text=websiteLabel(l.text);
   if(l.imageSlot){const a=imageFor(l.imageSlot);if(a){l.type='Image';l.assetId=a.id;l.fitMode='cover';l.label=a.name;l.role='image';delete l.fill;delete l.stroke;}}
  }
  scene.canvas.objects=scene.canvas.objects.filter(l=>!(l.slotHint&&imageFor(l.slotHint)));
  if(logo)scene.canvas.objects.push({id:uid(),label:'Brand logo',type:'Image',role:'logo',assetId:logo.id,left:780,top:54,width:220,height:85,fitMode:'contain',originX:'left',originY:'top',opacity:1});
 }
 return doc;
}
export function buildBrandRecipe(key:string,brand:Brand,assets:Asset[]){return applyBrandDesign(buildRecipe(key,brand.name,kitOf(brand),brand.information as BrandInformation),brand,assets);}
export function decorate(kind:string,accent:string,ink:string):Layer[]{
 const base={left:100,top:230,originX:'left',originY:'top',opacity:1};
 if(kind==='Arrow')return [{...base,id:uid(),label:'Directional arrow',type:'Path',path:[['M',0,130],['L',130,0],['M',40,0],['L',130,0],['L',130,90]],fill:'transparent',stroke:accent,strokeWidth:8}];
 if(kind==='Spark')return [{...base,id:uid(),label:'Spark clipart',type:'Path',path:[['M',70,0],['L',84,52],['L',140,70],['L',84,86],['L',70,140],['L',54,86],['L',0,70],['L',54,52],['Z']],fill:accent}];
 if(kind==='Bars')return [120,200,160,280].map((h,i)=>({...base,id:uid(),label:'Editable decorative bar',type:'Rect',left:100+i*72,top:520-h,width:44,height:h,fill:accent,rx:8,ry:8}));
 return [{...base,id:uid(),label:'Chart line — illustrative only',type:'Path',path:[['M',0,180],['L',70,130],['L',150,155],['L',235,60],['L',310,25]],stroke:accent,strokeWidth:7,fill:'transparent'},{...base,id:uid(),label:'Chart baseline',type:'Rect',top:430,width:330,height:2,fill:ink}];
}