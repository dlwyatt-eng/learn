import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {moduleLoader} from './helpers/load-rendered-module.mjs';
const root=path.resolve(import.meta.dirname,'..');
function render(date){
 const load=moduleLoader(root,{'next/link':({children,...props})=>React.createElement('a',props,children),'./public-window-selection.mjs':{vancouverDateKey:()=>date}});
 return renderToStaticMarkup(React.createElement(load('app/homework-page.tsx').default));
}
test('dated practice becomes reusable rather than a new assignment',()=>{
 assert.match(render('2026-09-19'),/THIS WEEK’S OPTIONAL PRACTICE/);
 for(const date of ['2026-09-17','2026-09-21','2027-02-01']){const html=render(date);assert.match(html,/LATEST PUBLISHED PRACTICE/);assert.match(html,/not a new assignment for today/);assert.doesNotMatch(html,/THIS WEEK’S OPTIONAL PRACTICE/);}
});
test('actual tasks, answers, offline routes and private support render',()=>{
 const html=render('2026-09-19');
 for(const text of ['6,000 + 300 + 7','4,000 + 50 + 2','0.5 &gt; 0.05','Tell a tiny mystery','Screen-free choice','NoRedInk','Prodigy Math','no hand-in deadline','nothing to upload','Include checking guidance in print']) assert.ok(html.includes(text),text);
 assert.equal((html.match(/class="homework-activity"/g)||[]).length,10);
 assert.match(html,/href="\/homework#homework-menu"/);
 assert.doesNotMatch(html,/href="https:\/\/ca.spacesedu.com\//);
});
