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
 assert.match(render('2026-09-23'),/THIS WEEK’S OPTIONAL PRACTICE/);
 for(const date of ['2026-09-22','2026-09-28','2027-02-01']){const html=render(date);assert.match(html,/LATEST PUBLISHED PRACTICE/);assert.match(html,/not a new assignment for today/);assert.doesNotMatch(html,/THIS WEEK’S OPTIONAL PRACTICE/);}
});
test('actual tasks, answers, offline routes and private support render',()=>{
 const html=render('2026-09-23');
 for(const text of ['6 ones, 2 tenths, 8 hundredths','2.305 = 2 + 0.3 + 0.005','0.5 = 0.50','Matific','work ahead','school-provided account','Tell a tiny mystery','Screen-free choice','NoRedInk','Prodigy Math','no hand-in deadline','nothing to upload','Include checking guidance in print']) assert.ok(html.includes(text),text);
 assert.equal((html.match(/class="homework-activity"/g)||[]).length,10);
 assert.match(html,/href="\/homework#homework-menu"/);
 assert.doesNotMatch(html,/href="https:\/\/ca.spacesedu.com\//);
});
test('district resources retain official sources, access conditions and offline choices',()=>{
 const html=render('2026-09-23');
 const section=html.split('id="surrey-resources"')[1].split('</section>')[0];
 assert.equal((section.match(/<article/g)||[]).length,6);
 for(const text of ['Sora','World Book Student','Explora Primary','Learn360','Curio (CBC)','Math Learning Center apps','Technology Tool Consent','check student setup','not district assignments','No purchase is needed']) assert.ok(section.includes(text),text);
 assert.equal((section.match(/Screen-free choice:/g)||[]).length,6);
 assert.equal((section.match(/href="https:\/\/surreyschoolsone.ca\/resources\//g)||[]).length,6);
 assert.match(html,/href="\/homework#surrey-resources"/);
});
