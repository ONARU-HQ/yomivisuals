import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/site/ui';
import { FORMAT_PRESETS, resizeDocument, validateDesign } from '@/lib/studio/catalogue';
import { asJson, type Project } from '@/lib/studio/data';
import { supabase } from '@/integrations/supabase/client';
import type { StudioDocument, Kit } from '@/lib/studio/model';
export function FormatVariants({project,document:doc,title}:{project:Project;document:StudioDocument;title:string}){
 const [selected,setSelected]=useState<number[]>([0,1,2]);const [busy,setBusy]=useState(false);const [created,setCreated]=useState<{id:string;name:string;warnings:number}[]>([]);const cache=useQueryClient();const navigate=useNavigate();
 async function create(){setBusy(true);try{const rows=selected.map(i=>{const f=FORMAT_PRESETS[i];return {brand_id:project.brand_id,title:`${title} — ${f.name}`,kind:project.kind,document:asJson(resizeDocument(doc,f.width,f.height,f.safe)),kit_snapshot:project.kit_snapshot,kit_version:project.kit_version,source_project_id:project.id,metadata:asJson({...project.metadata as object,format:f.name,reviewRequired:true})};});const {data,error}=await supabase.from('studio_projects').insert(rows).select();if(error)throw error;setCreated(data.map(p=>({id:p.id,name:p.title,warnings:validateDesign(p.document as unknown as StudioDocument,p.kit_snapshot as unknown as Kit).length})));await cache.invalidateQueries({queryKey:['studio','projects']});toast.success(`${data.length} independent variants saved. Review each before export.`);}catch(e){toast.error(e instanceof Error?e.message:'Variant creation failed.');}finally{setBusy(false);}}
 return <details className="border-y border-border py-5"><summary className="cursor-pointer text-sm">Format variants / campaign pack</summary><div className="mt-5 space-y-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{FORMAT_PRESETS.map((f,i)=><label key={f.name} className="text-xs"><input className="mr-2" type="checkbox" checked={selected.includes(i)} onChange={e=>setSelected(e.target.checked?[...selected,i]:selected.filter(v=>v!==i))}/>{f.name} · {f.width} × {f.height}</label>)}</div><Button variant="outline" disabled={busy||!selected.length} onClick={create}><Copy className="h-4 w-4"/>Create editable variants</Button>{created.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-3 text-sm"><span>{p.name} · {p.warnings} review checks</span><Button variant="ghost" onClick={()=>navigate({to:'/admin/design-studio/$id',params:{id:p.id}})}><Check className="h-4 w-4"/>Review variant</Button></div>)}</div></details>;
}
