import { createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { projectQuery } from '@/lib/studio/data';
const Editor=lazy(()=>import('@/components/studio/StudioEditor'));
export const Route=createFileRoute('/_authenticated/admin/design-studio/$id')({loader:({context,params})=>context.queryClient.ensureQueryData(projectQuery(params.id)),head:()=>({meta:[{title:'Visual Editor — Yomi Visuals'},{name:'description',content:'Private editable brand designs, format variants and production exports.'},{property:'og:title',content:'Yomi Visuals Visual Editor'},{property:'og:description',content:'Editable multi-brand creative production.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex'}]}),component:StudioEditorRoute});
export function StudioEditorRoute(){const {id}=Route.useParams();return <Suspense fallback={<p>Opening your canvas…</p>}><Editor key={id} id={id}/></Suspense>;}