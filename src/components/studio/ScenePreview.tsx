import {useEffect,useRef,useState} from 'react';
import type {StudioDocument} from '@/lib/studio/model';
import {assetUrl} from '@/lib/studio/data';
import {supabase} from '@/integrations/supabase/client';
export function ScenePreview({document:doc,compact=false}:{document:StudioDocument;compact?:boolean}){
 const host=useRef<HTMLDivElement>(null);const [url,setUrl]=useState('');const [failed,setFailed]=useState(false);const signature=JSON.stringify(doc);
 useEffect(()=>{let cancelled=false;let current='';setFailed(false);setUrl('');const element=host.current;if(!element)return;
 const observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();void (async()=>{try{
 const {makeImage}=await import('@/lib/studio/render');const scene=doc.scenes[0];if(!scene)return;
 const blob=await makeImage(doc,scene,async id=>{const {data,error}=await supabase.from('studio_assets').select('*').eq('id',id).single();if(error)throw error;return assetUrl(data);},'png',1,'');
 if(cancelled)return;current=URL.createObjectURL(blob);setUrl(current);
 }catch{if(!cancelled)setFailed(true);}})();},{rootMargin:'150px'});observer.observe(element);
 return()=>{cancelled=true;observer.disconnect();if(current)URL.revokeObjectURL(current);};},[signature]);
 return <div ref={host} className={compact?'flex h-20 w-full items-center justify-center':'flex h-72 w-full items-center justify-center bg-elevated'}>{url?<img src={url} alt="Template layout preview" className="h-full max-w-full object-contain"/>:<span role="status" className="text-xs text-muted-foreground">{failed?'Preview unavailable':'Loading preview…'}</span>}</div>;
}
