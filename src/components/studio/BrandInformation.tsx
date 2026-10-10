import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Field, inputClass } from '@/components/site/ui';
import { CONTACT_FIELDS, type BrandInformation as Info } from '@/lib/studio/catalogue';
import { asJson, type Brand } from '@/lib/studio/data';
import { supabase } from '@/integrations/supabase/client';
export function BrandInformation({brand}:{brand:Brand}){
 const [info,setInfo]=useState<Info>(brand.information as Info);const [busy,setBusy]=useState(false);const cache=useQueryClient();
 async function save(){setBusy(true);try{for(const field of ['website','bookingUrl','qrUrl']){const value=info[field as keyof Info];if(value&&!/^https:\/\//.test(value))throw new Error('Website and destination links must begin with https://.');}if(info.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))throw new Error('Enter a valid business email.');const {error}=await supabase.from('studio_brands').update({information:asJson(info)}).eq('id',brand.id);if(error)throw error;await cache.invalidateQueries({queryKey:['studio','brands']});toast.success('Brand information saved.');}catch(e){toast.error(e instanceof Error?e.message:'Save failed.');}finally{setBusy(false);}}
 return <section className="space-y-6"><div><h2 className="text-xl">{brand.name} / Business information</h2><p className="mt-2 text-sm text-muted-foreground">{info.parentBrand?`Part of ${info.parentBrand}. Separate contact details have not been supplied.`:'Only supplied or reviewed business details.'}</p></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{CONTACT_FIELDS.map(key=><Field key={key} label={key.replace(/([A-Z])/g,' $1')}><input aria-label={`Brand ${key}`} className={inputClass} value={info[key]??''} onChange={e=>setInfo({...info,[key]:e.target.value})} placeholder="Not supplied"/></Field>)}</div><Button disabled={busy} onClick={save}><Check className="h-4 w-4"/>Save business information</Button></section>;
}
