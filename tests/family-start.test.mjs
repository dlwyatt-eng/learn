import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {moduleLoader} from './helpers/load-rendered-module.mjs';
const root=path.resolve(import.meta.dirname,'..');
function render(route,date){
 const base=moduleLoader(root);
 const load=moduleLoader(root,{'next/image':({priority,fill,unoptimized,...props})=>React.createElement('img',props),'next/link':({children,...props})=>React.createElement('a',props,children),'./public-window-selection.mjs':{...base('app/public-window-selection.mjs'),vancouverDateKey:()=>date}});
 return renderToStaticMarkup(React.createElement(load('app/classroom-portal.tsx').default,{route}));
}
test('family starting points keep portfolio, reminders and optional support distinct',()=>{
 const html=render('families','2026-11-12');
 assert.match(html,/What brings you here/);
 assert.match(html,/Teacher-requested unfinished work is separate from optional practice/);
 assert.match(html,/href="\/portfolio" class="family-start-card"/);
 assert.match(html,/href="\/homework" class="family-start-card"/);
 assert.match(html,/href="\/families#family-reminders-title"/);
 assert.match(html,/id="family-reminders-title"/);
});
test('reminder starting point remains valid after the dated events expire',()=>{
 const html=render('families','2027-01-10');
 assert.match(html,/id="family-reminders-title"/);
 assert.doesNotMatch(html,/MARK YOUR CALENDAR · 2026/);
});
test('family-only dashboard does not change the student task route',()=>{
 assert.doesNotMatch(render('students','2026-11-12'),/What brings you here/);
});
test('quick-start styling reflows, supports keyboard focus and stays out of print',()=>{
 const css=readFileSync(path.join(root,'app/classroom-portal-v2.css'),'utf8');
 assert.match(css,/family-start-card:focus-visible/);
 assert.match(css,/@media\(max-width:1000px\)\{\.family-start-grid\{grid-template-columns:1fr/);
 assert.match(css,/@media print\{\.family-start\{display:none\}\}/);
});
