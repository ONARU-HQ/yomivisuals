import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newDocument, sceneAt, totalDuration, validateDocument, templateScene } from './model';
const kit={colors:['#080808','#FFFFFF','#C6A15B'],font:'Inter',tone:'',approved:true};
test('explainer timeline accepts five minutes and rejects a longer project',()=>{const d=newDocument(1920,1080,kit);d.scenes[0].duration=300;assert.doesNotThrow(()=>validateDocument(d));d.scenes[0].duration=301;assert.throws(()=>validateDocument(d));});
test('scenes resolve independently at exact transition boundaries',()=>{const d=newDocument(1080,1920,kit);d.scenes.push(templateScene(kit,'YOFA',1080,1920,'Editorial'));assert.equal(totalDuration(d),10);assert.equal(sceneAt(d,5).index,1);assert.equal(sceneAt(d,5).local,0);});
test('brand kits are not mutated when composing editable templates',()=>{const before=JSON.stringify(kit);const s=templateScene(kit,'TRYSA',1080,1080,'Offer');s.canvas.objects[0].fill='#222222';assert.equal(JSON.stringify(kit),before);assert.ok(s.canvas.objects.some(l=>l.type==='Textbox'));});