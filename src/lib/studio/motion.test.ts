import { test } from 'node:test';
import assert from 'node:assert/strict';
import { animatedLayer } from './motion';
import { DEFAULT_MOTION } from './model';
const layer={id:'test',label:'Title',type:'Textbox',text:'We make ideas real.',left:100,top:100,opacity:1,motion:{...DEFAULT_MOTION,preset:'Slide'}};
test('motion does not mutate editable layer source',()=>{const before=JSON.stringify(layer);const start=animatedLayer(layer,0,5);assert.equal(start.opacity,0);assert.equal(JSON.stringify(layer),before);assert.equal(animatedLayer(layer,2,5).top,100);});
test('character reveals follow local scene time',()=>{const l={...layer,motion:{...DEFAULT_MOTION,preset:'Typewriter',duration:1}};assert.equal(animatedLayer(l,.5,5).text,'We make id');assert.equal(animatedLayer(l,2,5).text,layer.text);});
