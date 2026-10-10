import { emptyScene, uid, type StudioDocument } from './model';
export const CREATION_TYPES = ['Quick Graphic','Start from Library','Blank Design','Carousel','Motion & Video'] as const;
export type CreationType = typeof CREATION_TYPES[number];
export const MAX_CAROUSEL_PAGES = 20;
export function editPages(source:StudioDocument,index:number,action:string,carousel:boolean){
 const next=structuredClone(source);let active=Math.max(0,Math.min(index,next.scenes.length-1));
 if((action==='add'||action==='duplicate')&&carousel&&next.scenes.length>=MAX_CAROUSEL_PAGES)throw new Error('A carousel supports up to 20 slides.');
 if(action==='add'){const s=emptyScene(next.scenes[active]?.canvas.background);s.name=`Slide ${next.scenes.length+1}`;next.scenes.push(s);active=next.scenes.length-1;}
 if(action==='duplicate'){const s=structuredClone(next.scenes[active]);s.id=uid();s.canvas.objects.forEach(l=>l.id=uid());s.name+=' copy';next.scenes.splice(active+1,0,s);active++;}
 if(action==='delete'&&next.scenes.length>1){next.scenes.splice(active,1);active=Math.min(active,next.scenes.length-1);}
 if(action==='left'&&active>0){[next.scenes[active-1],next.scenes[active]]=[next.scenes[active],next.scenes[active-1]];active--;}
 if(action==='right'&&active<next.scenes.length-1){[next.scenes[active+1],next.scenes[active]]=[next.scenes[active],next.scenes[active+1]];active++;}
 return {document:next,index:active};
}
export function compatibleExports(kind:string){if(['motion','explainer','video'].includes(kind))return ['mp4'] as const;if(kind==='print')return ['pdf','png','jpeg'] as const;if(kind==='carousel')return ['png','jpeg','pdf'] as const;if(kind==='email')return ['png','jpeg','html'] as const;return ['png','jpeg'] as const;}
export function validateCreation(doc:StudioDocument,kind:string){if(kind==='carousel'&&(doc.scenes.length<1||doc.scenes.length>20))throw new Error('Carousels require 1–20 slides.');}
