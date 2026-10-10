import { emptyScene, uid, type Kit, type Layer, type StudioDocument } from './model';
import { contactValue, type BrandInformation } from './catalogue';

// All primitives are native Fabric JSON, shared by thumbnails, editing and export.
export const REFERENCE_THEME={dark:'#101113',light:'#F4F4F1',white:'#FFFFFF',ink:'#151619',silver:'#B8BDC5',muted:'#666B73'};
export const SECTORS:Record<string,{subject:string;services:string[];noun:string}>={
 'Yomi Visuals':{subject:'CREATIVE\nPRODUCTION',services:['CREATIVE DIRECTION','PRODUCTION','CAMPAIGNS','VISUAL CONTENT'],noun:'ideas'},
 'YV Studios Africa':{subject:'STUDIO\nSESSIONS',services:['[STUDIO SERVICE]','[SPACE OPTION]','[SESSION TYPE]','[BOOKING DETAIL]'],noun:'space'},
 'YV Experience':{subject:'SHARED\nEXPERIENCES',services:['[EXPERIENCE TYPE]','[EVENT DETAIL]','[COLLABORATION]','[ENQUIRY OPTION]'],noun:'moments'},
 'Shop 1401':{subject:'CURATED\nFASHION',services:['[COLLECTION]','[PRODUCT CATEGORY]','[NEW ARRIVAL]','[SHOPPING DETAIL]'],noun:'style'},
 'Folak Catering':{subject:'FOOD &\nHOSPITALITY',services:['[CATERING SERVICE]','[MENU OPTION]','[EVENT FORMAT]','[ENQUIRY DETAIL]'],noun:'occasions'},
 'NUWA Africa':{subject:'SPACES &\nINTERIORS',services:['[SPACE TYPE]','[INTERIOR DETAIL]','[PROJECT SCOPE]','[ENQUIRY OPTION]'],noun:'spaces'},
 TRYSA:{subject:'YOUR NEXT\nWORKFLOW',services:['[APPROVED FEATURE]','[WORKFLOW]','[PRODUCT DETAIL]','[GET STARTED]'],noun:'workflow'},
 YOFA:{subject:'FOOD\nDISCOVERY',services:['[FOOD CATEGORY]','[DISCOVERY FEATURE]','[MENU DETAIL]','[NEXT STEP]'],noun:'taste'},
 'TRYSA Community':{subject:'IDEAS &\nCOMMUNITY',services:['[COMMUNITY TOPIC]','[LEARNING SESSION]','[EVENT DETAIL]','[JOINING OPTION]'],noun:'connections'},
 ONARU:{subject:'BUSINESS\nECOSYSTEM',services:['[BUSINESS AREA]','[PORTFOLIO BRAND]','[PARTNERSHIP]','[CONTACT OPTION]'],noun:'business'},
};
type Fill=string|Record<string,unknown>;
export function referenceDocument(family:string,brand:string,kit:Kit,info:BrandInformation,logoId?:string):StudioDocument{
 const t=REFERENCE_THEME,sector=SECTORS[brand];if(!sector)throw new Error('This business is not included in the studio.');
 const accent=kit.colors[2]??'#C8A04A';const light=['curiosity','community'].includes(family);const bg=light?t.light:t.dark;
 const scene=emptyScene(bg);const objects:Layer[]=[];const W=1080,H=1350;
 const base=(label:string,type:string,x:number,y:number,props:Record<string,unknown>):Layer=>({id:uid(),label,type,left:x,top:y,originX:'left',originY:'top',opacity:1,...props});
 const rect=(label:string,x:number,y:number,w:number,h:number,fill:Fill,rx=0,extra:Record<string,unknown>={})=>objects.push(base(label,'Rect',x,y,{width:w,height:h,fill,rx,ry:rx,...extra}));
 const circle=(label:string,x:number,y:number,r:number,fill:Fill,extra:Record<string,unknown>={})=>objects.push(base(label,'Circle',x,y,{radius:r,fill,...extra}));
 const text=(value:string,x:number,y:number,w:number,size:number,font='Plus Jakarta Sans',weight=400,fill:Fill=light?t.ink:t.white,role='support',extra:Record<string,unknown>={})=>objects.push(base(role,'Textbox',x,y,{text:value,width:w,fontSize:size,fontFamily:font,fontWeight:weight,fill,lineHeight:1.02,textAlign:'left',charSpacing:0,role,charLimit:role==='headline'?70:180,minFontSize:24,maxFontSize:size,...extra}));
 const path=(label:string,x:number,y:number,commands:unknown[][],stroke:Fill,sw=3,fill:Fill='transparent')=>objects.push(base(label,'Path',x,y,{path:commands,fill,stroke,strokeWidth:sw,strokeLineCap:'round',strokeLineJoin:'round'}));
 const line=(label:string,x:number,y:number,w:number,color:Fill=accent)=>rect(label,x,y,w,2,color);
 const shadow={color:'#00000070',blur:32,offsetX:8,offsetY:18};
 const linear=(w:number,h:number,colors:string[])=>({type:'linear',gradientUnits:'pixels',coords:{x1:0,y1:0,x2:w,y2:h},colorStops:colors.map((color,i)=>({offset:i/(colors.length-1),color}))});
 const vignette=()=>rect('Radial studio light',0,0,W,H,{type:'radial',gradientUnits:'pixels',coords:{x1:520,y1:760,r1:0,x2:520,y2:760,r2:830},colorStops:[{offset:0,color:accent},{offset:.52,color:t.dark},{offset:1,color:'#030405'}]});
 const pill=(value:string,x:number,y:number,w:number,color:Fill=accent,ink=t.ink)=>{rect('CTA pill',x,y,w,62,color,18);text(value,x+16,y+15,w-32,24,'Plus Jakarta Sans',800,ink,'cta',{textAlign:'center'});};
 const dots=(x:number,y:number,cols=5,rows=10)=>{for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)circle('Dot grid',x+c*14,y+r*14,1.8,accent);};
 const footer=(ink:Fill=light?t.ink:t.white)=>{const website=contactValue(info,'website');const handle=contactValue(info,'instagram');if(website)text(website,80,1250,920,22,'Plus Jakarta Sans',500,ink,'contact');if(handle)text(handle,80,1210,920,20,'Plus Jakarta Sans',400,ink,'contact');};
 const branding=(ink:Fill=light?t.ink:t.white)=>{if(logoId)objects.push(base('Approved brand logo','Image',820,60,{width:160,height:80,assetId:logoId,role:'logo'}));else text(brand.toUpperCase(),650,65,350,22,'Space Grotesk',700,ink,'brand',{textAlign:'right'});};
 const rotateNew=(start:number,x:number,y:number,angle:number)=>{const a=angle*Math.PI/180;for(const l of objects.slice(start)){const dx=l.left-x,dy=l.top-y;l.left=x+dx*Math.cos(a)-dy*Math.sin(a);l.top=y+dx*Math.sin(a)+dy*Math.cos(a);l.angle=angle;}};
 const phone=(x:number,y:number,w:number,h:number,angle=12)=>{const start=objects.length;rect('Phone shell',x,y,w,h,linear(w,h,['#626975','#08090B','#D6DADF']),32,{shadow});rect('Phone screen',x+9,y+11,w-18,h-22,t.light,24);rect('Phone speaker',x+w*.36,y+24,w*.28,5,t.ink,3);text('[SCREEN]',x+22,y+h*.48,w-44,14,'Plus Jakarta Sans',600,t.muted,'placeholder',{textAlign:'center'});objects[start].role='mockup';rotateNew(start,x,y,angle);};
 const laptop=(x:number,y:number,w:number,angle=-17)=>{const start=objects.length;rect('Laptop display',x,y,w,w*.65,linear(w,w*.65,['#D8DCE3','#7D848D']),12,{shadow});rect('Laptop screen slot',x+12,y+12,w-24,w*.65-26,t.ink,4);text('[SCREEN]',x+24,y+w*.25,w-48,14,'Space Grotesk',500,t.white,'placeholder',{textAlign:'center'});path('Laptop base',x-30,y+w*.65,[['M',0,0],['L',w+60,0],['L',w+85,40],['L',-25,40],['Z']],t.silver,2,linear(w,40,['#F3F4F5','#7D848D']));rotateNew(start,x,y,angle);};
 const frame=(x:number,y:number,w:number,h:number)=>{rect('Image placement frame',x,y,w,h,linear(w,h,['#E5E6E2','#C8CBC8']),18);text('[ADD APPROVED IMAGE]',x+24,y+h*.46,w-48,22,'Plus Jakarta Sans',600,t.muted,'placeholder',{textAlign:'center'});};
 const builders:Record<string,()=>void>={
 services:()=>{
  dots(80,95);circle('Corner orbit',690,-255,380,'transparent',{stroke:accent,strokeWidth:1,opacity:.35});
  text('OUR',80,285,750,90,'Syne',800);text('EXPERTISE',80,380,900,88,'Syne',800,accent,'headline');
  sector.services.forEach((value,i)=>{const y=590+i*133;text('↗',80,y-5,60,53,'Space Grotesk',500,accent,'arrow');text(value,140,y,635,43,'Space Grotesk',400,t.white,'service');if(i<3)line('Service underline',80,y+104,635,t.silver);});
  path('Swooping guide',755,790,[['M',0,0],['C',25,170,240,290,285,170],['C',330,40,220,40,232,185],['C',245,325,415,310,460,285]],t.white,10);
  path('Guide arrow head',743,778,[['M',0,80],['L',12,0],['L',65,65]],t.white,10);
 },
 trust:()=>{
  vignette();text('IDEAS.\nCRAFT.\nIMPACT.',235,300,730,148,'Plus Jakarta Sans',800,t.white,'headline',{textAlign:'center',lineHeight:.96});
  laptop(85,290,200,-21);phone(875,800,145,225,17);
  text(`[Approved statement about ${sector.noun}]`,110,1070,860,29,'Plus Jakarta Sans',400,t.white,'support',{textAlign:'center'});
  text(sector.services.slice(0,3).join('  /  '),85,1160,910,21,'Plus Jakarta Sans',500,t.white,'service',{textAlign:'center'});
 },
 curiosity:()=>{
  text('A DIFFERENT PERSPECTIVE',80,180,900,27,'Archivo',700,t.ink,'label');
  text('HOW?',80,275,920,235,'Clash Display',700,t.ink,'headline');
  path('Torn paper shadow',-10,646,[['M',0,18],['L',140,4],['L',224,20],['L',320,7],['L',485,23],['L',640,5],['L',798,16],['L',930,0],['L',1100,15],['L',1100,110],['L',0,110],['Z']],'transparent',0,'#DADBD8');
  path('Torn paper edge',-10,628,[['M',0,18],['L',140,4],['L',224,20],['L',320,7],['L',485,23],['L',640,5],['L',798,16],['L',930,0],['L',1100,15],['L',1100,140],['L',0,140],['Z']],'transparent',0,t.white);
  text('YOUR NEXT',80,820,850,64,'Archivo',800,t.ink,'support');text(sector.noun.toUpperCase(),80,895,900,97,'Clash Display',700,accent,'keyword');text('[One useful insight. One clear next step.]',80,1065,830,33,'Plus Jakarta Sans',400,t.ink);
 },
 stopwatch:()=>{
  for(let row=0;row<20;row++)for(let c=0;c<17;c++)path('Micro mesh',c*68-10,row*56-5,[['M',17,0],['L',51,0],['L',68,28],['L',51,56],['L',17,56],['L',0,28],['Z']],'#25282C',1);
  circle('Stopwatch loop',433,183,95,'transparent',{stroke:linear(180,180,[accent,t.white,accent]),strokeWidth:13});rect('Crown',487,294,104,57,linear(100,57,[accent,t.white,accent]),8);rect('Crown neck',522,340,37,47,t.silver,4);
  circle('Metal bezel',255,366,285,linear(550,550,[accent,'#FFFFFF',accent,'#282A2F']),{shadow});circle('Inner bevel',275,386,265,linear(520,520,['#727780','#F4F4F1','#7D828A']));circle('Clock face',291,402,249,t.light);
  for(let i=0;i<60;i++){const a=i*Math.PI/30;const x=540+Math.sin(a)*223,y=651-Math.cos(a)*223;rect('Dial tick',x,y,i%5===0?4:2,i%5===0?16:7,t.ink,0,{angle:i*6,originX:'center',originY:'center'});}
  for(let i=1;i<=12;i++){const a=i*Math.PI/6;text(String(i),514+Math.sin(a)*177,630-Math.cos(a)*177,52,28,'Space Grotesk',600,t.ink,'dial',{textAlign:'center'});}
  path('Minute hand',537,453,[['M',0,0],['L',0,200]],t.ink,7);path('Hour hand',540,650,[['M',0,0],['L',108,55]],t.ink,9);circle('Centre pivot',527,638,12,accent);
  text('YOUR NEXT',95,966,890,63,'Plus Jakarta Sans',800,t.white,'headline',{textAlign:'center'});text('MOMENT STARTS HERE',65,1040,950,51,'Plus Jakarta Sans',800,accent,'keyword',{textAlign:'center'});pill('[YOUR CTA]',370,1140,340,accent);
 },
 monoline:()=>{
  path('Fluid monoline',238,242,[['M',0,350],['C',130,110,580,260,485,410],['C',400,565,170,420,345,315],['C',490,235,790,230,640,0]],accent,4);
  circle('Monoline endpoint',873,235,5,accent);text('YOUR',80,730,900,92,'Syne',800,t.white,'headline');text(sector.noun.toUpperCase(),80,847,930,65,'Syne',800,t.white,'support');text('NEXT CHAPTER.',80,982,920,58,'Syne',800,accent,'keyword');text('[APPROVED BRAND ETHOS]',80,1100,910,26,'Space Grotesk',500,t.white,'ethos',{charSpacing:120});
 },
 launch:()=>{
  rect('Launch colour field',0,0,W,H,linear(W,H,[accent,'#F3EADB',accent]));text('MEET YOUR\nNEXT '+sector.noun.toUpperCase()+'.',490,245,540,102,'Bebas Neue',400,t.ink,'headline',{lineHeight:1});text('[Approved launch message]',490,590,470,35,'Plus Jakarta Sans',500,t.ink);phone(135,435,276,503,-12);
  rect('Floating product card',435,845,360,235,t.light,18,{shadow,angle:7});text('[PRODUCT /\nSERVICE IMAGE]',476,915,280,30,'Plus Jakarta Sans',600,t.muted,'placeholder',{angle:7});circle('Launch orbit',855,970,68,t.ink);text('↗',879,972,90,83,'Space Grotesk',400,t.light,'arrow');pill('[EXPLORE]',80,1102,305,t.ink,t.white);
 },
 widgets:()=>{
  text('FROM IDEA.',80,210,930,91,'Plus Jakarta Sans',800,t.white,'headline');text('TO '+sector.noun.toUpperCase()+'.',80,313,920,75,'Plus Jakarta Sans',800,accent,'keyword');
  rect('Boarding pass',80,500,920,420,t.light,26,{shadow});rect('Ticket band',80,500,920,74,accent,26);text(brand.toUpperCase(),110,516,780,24,'Plus Jakarta Sans',800,t.ink,'brand');text('FROM',122,624,350,22,'Plus Jakarta Sans',600,t.muted,'label');text('TO',605,624,340,22,'Plus Jakarta Sans',600,t.muted,'label');text('[START POINT]',120,667,415,39,'Plus Jakarta Sans',800,t.ink,'support');text('[DESTINATION]',605,667,365,39,'Plus Jakarta Sans',800,t.ink,'support');text('↗',475,638,105,80,'Space Grotesk',500,accent,'arrow');
  for(let i=0;i<27;i++)rect('Ticket perforation',110+i*32,770,14,2,t.silver);circle('Ticket notch',59,752,22,t.dark);circle('Ticket notch',977,752,22,t.dark);
  text('[APPROVED DETAIL]',120,819,650,25,'Plus Jakarta Sans',500,t.ink);for(let i=0;i<30;i++)rect('Barcode',760+i*5,804,i%3===0?3:1,60,t.ink);
  rect('Definition module',80,977,530,185,accent,18);text(sector.noun+'.',108,1000,470,45,'Plus Jakarta Sans',800,t.ink,'support');text('[Your definition here]',108,1070,470,23,'Plus Jakarta Sans',400,t.ink);pill('SWIPE  →',702,1041,298,t.light);
 },
 community:()=>{
  // Deterministic, native vector newsprint texture; no reference art is embedded.
  let seed=8723;for(let i=0;i<460;i++){seed=(seed*16807)%2147483647;const x=seed%1080;seed=(seed*16807)%2147483647;circle('Paper grain',x,seed%1350,.5+(i%3)*.35,t.muted,{opacity:.15});}
  pill('[SESSION TYPE]',660,134,340,accent);text('IDEAS',180,275,820,248,'Anton',400,t.ink,'headline');text('TOGETHER',80,552,930,170,'Bebas Neue',400,accent,'keyword');
  text('COME & CONNECT',75,485,550,23,'Oswald',600,t.ink,'label',{angle:-90});frame(80,802,555,353);
  path('Metadata speech tip',754,799,[['M',0,0],['L',55,28],['L',0,28],['Z']],'transparent',0,t.ink);rect('Metadata bubble',699,821,301,119,t.ink,18);text('[TIME]',725,843,255,52,'Bebas Neue',400,t.light,'support');text('[DATE]\n[LOCATION]',709,986,290,28,'Plus Jakarta Sans',700,t.ink,'support');
 },
 };
 const build=builders[family];if(!build)throw new Error('Unknown reference family');build();branding(family==='launch'?t.ink:undefined);footer(family==='launch'?t.ink:undefined);scene.canvas.objects=objects;scene.name=family;
 return {version:1,width:W,height:H,scenes:[scene],audio:[]};
}
