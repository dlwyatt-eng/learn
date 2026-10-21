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
 assert.match(render('2026-10-21'),/THIS WEEK’S OPTIONAL PRACTICE/);
 for(const date of ['2026-10-18','2026-10-26','2027-02-01']){const html=render(date);assert.match(html,/LATEST PUBLISHED PRACTICE/);assert.match(html,/not a new assignment for today/);assert.doesNotMatch(html,/THIS WEEK’S OPTIONAL PRACTICE/);}
});
test('actual tasks, answers, offline routes and private support render',()=>{
 const html=render('2026-10-21');
 for(const text of ['Keep both 2s: 2 × 2 × 3 = 12','18 = 2 × 3 × 3','24 = 2 × 2 × 2 × 3','18 ÷ 3 = 6','1 is not prime','Matific','work ahead','school-provided account','Tell a tiny mystery','Screen-free choice','NoRedInk','Prodigy Math','no hand-in deadline','no new home upload due','Include checking guidance in print']) assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);
 assert.equal((html.match(/class="homework-activity"/g)||[]).length,11);
 assert.match(html,/href="\/homework#homework-menu"/);
 assert.doesNotMatch(html,/href="https:\/\/ca.spacesedu.com\//);
});
test('district resources retain official sources, access conditions and offline choices',()=>{
 const html=render('2026-10-21');
 const section=html.split('id="surrey-resources"')[1].split('</section>')[0];
 assert.equal((section.match(/<article/g)||[]).length,6);
 for(const text of ['Sora','World Book Student','Explora Primary','Learn360','Curio (CBC)','Math Learning Center apps','Technology Tool Consent','check student setup','not district assignments','No purchase is needed']) assert.ok(section.includes(text),text);
 assert.equal((section.match(/Screen-free choice:/g)||[]).length,6);
 assert.equal((section.match(/href="https:\/\/surreyschoolsone.ca\/resources\//g)||[]).length,6);
 assert.match(html,/href="\/homework#surrey-resources"/);
});

test('three featured choices come first and the full optional library remains',()=>{
 const html=render('2026-10-21');
 const featured=html.split('aria-label="3 featured optional choices"')[1].split('class="homework-library"')[0];
 const library=html.split('class="homework-library"')[1].split('</section>')[0];
 assert.equal((featured.match(/class="homework-activity"/g)||[]).length,3);
 assert.equal((featured.match(/open=""/g)||[]).length,3);
 assert.equal((library.match(/class="homework-activity"/g)||[]).length,8);
 assert.equal((library.match(/open=""/g)||[]).length,0);
 assert.ok(featured.indexOf('Read, notice and explain') < featured.indexOf('Factor trees'));
 for(const text of ['Draw the same object twice','Print featured choices','Include more practice choices in print','not a weekly checklist','ask Mr. Wyatt privately','October 21, 2026']) assert.ok(html.includes(text),text);
 assert.doesNotMatch(html,/class="content-page homework-page include-library"/);
});
