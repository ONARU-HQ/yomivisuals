import { emptyScene, textLayer, uid, type Kit, type Layer, type StudioDocument } from './model';
export type BrandInformation = Partial<Record<'website'|'instagram'|'tiktok'|'whatsapp'|'phone'|'email'|'address'|'tagline'|'cta'|'bookingUrl'|'qrUrl'|'parentBrand'|'legalName',string>>;
export const CONTACT_FIELDS = ['website','instagram','tiktok','whatsapp','phone','email','address','tagline','cta','bookingUrl','qrUrl','parentBrand','legalName'] as const;
export const CATEGORIES = ['Social','Carousel','Web','Email','Print','Advertising','Stories','Web tiles','Stationery','Flyers','Menus','Motion'] as const;
export const FAMILIES = ['Light minimal','Dark premium','Brand editorial','Image-led','Bold typography'] as const;
export const USE_CASES:Record<string,string[]> = {
 Stories:['Vertical announcement','Story spotlight','Reel cover','Vertical promotion','Story call to action'],
 'Web tiles':['Product tile','Promotional tile','Service tile','Feature tile','Article tile'],
 Stationery:['Letterhead','Business stationery','Document cover','Company profile cover','Thank-you card'],
 Flyers:['Event flyer','Service poster','Brand poster','Launch flyer','Information poster'],
 Menus:['Menu layout','Service list','Rate card','Product catalogue','Price list'],
 Motion:['Opening title','Logo reveal','Campaign titles','Explainer title','Closing call to action'],
 Social:['Announcement','Service spotlight','Educational tip','Launch announcement','Call to action'],
 Carousel:['Educational series','Problem to solution','Service explainer','Step-by-step','FAQ'],
 Web:['Website hero','Section banner','Blog cover','Feature graphic','Open Graph'],
 Email:['Newsletter header','Product announcement','Event invitation','Signature & contacts','Campaign layout'],
 Print:['Letterhead','Business card','Presentation cover','Flyer','Rate card / menu'],
 Advertising:['Brand awareness','Service campaign','Lead generation','Launch campaign','Campaign pack'],
};
export const FORMAT_PRESETS = [
 {name:'Instagram square',width:1080,height:1080,safe:64}, {name:'Instagram portrait',width:1080,height:1350,safe:64},
 {name:'Instagram Story / TikTok',width:1080,height:1920,safe:150}, {name:'Facebook feed',width:1200,height:630,safe:48},
 {name:'Facebook cover',width:1640,height:624,safe:100}, {name:'LinkedIn post',width:1200,height:1200,safe:64},
 {name:'LinkedIn banner',width:1584,height:396,safe:72}, {name:'YouTube thumbnail',width:1280,height:720,safe:48},
 {name:'YouTube channel banner',width:2560,height:1440,safe:300}, {name:'Website hero',width:1920,height:800,safe:80},
 {name:'Website section',width:1600,height:600,safe:64}, {name:'Blog / Open Graph',width:1200,height:630,safe:48},
 {name:'Email header',width:1280,height:400,safe:48}, {name:'Presentation',width:1920,height:1080,safe:80},
 {name:'A4 · 300 dpi',width:2480,height:3508,safe:118,mm:[210,297]}, {name:'A5 · 300 dpi',width:1748,height:2480,safe:118,mm:[148,210]},
 {name:'Business card · 300 dpi',width:1063,height:650,safe:60,mm:[90,55]}, {name:'Flyer · A5',width:1748,height:2480,safe:118,mm:[148,210]},
 {name:'Poster · A4',width:2480,height:3508,safe:118,mm:[210,297]},
];
export type Starter = {key:string;category:string;family:string;name:string;composition:number};
export const STARTERS:Starter[] = CATEGORIES.flatMap(category => FAMILIES.map((family,i)=>({key:`${category.toLowerCase()}-${i}`,category,family,name:USE_CASES[category][i],composition:i})));
export function styledKit(kit:Kit,family:string):Kit {
 const colors=[...kit.colors]; const accent=colors[2]??colors[1]??'#333333';
 if(family==='Light minimal')return {...kit,colors:['#FAFAFA','#161616',accent]};
 if(family==='Dark premium'||family==='Image-led')return {...kit,colors:['#111111','#FAFAFA',accent]};
 if(family==='Brand editorial')return {...kit,colors:[colors[0]??'#FAFAFA',colors[1]??'#161616',accent]};
 return {...kit,colors:[accent,contrastInk(accent),colors[0]??'#111111']};
}
export function contrastInk(color:string){return luminance(color)>.4?'#111111':'#FFFFFF';}
function luminance(color:string){const c=color.replace('#','');if(!/^[\da-f]{6}$/i.test(c))return 0;const rgb=[0,2,4].map(i=>parseInt(c.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];}
export function contactValue(info:BrandInformation,key:string){const value=info[key as keyof BrandInformation]??'';return ['instagram','tiktok'].includes(key)&&value?`@${value.replace(/^@/,'')}`:value;}
export function buildStarter(starter:Starter,brand:string,kit:Kit,info:BrandInformation={},width?:number,height?:number,headline='[Your headline]',support='[Approved supporting information]',contacts:string[]=[],logoId?:string):StudioDocument {
 const w=width??(starter.name==='Business card'?1063:starter.name==='Presentation cover'?1920:['Print','Stationery','Flyers','Menus'].includes(starter.category)?2480:starter.name==='Open Graph'?1200:starter.category==='Web'?1920:starter.category==='Email'?1280:1080);
 const h=height??(starter.name==='Business card'?650:starter.name==='Presentation cover'?1080:['Print','Stationery','Flyers','Menus'].includes(starter.category)?3508:starter.name==='Open Graph'?630:starter.category==='Web'?800:starter.category==='Email'?640:starter.category==='Stories'?1920:1080);
 const k=styledKit(kit,starter.family);const accent=k.colors[2]??k.colors[1];const m=w*.075;const count=starter.category==='Carousel'?5:1;
 const doc:StudioDocument={version:1,width:w,height:h,scenes:[],audio:[]};
 for(let page=0;page<count;page++){
  const scene=emptyScene(k.colors[0]);scene.name=count>1?['Introduction','The challenge','The approach','[Approved evidence]','Next step'][page]:starter.name;
  const objects:Layer[]=[];
  const text=(value:string,x:number,y:number,tw:number,size:number,role:string)=>{const l=textLayer(value,x,y,tw,size,k);l.role=role;l.fontWeight=role==='support'?400:600;if(role==='headline'){const lines=Math.max(1,Math.ceil(value.length*size*.55/tw));l.fontSize=Math.min(size,h*.26/lines/1.16);}objects.push(l);return l;};
  const shape=(label:string,x:number,y:number,sw:number,sh:number,fill:string)=>objects.push({id:uid(),label,type:'Rect',originX:'left',originY:'top',left:x,top:y,width:sw,height:sh,fill,opacity:1});
  const heading=page===0?headline:page===4?'[Call to action]':`${String(page+1).padStart(2,'0')} / ${scene.name}`;
  if(starter.composition===0){
   shape('Fine divider',m,h*.22,w-2*m,Math.max(2,h*.002),accent);
   text(heading,m,h*.3,w*.76,Math.min(w*.075,h*.09),'headline');text(support,m,h*.62,w*.66,Math.min(w*.029,h*.038),'support');
  }else if(starter.composition===1){
   shape('Side rail',0,0,w*.035,h,accent);text(starter.category.toUpperCase(),m,h*.25,w*.35,w*.021,'eyebrow');
   text(heading,m,h*.34,w*.55,Math.min(w*.071,h*.09),'headline');
   shape('Feature frame',w*.69,h*.24,w*.23,h*.44,accent);text('[Asset / key detail]',w*.71,h*.4,w*.19,w*.02,'placeholder');text(support,m,h*.68,w*.55,w*.026,'support');
  }else if(starter.composition===2){
   text(heading,m,h*.27,w*.83,Math.min(w*.08,h*.095),'headline');
   for(let j=0;j<3;j++){const x=m+j*w*.285;shape(`Feature ${j+1} divider`,x,h*.59,w*.23,Math.max(2,h*.003),accent);text(`0${j+1}`,x,h*.64,w*.23,w*.033,'number');text('[Approved benefit]',x,h*.72,w*.23,w*.023,'support');}
  }else if(starter.composition===3){
   shape('Image placement frame',m,h*.23,w*.47,h*.56,accent);text('[Add approved image]',m+w*.04,h*.45,w*.39,w*.026,'placeholder');
   text(heading,w*.59,h*.27,w*.34,Math.min(w*.055,h*.08),'headline');text(support,w*.59,h*.6,w*.33,w*.025,'support');
  }else{
   text('01 / '+starter.category.toUpperCase(),m,h*.23,w*.85,w*.022,'eyebrow');
   const l=text(heading,m,h*.32,w*.86,Math.min(w*.115,h*.13),'headline');l.fontWeight=800;
   shape('Underline',m,h*.72,w*.24,h*.014,k.colors[1]);text(support,m,h*.79,w*.75,w*.023,'support');
  }
  text(brand.toUpperCase(),m,h*.09,w*.72,w*.024,'brand');
  if(logoId){objects.push({id:uid(),label:'Approved brand logo',role:'logo',type:'Image',assetId:logoId,originX:'left',originY:'top',left:w*.81,top:h*.07,width:120,height:120,scaleX:w*.001,scaleY:w*.001,opacity:1});}
  const footer=contacts.map(key=>contactValue(info,key)).filter(Boolean).join('  ·  ');
  if(footer){const l=text(footer,m,h*.92,w*.85,Math.min(w*.019,h*.027),'contact');l.contactFields=contacts;}
  if(count>1)text(`${page+1} / 5`,w*.84,h*.87,w*.1,w*.022,'pagination');
  scene.canvas.objects=objects;doc.scenes.push(scene);
 }
 return doc;
}
export function resizeDocument(source:StudioDocument,width:number,height:number,safe=48):StudioDocument {
 const next=structuredClone(source);const sx=width/source.width,sy=height/source.height;const scale=Math.min(sx,sy);next.width=width;next.height=height;
 next.scenes.forEach(s=>{s.id=uid();s.canvas.objects.forEach(l=>{l.id=uid();l.left=(l.left??0)*sx;l.top=(l.top??0)*sy;
 if(l.type?.toLowerCase().includes('text')){l.width=Math.min((l.width??source.width*.8)*sx,width-2*safe);l.fontSize=Math.max(12,(l.fontSize??24)*scale);l.left=Math.max(safe,Math.min(l.left,width-safe-l.width));l.top=Math.max(safe,Math.min(l.top,height-safe-l.fontSize*2));}
 else {l.scaleX=(l.scaleX??1)*scale;l.scaleY=(l.scaleY??1)*scale;l.left=Math.max(safe,Math.min(l.left,width-safe-(l.width??0)*l.scaleX));l.top=Math.max(safe,Math.min(l.top,height-safe-(l.height??0)*l.scaleY));}
 });});return next;
}
export function validateDesign(doc:StudioDocument,kit:Kit,safe=24):string[] {
 const issues:string[]=[];
 doc.scenes.forEach((s,i)=>s.canvas.objects.filter(l=>l.visible!==false).forEach(l=>{
  const label=`Page ${i+1}: ${l.label??'layer'}`;const w=(l.width??0)*(l.scaleX??1),h=(l.height??l.fontSize??0)*(l.scaleY??1);
  if((l.left??0)<safe||(l.top??0)<safe||(l.left??0)+w>doc.width-safe||(l.top??0)+h>doc.height-safe)issues.push(`${label} — review safe margins / clipping`);
  if(l.text?.includes('['))issues.push(`${label} — placeholder needs approved content`);
  if(l.text && l.fontSize<Math.min(doc.width,doc.height)*.015)issues.push(`${label} — small text`);
  if(l.text&&typeof l.fill==='string'&&s.canvas.background){const a=luminance(l.fill),b=luminance(s.canvas.background);if((Math.max(a,b)+.05)/(Math.min(a,b)+.05)<4.5)issues.push(`${label} — low contrast`);}
  if(l.role==='logo'&&Math.abs((l.scaleX??1)-(l.scaleY??1))>.01)issues.push(`${label} — logo distortion`);
  if(l.text&&l.fontFamily!==kit.font)issues.push(`${label} — font differs from brand kit`);
 }));return [...new Set(issues)];
}
export function exportFilename(brand:string,title:string,format:string,page:number,revision:number,extension:string){const clean=(s:string)=>s.replace(/[^a-zA-Z0-9-]+/g,'-').replace(/^-|-$/g,'');return `${clean(brand)}_${clean(title)}_${clean(format)}_${String(page+1).padStart(2,'0')}_v${String(revision).padStart(2,'0')}.${extension}`;}
