import { referenceDocument } from './reference-families';
import { emptyScene, textLayer, uid, type Kit, type StudioDocument, type Layer } from './model';
import { contactValue, type BrandInformation } from './catalogue';
export const STUDIO_FONTS = [
 {name:'Plus Jakarta Sans',style:'Premium startup sans',license:'SIL OFL',match:'Trust stacks and micro-UI'},
 {name:'Clash Display',style:'Distinctive display',license:'ITF FFL · web embedding',match:'Curiosity hooks'},
 {name:'Syne',style:'Geometric display',license:'SIL OFL',match:'Services and monoline statements'},
 {name:'Bebas Neue',style:'Condensed display',license:'SIL OFL',match:'Launches and posters'},
 {name:'Oswald',style:'Condensed sans',license:'SIL OFL',match:'Poster labels'},
 {name:'Archivo',style:'High-contrast grotesk',license:'SIL OFL',match:'Curiosity supporting typography'},
 {name:'Inter',style:'Neutral grotesk',license:'SIL OFL',match:'Existing brand font'},
 {name:'Manrope',style:'Bold geometric',license:'SIL OFL',match:'Keyword-led posters'},
 {name:'DM Sans',style:'Modern sans',license:'SIL OFL',match:'Service lists and clean campaigns'},
 {name:'Anton',style:'Condensed display',license:'SIL OFL',match:'Oversized promotional headlines'},
 {name:'Space Grotesk',style:'Technical grotesk',license:'SIL OFL',match:'SaaS and product explainers'},
 {name:'Instrument Serif',style:'Editorial serif',license:'SIL OFL',match:'Existing editorial font'},
 {name:'Arial',style:'System sans',license:'Device font',match:'Device-dependent'},
 {name:'Georgia',style:'System serif',license:'Device font',match:'Device-dependent'},
];
export const OBJECTIVES=['Awareness','Education','Enquiries','Engagement','Launch','Conversion','Retention'];
const ALL=['Yomi Visuals','YV Studios Africa','YV Experience','Shop 1401','Folak Catering','NUWA Africa','TRYSA','YOFA','TRYSA Community','ONARU'];
const LEGACY_RECIPES=[
 {key:'editorial-keyword',name:'The keyword edit',objective:'Awareness',category:'Brand awareness',style:'Editorial',font:'Manrope',brands:ALL},
 {key:'service-index',name:'The service index',objective:'Enquiries',category:'Product or service showcases',style:'Minimal',font:'DM Sans',brands:['Yomi Visuals','YV Studios Africa','Folak Catering','NUWA Africa','TRYSA','ONARU']},
 {key:'trust-statement',name:'The bold statement',objective:'Awareness',category:'Trust and credibility',style:'Bold typography',font:'Anton',brands:ALL},
 {key:'photo-conversion',name:'The visual invitation',objective:'Conversion',category:'Advertisements',style:'Photography-led',font:'Manrope',brands:['Yomi Visuals','YV Studios Africa','YV Experience','Shop 1401','Folak Catering','NUWA Africa','YOFA']},
 {key:'time-poster',name:'The next moment',objective:'Launch',category:'Announcements and launches',style:'Expressive',font:'DM Sans',brands:ALL},
 {key:'artist-feature',name:'The spotlight',objective:'Engagement',category:'Behind-the-scenes and storytelling',style:'Editorial',font:'Manrope',brands:['Yomi Visuals','YV Experience','YV Studios Africa','TRYSA Community']},
 {key:'saas-showcase',name:'The product story',objective:'Education',category:'Educational and informative posts',style:'Modern SaaS',font:'Space Grotesk',brands:['TRYSA','TRYSA Community','ONARU']},
 {key:'partner-carousel',name:'The partnership story',objective:'Education',category:'Carousel posts',style:'Minimal',font:'DM Sans',brands:ALL},
 {key:'food-discovery',name:'The discovery menu',objective:'Conversion',category:'Product or service showcases',style:'Expressive',font:'Manrope',brands:['YOFA','Folak Catering']},
] as const;
export const RECIPE_VERSION=2;
export const RECIPES=[
 {key:'services-matrix',family:'services',name:'Services Matrix',objective:'Enquiries',category:'Product or service showcases',style:'Premium SaaS',font:'Syne',brands:ALL},
 {key:'trust-stack',family:'trust',name:'Trust Stack',objective:'Awareness',category:'Brand awareness',style:'Dimensional',font:'Plus Jakarta Sans',brands:ALL},
 {key:'curiosity-hook',family:'curiosity',name:'Curiosity Hook',objective:'Education',category:'Educational and informative posts',style:'White editorial',font:'Clash Display',brands:ALL},
 {key:'stopwatch-cta',family:'stopwatch',name:'Stopwatch CTA',objective:'Conversion',category:'Advertisements',style:'Dimensional',font:'Plus Jakarta Sans',brands:ALL},
 {key:'monoline-statement',family:'monoline',name:'Monoline Statement',objective:'Awareness',category:'Brand awareness',style:'Minimal',font:'Syne',brands:ALL},
 {key:'launch-showcase',family:'launch',name:'Launch Showcase',objective:'Launch',category:'Announcements and launches',style:'Premium SaaS',font:'Bebas Neue',brands:ALL},
 {key:'ecosystem-widgets',family:'widgets',name:'Ecosystem Widgets',objective:'Engagement',category:'Carousel posts',style:'Micro UI',font:'Plus Jakarta Sans',brands:ALL},
 {key:'community-poster',family:'community',name:'Community Poster',objective:'Engagement',category:'Announcements and launches',style:'Newsprint',font:'Anton',brands:ALL},
] as const;
export function buildRecipe(key:string,brand:string,kit:Kit,info:BrandInformation={},logoId?:string):StudioDocument{
 const recipe=recipesForBrand(brand).find(r=>r.key===key);
 if(recipe)return referenceDocument(recipe.family,brand,kit,info,logoId);
 return legacyBuildRecipe(key,brand,kit,info,logoId);
}
export function recipesForBrand(name:string){return RECIPES.filter(r=>(r.brands as readonly string[]).includes(name));}
export function recommendRecipes(name:string,brief:string){const words=brief.toLowerCase();return recipesForBrand(name).map(r=>({recipe:r,score:[r.name,r.category,r.objective,r.style,r.key].join(' ').toLowerCase().split(/[\s-]+/).filter(w=>w.length>3&&words.includes(w)).length+(words.includes('carousel')&&r.key==='ecosystem-widgets'?5:0)+(words.includes('food')&&r.key==='launch-showcase'?5:0)+(words.includes('book')&&r.objective==='Enquiries'?3:0)})).sort((a,b)=>b.score-a.score).map(r=>r.recipe);}
function legacyBuildRecipe(key:string,brand:string,kit:Kit,info:BrandInformation={},logoId?:string):StudioDocument{
 const recipe=LEGACY_RECIPES.find(r=>r.key===key&&(r.brands as readonly string[]).includes(brand));if(!recipe)throw new Error('This template is not assigned to this business.');
 const w=1080,h=1350,ink=kit.colors[1]??'#FFFFFF',accent=kit.colors[2]??ink;
 const doc:StudioDocument={version:1,width:w,height:h,scenes:[],audio:[]};
 const count=key==='partner-carousel'?3:1;
 for(let page=0;page<count;page++){
 const scene=emptyScene(kit.colors[0]);scene.name=count>1?`Slide ${page+1}`:recipe.name;const layers:Layer[]=[];
 const text=(value:string,x:number,y:number,width:number,size:number,role:string,fill=ink)=>{const l=textLayer(value,x,y,width,size,kit);Object.assign(l,{role,fill,fontWeight:role==='headline'||role==='keyword'?800:400,charLimit:role==='headline'?80:role==='support'?180:100,minFontSize:24,maxFontSize:size});layers.push(l);};
 const rect=(label:string,x:number,y:number,width:number,height:number,fill=accent)=>layers.push({id:uid(),label,type:'Rect',left:x,top:y,originX:'left',originY:'top',width,height,fill,opacity:1});
 const imageFrame=(x:number,y:number,width:number,height:number)=>{rect('Image placement frame',x,y,width,height,accent);text('[Add authorised image]',x+32,y+height*.45,width-64,28,'placeholder',ink);};
 text(brand.toUpperCase(),72,72,700,28,'brand');
 if(key==='editorial-keyword'){text('[Your next idea]',72,570,890,110,'headline');text('[Keyword]',72,830,890,120,'keyword',accent);text('[Supporting statement]',72,1050,850,34,'support');rect('Editorial rail',890,220,5,300);}
 if(key==='service-index'){text('[Our expertise]',72,235,920,88,'headline');for(let i=0;i<4;i++){text(`0${i+1}`,72,440+i*155,100,32,'label',accent);text('[Approved service]',205,440+i*155,775,46,'service');rect(`Service divider ${i}`,72,550+i*155,900,2);}}
 if(key==='trust-statement'){text('[A bold\nbrand\nstatement]',150,310,780,145,'headline');text('[Why it matters]',150,940,780,40,'support');rect('Statement rule',150,1100,300,12);}
 if(key==='photo-conversion'){text('[A new perspective]',72,220,930,100,'headline');imageFrame(72,490,936,530);text('[Explore what is next]',72,1080,850,38,'support');}
 if(key==='time-poster'){layers.push({id:uid(),label:'Time dial',type:'Circle',left:330,top:270,radius:210,fill:'transparent',stroke:accent,strokeWidth:12,originX:'left',originY:'top'});rect('Dial hand',530,340,8,160);text('[The next moment]',100,790,880,86,'headline');text('[Confirmed date / detail]',100,1040,880,36,'support');}
 if(key==='artist-feature'){text('[In the spotlight]',72,240,900,85,'headline');imageFrame(420,500,588,620);text('[Name]',72,590,330,65,'keyword',accent);text('[Approved story]',72,800,315,36,'support');}
 if(key==='saas-showcase'){text('[Simplify your workflow]',72,240,910,96,'headline');text('[Approved product feature]',72,500,850,38,'support');imageFrame(120,660,840,380);rect('Product rule',72,1130,936,4);}
 if(key==='partner-carousel'){text(page===0?'[Start a conversation]':page===1?'[Share your perspective]':'[Your next step]',72,260,900,96,'headline');imageFrame(72,590,936,420);text('[Approved supporting detail]',72,1060,900,36,'support');text(`${page+1} / ${count}`,875,1180,140,26,'pagination');}
 if(key==='food-discovery'){text('[Discover your next favourite]',72,240,920,90,'headline');imageFrame(160,580,760,450);text('[Dish / menu name]',72,1090,900,46,'keyword',accent);}
 const footer=['website','instagram','email'].map(k=>contactValue(info,k)).filter(Boolean).join(' · ');if(footer)text(footer,72,1240,936,22,'contact');
 if(logoId)layers.push({id:uid(),label:'Approved brand logo',role:'logo',type:'Image',assetId:logoId,left:865,top:60,width:120,height:120,originX:'left',originY:'top',opacity:1});
 scene.canvas.objects=layers;doc.scenes.push(scene);
 }return doc;
}
export function paletteFromPixels(pixels:ArrayLike<number>){const counts=new Map<string,number>();for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]<200)continue;const rgb=[pixels[i],pixels[i+1],pixels[i+2]].map(v=>Math.round(v/32)*32).map(v=>Math.min(255,v));const key='#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');counts.set(key,(counts.get(key)??0)+1);}return [...counts].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c])=>c);}
export function replaceKeyword(doc:StudioDocument,find:string,replacement:string){const next=structuredClone(doc);if(!find.trim())return next;for(const s of next.scenes)for(const l of s.canvas.objects)if(typeof l.text==='string'&&!['brand','contact'].includes(l.role))l.text=l.text.split(find).join(replacement);return next;}
