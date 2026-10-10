import { DEFAULT_MOTION, type Layer } from './model';
export function ease(p:number,kind:string){return kind==='linear'?p:kind==='ease-in-out'?(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2):1-Math.pow(1-p,3);}
export function animatedLayer(layer:Layer,t:number,sceneDuration:number):Layer {
 const m=layer.motion??{...DEFAULT_MOTION,preset:'None'}; if(m.preset==='None')return {...layer};
 const start=m.start+m.delay;const raw=Math.max(0,Math.min(1,(t-start)/Math.max(0.05,m.duration)));const p=ease(raw,m.easing);const out={...layer};const fadeOut=m.exit?Math.min(1,Math.max(0,(sceneDuration-t)/Math.max(.05,m.duration))):1;
 const amount=50*m.intensity;const ongoing=Math.max(0,Math.min(1,(t-start)/Math.max(.05,sceneDuration-start)));out.opacity=(layer.opacity??1)*m.endOpacity*fadeOut;if(t<start)out.opacity=0;
 if(['Fade','Slide','Scale & settle','Mask reveal','Blur to focus','Stagger','Tracking reveal','Kinetic typography','Highlight reveal','Parallax'].includes(m.preset))out.opacity*=p;
 if(['Slide','Stagger','Kinetic typography','Parallax','Mask reveal'].includes(m.preset)){const delta=amount*(1-p);out.left=(layer.left??0)+(m.direction==='left'?-delta:m.direction==='right'?delta:0);out.top=(layer.top??0)+(m.direction==='up'?delta:m.direction==='down'?-delta:0);}
 if(['Scale & settle','Kinetic typography'].includes(m.preset)){out.scaleX=(layer.scaleX??1)*(.85+.15*p);out.scaleY=(layer.scaleY??1)*(.85+.15*p);}
 if(m.preset==='Cinematic zoom'){out.scaleX=(layer.scaleX??1)*(1+.08*m.intensity*ongoing);out.scaleY=(layer.scaleY??1)*(1+.08*m.intensity*ongoing);}
 if(m.preset==='Pan & drift')out.left=(layer.left??0)+amount*ongoing;
 if(m.preset==='Float')out.top=(layer.top??0)+Math.sin(ongoing*Math.PI*2)*10*m.intensity;
 if(['Typewriter','Character reveal'].includes(m.preset)&&typeof layer.text==='string')out.text=layer.text.slice(0,Math.ceil(layer.text.length*raw));
 if(m.preset==='Word reveal'&&typeof layer.text==='string') {const words=layer.text.split(' ');out.text=words.slice(0,Math.ceil(words.length*raw)).join(' ');}
 if(m.preset==='Tracking reveal')out.charSpacing=(layer.charSpacing??0)+200*(1-p);
 if(m.preset==='Highlight reveal')out.textBackgroundColor=raw>.5?(layer.fill??'#FFFFFF'):'';
 return out;
}