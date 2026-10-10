import { supabase } from '@/integrations/supabase/client';
import { queryOptions } from '@tanstack/react-query';
import type { Database, Json } from '@/integrations/supabase/types';
import type { StudioDocument, Kit } from './model';
export type Brand = Database['public']['Tables']['studio_brands']['Row'];
export type Asset = Database['public']['Tables']['studio_assets']['Row'];
export type Project = Database['public']['Tables']['studio_projects']['Row'];
export const asJson = (value: unknown) => JSON.parse(JSON.stringify(value)) as Json;
export const brandsQuery=queryOptions({queryKey:['studio','brands'],queryFn:async()=>{const {data,error}=await supabase.from('studio_brands').select('*').order('name');if(error)throw error;return data;}});
export const projectsQuery=queryOptions({queryKey:['studio','projects'],queryFn:async()=>{const {data,error}=await supabase.from('studio_projects').select('*').order('updated_at',{ascending:false});if(error)throw error;return data;}});
export const assetsQuery=(brandId:string)=>queryOptions({queryKey:['studio','assets',brandId],queryFn:async()=>{const {data,error}=await supabase.from('studio_assets').select('*').eq('brand_id',brandId).order('created_at',{ascending:false});if(error)throw error;return data;}});
export const projectQuery=(id:string)=>queryOptions({queryKey:['studio','project',id],queryFn:async()=>{const {data,error}=await supabase.from('studio_projects').select('*').eq('id',id).single();if(error)throw error;return data;}});
export async function assetUrl(asset: Asset) { if(asset.external_url)return asset.external_url; if(!asset.storage_path)throw new Error('Asset file is missing.');const {data,error}=await supabase.storage.from('media').createSignedUrl(asset.storage_path,3600);if(error)throw error;return data.signedUrl; }
export async function uploadAsset(brandId:string,file:File,kind?:string,originalId?:string){
 const audio=file.type.startsWith('audio/');const video=file.type.startsWith('video/');
 if(!audio&&!video&&!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Choose a PNG, JPEG, WebP, audio or video file.');
 if(file.size>50*1024*1024 || !file.size)throw new Error('Files must be non-empty and under 50MB.');
 const path=`studio/${brandId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g,'_')}`;
 const {error}=await supabase.storage.from('media').upload(path,file);if(error)throw error;
 const {data,error:writeError}=await supabase.from('studio_assets').insert({brand_id:brandId,name:file.name,kind:kind??(audio?'audio':video?'video':'image'),storage_path:path,original_asset_id:originalId,rights_note:'User uploaded; usage rights require confirmation'}).select().single();if(writeError)throw writeError;return data;
}
export async function createProject(brand:Brand,title:string,document:StudioDocument,kind='graphic',isTemplate=false){const {data,error}=await supabase.from('studio_projects').insert({brand_id:brand.id,title,kind,document:asJson(document),kit_snapshot:brand.kit,kit_version:brand.kit_version,is_template:isTemplate}).select().single();if(error)throw error;return data;}
export const kitOf=(brand:Brand)=>brand.kit as unknown as Kit;