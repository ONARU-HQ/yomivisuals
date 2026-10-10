import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editPages, compatibleExports, validateCreation } from './workspace';
import { newDocument } from './model';
const kit={colors:['#111111','#ffffff'],font:'Arial',tone:'',approved:true};
test('carousel allows 1–20 independent slides and rejects slide 21',()=>{let doc=newDocument(1080,1080,kit);for(let i=1;i<20;i++)doc=editPages(doc,0,'duplicate',true).document;assert.equal(doc.scenes.length,20);assert.equal(new Set(doc.scenes.map(s=>s.id)).size,20);assert.throws(()=>editPages(doc,0,'add',true),/20/);assert.throws(()=>editPages(doc,0,'duplicate',true),/20/);validateCreation(doc,'carousel');});
test('delete preserves at least one carousel page',()=>{const doc=newDocument(1080,1080,kit);assert.equal(editPages(doc,0,'delete',true).document.scenes.length,1);});
test('page order changes independently without mutating original',()=>{const source=editPages(newDocument(1080,1080,kit),0,'duplicate',true).document;const id=source.scenes[1].id;const moved=editPages(source,1,'left',true);assert.equal(moved.document.scenes[0].id,id);assert.notEqual(source.scenes[0].id,id);});
test('exports match graphics, carousel, print and motion types',()=>{assert.deepEqual(compatibleExports('graphic'),['png','jpeg']);assert.deepEqual(compatibleExports('carousel'),['png','jpeg','pdf']);assert.deepEqual(compatibleExports('print'),['pdf','png','jpeg']);assert.deepEqual(compatibleExports('motion'),['mp4']);});
