import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {moduleLoader} from './helpers/load-rendered-module.mjs';

const root=path.resolve(import.meta.dirname,'..');
const data=moduleLoader(root);
const manifest=data('app/generated/public-window-v2.json');
const selection=data('app/public-window-selection.mjs');
function render(route,date='2026-09-18') {
  const load=moduleLoader(root,{
    'next/image':({priority,fill,unoptimized,...props})=>React.createElement('img',props),
    'next/link':({children,...props})=>React.createElement('a',props,children),
    './public-window-selection.mjs':{...selection,vancouverDateKey:()=>date},
  });
  return renderToStaticMarkup(React.createElement(load('app/classroom-portal.tsx').default,{route}));
}

test('family arrival shows current completed learning, next plans and take-home reminders',()=>{
  for(const route of ['home','families']) {
    const html=render(route);
    for(const text of ['Division 8','Room 112','Annex','Our learning so far','Planned for Thursday, September 24','completed decimal place value','Nevermoor','rounding/comparing decimals','Orange Shirt Day artwork','Matific','returned forms','device-use form','$6','School Cash Online','SpacesEDU class setup']) assert.ok(html.toLowerCase().includes(text.toLowerCase()),route+': '+text);
    assert.doesNotMatch(html,/Nothing due|On Monday, students tell a story|Friday Learning Story · optional sharing/);
  }
});

test('pending SpacesEDU status suppresses sign-in prompts across routes and next-week rollover',()=>{
  for(const date of ['2026-09-18','2026-09-22']) for(const route of ['home','students','families','portfolio','guide','learning']) {
    const html=render(route,date);
    assert.doesNotMatch(html,/href="https:\/\/ca\.spacesedu\.com\//,date+': '+route);
    assert.match(html,/SpacesEDU setup/);
    if(route==='portfolio') assert.match(html,/Once class access is ready/);
  }
});

test('the first-week recap remains current through the weekend without replacing the next phase',()=>{
  assert.equal(selection.selectPublicWindow(manifest.windows,'2026-09-20').id,'first-formed-class-week');
  assert.equal(selection.selectPublicWindow(manifest.windows,'2026-09-21').id,'surrey-place-and-election');
  const firstWeek=selection.selectPublicWindow(manifest.windows,'2026-09-18');
  assert.match(firstWeek.student.spacesNote,/No SpacesEDU upload is due/);
  assert.match(firstWeek.family.product,/no required Friday Learning Story/);
});

test('confirmed school dates render on home and families, preserve times, and expire without guessing the food-drive date',()=>{
  for(const route of ['home','families']) {
    const html=render(route);
    for(const text of ['Tue, September 22','Photo Day','Fri, September 25','Mon, September 28','Grade 6 Reconciliation Walk','9:30 am','Wed, September 30','5:30–6:30 pm','Hot lunch','1:35 pm','1–2 pm','Thanksgiving','By Friday, October 16','Last week of October']) assert.ok(html.includes(text),route+': '+text);
    const october=render(route,'2026-10-03');
    assert.doesNotMatch(october,/>Photo Day</);
    assert.match(october,/Early dismissal/);
    assert.match(october,/We Scare Hunger food drive/);
    const november=render(route,'2026-11-01');
    assert.match(november,/National Child Day/);
    assert.match(november,/Human Rights Day/);
    assert.doesNotMatch(november,/We Scare Hunger food drive/);
    assert.doesNotMatch(render(route,'2026-11-21'),/dateTime="2026-11-20"/i);
    assert.doesNotMatch(render(route,'2026-12-11'),/>School dates</);
  }
  assert.equal(manifest.schoolEvents.find(item=>item.id==='food-drive').date,null);
});

test('dated class copy ages honestly and civic learning keeps the two votes distinct',()=>{
  const nextDay=render('families','2026-09-25');
  assert.match(nextDay,/This class update was posted on September 24, 2026/);
  assert.match(nextDay,/Plan as of September 24, 2026/);
  assert.match(nextDay,/Dates to plan around/);
  assert.match(nextDay,/Learning milestones · no family action needed/);
  assert.match(nextDay,/October 17:.*Surrey votes for/);
  assert.match(nextDay,/October 24:.*B\.C\. votes for/);
  assert.match(nextDay,/school plans are not confirmed/);
  assert.match(nextDay,/Equity learning/);
  assert.equal((nextDay.match(/Registration is currently unavailable/g)??[]).length,1);
  assert.match(render('families','2026-10-18'),/Surrey voted for/);
  assert.doesNotMatch(render('families','2026-10-25'),/Two elections, two levels of government/);
});
