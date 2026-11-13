import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { moduleLoader } from './helpers/load-rendered-module.mjs';
const root=path.resolve(import.meta.dirname,'..');
const adapters=moduleLoader(root);
const selection=adapters('app/public-window-selection.mjs');
const Link=adapters('pages/next-link.tsx').default;
function render(route, date='2026-11-13') {
 const load=moduleLoader(root,{
  'next/image':({priority,fill,unoptimized,...props})=>React.createElement('img',props),
  'next/link':Link,
  './public-window-selection.mjs':{...selection,vancouverDateKey:()=>date},
 });
 return renderToStaticMarkup(React.createElement(load('app/classroom-portal.tsx').default,{route}));
}
test('student launchpad distinguishes unfinished work, sharing and optional choices',()=>{
 const html=render('students');
 for(const text of ['Start here.','Make it yours.','Pick up where you stopped','Show your thinking','Try something optional','An unfinished class activity is not automatically homework','These links are not new assignments','Inquiry Fieldnotes does not autosave','print, save as PDF or copy your notes'])assert.ok(html.includes(text),text);
 assert.match(html,/subject=English\+Language\+Arts&amp;mode=student/);
 assert.match(html,/href="#\/students\?anchor=sharing-check"/);
 assert.match(html,/id="sharing-check"/);
 assert.doesNotMatch(html,/#[^" ]*#/);
});
test('learning navigation resolves the real subject destination and all ten subjects remain',()=>{
 const html=render('learning');
 assert.match(html,/href="#\/learning\?anchor=subject-now-title"/);
 assert.match(html,/id="subject-now-title"/);
 assert.equal((html.match(/data-subject=/g)||[]).length,10);
 assert.match(html,/A conversation, not a quiz/);
 assert.match(html,/government, migration, resources, cooperation and rights/);
 assert.doesNotMatch(html,/rights-led country inquiry|Technology bookings|laptops are booked|Swimming is planned for Thursday/);
});
test('current pages preserve safe boundaries and unique labelled destinations',()=>{
 for(const route of ['students','learning']) {
  const html=render(route);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,route+' duplicate ids');
  for(const label of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of label[1].split(' '))assert.ok(ids.includes(id),id);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  for(const image of html.matchAll(/src="(\/images\/[^"?]+)"/g))assert.ok(existsSync(path.join(root,'public',image[1])),image[1]);
  assert.doesNotMatch(html,/support room|IEP|new upload deadline|laptop booking/i);
 }
});
test('refresh has responsive, focus and ink-friendly print rules without hidden route actions',()=>{
 const css=readFileSync(path.join(root,'app/student-learning-refresh.css'),'utf8');
 assert.match(css,/@media \(width<=760px\)/);
 assert.match(css,/focus-visible/);assert.match(css,/@media print/);
 assert.match(css,/min-width: 0/);assert.match(css,/overflow-wrap: anywhere/);
 assert.match(css,/launch-archive:not\(\[open\]\)/);
 assert.match(css,/share-studio.*display: block/);
 const html=render('students');assert.match(html,/<summary>Class routines and school dates<\/summary>/);
});
test('saved historical first-week resources remain available rather than overwritten',()=>{
 const html=render('students','2026-09-10');
 assert.match(html,/Five pages, five ways to begin/);
 assert.doesNotMatch(html,/Start here\.<br\/>/);
});
