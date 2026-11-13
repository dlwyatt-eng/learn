import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {moduleLoader} from './helpers/load-rendered-module.mjs';
import {monthlyPublicWindowForDate} from '../app/monthly-public-window.mjs';
const root=path.resolve(import.meta.dirname,'..');
const manifest=moduleLoader(root)('app/generated/public-window-v2.json');
function render(route,date='2026-11-09'){
 const load=moduleLoader(root,{'next/image':({priority,fill,unoptimized,...props})=>React.createElement('img',props),'next/link':({children,...props})=>React.createElement('a',props,children),'./public-window-selection.mjs':{vancouverDateKey:()=>date,publicWindowState:()=> 'current',selectPublicWindow:()=>null}});
 return renderToStaticMarkup(React.createElement(load('app/classroom-portal.tsx').default,{route}));
}
test('monthly outlook never invents identical current subject snapshots',()=>{
 for(const date of ['2026-11-02','2026-12-01'])assert.deepEqual(monthlyPublicWindowForDate(manifest.yearMonths,manifest.window,date).shared.subjectSnapshot,[]);
});
test('all ten subject cards render independently with their status and detail',()=>{
 const html=render('learning');
 const section=html.split('class="subject-now-grid"')[1].split('</section>')[0];
 assert.equal((section.match(/<article/g)||[]).length,10);
 for(const item of manifest.learningUpdates.subjects){
  const card=section.split(`data-subject="${item.subject}"`)[1].split('</article>')[0];
  assert.ok(card.includes(item.focus));assert.ok(card.includes(item.status));assert.ok(card.includes(item.detail));
 }
 assert.equal(new Set([...section.matchAll(/<h3>(.*?)<\/h3>/g)].map(x=>x[1])).size,10);
 assert.match(section,/November 13, 2026/);
 assert.doesNotMatch(section,/Government, human rights, media, systems/);
 assert.match(html,/Ideas for the month/);
});
test('current arrival routes do not present annual-plan activities as tasks or deadlines',()=>{
 for(const route of ['home','students','families','portfolio']){
  const html=render(route);
  assert.doesNotMatch(html,/team inquiry-question clinic|power-map feedback wall|power-in-the-room simulation|Juniper Park|HAPPENING NOW/);
  assert.match(html,/November 13, 2026/);
  assert.match(html,/href="https:\/\/ca.spacesedu.com\//);
 }
 assert.match(render('students'),/An unfinished class activity is not automatically homework/);
 assert.match(render('families'),/Separate daily homework is not routinely assigned/);
});

test('public copy explains learning without update-process commentary',()=>{
 const unwanted=/latest confirmed classroom context|unconfirmed focus is labelled|not verified for this update|not confirmation that the lesson|no chapter is assumed|Follow actual classroom progress|Read the dated subject updates/;
 for(const route of ['home','students','families','learning','portfolio','guide','homework','newsroom','rights','truth-and-reconciliation'])assert.doesNotMatch(render(route),unwanted,route);
 const html=render('learning');
 assert.match(html,/Our November 12 swimming trip/);assert.match(html,/No separate art activity is planned for Friday/);assert.match(html,/brief inquiry introduction may begin on Friday if students are ready/);
 assert.match(html,/materials and instructions from your French teacher/);
 assert.match(render('guide'),/Ask Mr. Wyatt where to start/);
});
