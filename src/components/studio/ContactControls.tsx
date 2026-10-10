import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { Button } from '@/components/site/ui';
import { supabase } from '@/integrations/supabase/client';
import { CONTACT_FIELDS, contactValue, type BrandInformation } from '@/lib/studio/catalogue';
import { textLayer, type StudioDocument, type Kit } from '@/lib/studio/model';
export function ContactControls({brandId,document:doc,kit,onApply}:{brandId:string;document:StudioDocument;kit:Kit;onApply:(doc:StudioDocument)=>void}){
 const {data:brand}=useQuery({queryKey:['studio','contact-brand',brandId],queryFn:async()=>{const {data,error}=await supabase.from('studio_brands').select('*').eq('id',brandId).single();if(error)throw error;return data;}});const [fields,setFields]=useState<string[]>(['instagram','website']);
 const info=brand?.information as BrandInformation??{};
 function apply(){const next=structuredClone(doc);const text=fields.map(k=>contactValue(info,k)).filter(Boolean).join('  ·  ');next.scenes.forEach(s=>{s.canvas.objects=s.canvas.objects.filter(l=>l.role!=='contact');if(text){const l=textLayer(text,next.width*.075,next.height*.92,next.width*.85,Math.min(next.width*.019,next.height*.027),kit);l.role='contact';l.contactFields=fields;s.canvas.objects.push(l);}});onApply(next);}
 return <details className="border-b border-border pb-5"><summary className="cursor-pointer text-sm">Brand contact footer</summary><div className="mt-4 grid gap-3 sm:grid-cols-3">{CONTACT_FIELDS.filter(k=>!['parentBrand','legalName','qrUrl'].includes(k)).map(k=><label key={k} className="text-xs"><input type="checkbox" className="mr-2" checked={fields.includes(k)} onChange={e=>setFields(e.target.checked?[...fields,k]:fields.filter(f=>f!==k))}/>{k} {!info[k]?'· missing':''}</label>)}</div><Button variant="outline" className="mt-5" disabled={!brand} onClick={apply}><Check className="h-4 w-4"/>Apply current contacts to all pages</Button></details>;
}
