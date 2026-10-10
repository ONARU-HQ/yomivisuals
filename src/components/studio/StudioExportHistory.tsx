import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/site/ui';
import { supabase } from '@/integrations/supabase/client';
export function StudioExportHistory({brandId}:{brandId:string}){
 const {data:exports=[]}=useQuery({queryKey:['studio','brand-exports',brandId],queryFn:async()=>{const {data:projects,error:pError}=await supabase.from('studio_projects').select('id').eq('brand_id',brandId);if(pError)throw pError;if(!projects.length)return [];const {data,error}=await supabase.from('studio_exports').select('*').in('project_id',projects.map(p=>p.id)).order('created_at',{ascending:false}).limit(50);if(error)throw error;return data;}});
 return <section className="space-y-4"><h2 className="text-xl">Recent exports</h2>{!exports.length?<p className="text-sm text-muted-foreground">No exports for this brand yet.</p>:exports.map(e=><div key={e.id} className="flex flex-wrap justify-between gap-3 border-b border-border py-4 text-sm"><div><span>{e.format.toUpperCase()} / {e.status}</span><p className="mt-2 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}{e.error?` · ${e.error}`:''}</p></div>{e.status==='complete'&&e.storage_path?<Button variant="ghost" onClick={async()=>{if(!e.storage_path)return;const {data,error}=await supabase.storage.from('media').createSignedUrl(e.storage_path,3600);if(error){toast.error(error.message);return;}const a=document.createElement('a');a.href=data.signedUrl;a.download=(e.settings as Record<string,string>)?.filename??`export.${e.format}`;a.click();}}><Download className="h-4 w-4"/>Download</Button>:null}</div>)}</section>;
}
