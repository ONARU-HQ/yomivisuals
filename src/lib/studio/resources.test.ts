import {test} from 'node:test';import assert from 'node:assert/strict';import {recipesForBrand,buildRecipe,recommendRecipes,paletteFromPixels,replaceKeyword} from './resources';
const kit={colors:['#101010','#FFFFFF','#C6A15B'],font:'Inter',tone:'',approved:true};
test('PLAYBAAQ is excluded from recipes',()=>assert.equal(recipesForBrand('PLAYBAAQ').length,0));
test('food templates are assigned only to food businesses',()=>{assert.ok(recipesForBrand('YOFA').some(r=>r.key==='food-discovery'));assert.ok(!recipesForBrand('ONARU').some(r=>r.key==='food-discovery'));});
test('native recipe retains editable text and shape layers without reference JPEG',()=>{const d=buildRecipe('editorial-keyword','Yomi Visuals',kit);assert.ok(d.scenes[0].canvas.objects.some(l=>l.type==='Textbox'));assert.ok(d.scenes[0].canvas.objects.some(l=>l.type==='Rect'));assert.ok(d.scenes[0].canvas.objects.every(l=>!l.src));});
test('carousel recommendation uses relevant brief',()=>assert.equal(recommendRecipes('TRYSA','make a carousel')[0].key,'partner-carousel'));
test('logo palette ignores transparent pixels',()=>assert.deepEqual(paletteFromPixels([255,0,0,0,0,0,0,255]),['#000000']));
test('keyword replacement preserves source and verified brand/footer',()=>{const d=buildRecipe('editorial-keyword','Yomi Visuals',kit,{website:'yomivisuals.com'});const copy=replaceKeyword(d,'Yomi','Other');assert.deepEqual(copy,d);const next=replaceKeyword(d,'Keyword','Future');assert.ok(next.scenes[0].canvas.objects.some(l=>l.text==='[Future]'));assert.ok(d.scenes[0].canvas.objects.some(l=>l.text==='[Keyword]'));});

test("all ten businesses have at least five curated starters",()=>{for(const name of ["Yomi Visuals","YV Studios Africa","YV Experience","Shop 1401","Folak Catering","NUWA Africa","TRYSA","YOFA","TRYSA Community","ONARU"])assert.ok(recipesForBrand(name).length>=5,name);});
