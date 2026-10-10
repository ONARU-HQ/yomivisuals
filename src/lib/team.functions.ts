import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
const member=z.object({email:z.string().email(),name:z.string().min(1).max(100),username:z.string().regex(/^[a-zA-Z0-9_.-]{3,40}$/),role:z.enum(['editor','marketing','writer','developer'])});
export const inviteTeamMember=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>member.parse(input)).handler(async({data,context})=>{
 const {data:owner}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'super_admin'});const {data:admin}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});if(!owner&&!admin)throw new Error('Administrator access required.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {data:existing,error:lookupError}=await supabaseAdmin.from('profiles').select('id').ilike('username',data.username).maybeSingle();if(lookupError)throw lookupError;if(existing)throw new Error('Username is already in use.');
 const {data:invitation,error}=await supabaseAdmin.auth.admin.inviteUserByEmail(data.email,{data:{full_name:data.name},redirectTo:'https://yomivisuals.com/reset-password'});if(error)throw new Error('Invitation could not be sent. Check email delivery settings or try again.');if(!invitation.user)throw new Error('Invitation did not create an account.');
 const {error:profileError}=await supabaseAdmin.from('profiles').update({username:data.username,full_name:data.name}).eq('id',invitation.user.id);if(profileError)throw profileError;
 const {error:roleError}=await context.supabase.rpc('set_team_role',{_user_id:invitation.user.id,_role:data.role});if(roleError)throw new Error('Invitation sent, but permissions were not assigned. Update this member’s role before they use the studio.');return {ok:true};
});
export const usernameSignIn=createServerFn({method:'POST'}).inputValidator(input=>z.object({username:z.string().regex(/^[a-zA-Z0-9_.-]{3,40}$/),password:z.string().min(8).max(128)}).parse(input)).handler(async({data})=>{
 // Return credentials only after Auth verifies them; never expose username→email lookup results.
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {data:profile}=await supabaseAdmin.from('profiles').select('email').ilike('username',data.username).maybeSingle();
 const {createClient}=await import('@supabase/supabase-js');const key=process.env['SUPABASE_PUBLISHABLE_KEY'];const url=process.env['SUPABASE_URL'];if(!key||!url)throw new Error('Sign-in is unavailable.');
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_')&&h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const {data:result,error}=await client.auth.signInWithPassword({email:profile?.email??'unknown-account@yomivisuals.invalid',password:data.password});if(error||!result.session)throw new Error('Username or password is incorrect.');return {access_token:result.session.access_token,refresh_token:result.session.refresh_token};
});
