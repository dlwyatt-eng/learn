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

test('family arrival shows learning themes, next plans and take-home reminders',()=>{
  for(const route of ['home','families']) {
    const html=render(route);
    for(const text of ['Division 8','Room 112','Annex','What we’re working on','Coming up','mathematical explanations','Nevermoor','Diwali','swimming','Matific','$5','School Cash Online','SpacesEDU and family access']) assert.ok(html.toLowerCase().includes(text.toLowerCase()),route+': '+text);
    assert.doesNotMatch(html,/Nothing due|On Monday, students tell a story|Friday Learning Story · optional sharing/);
  }
});

test('invited SpacesEDU status enables access across routes without requiring uploads',()=>{
  for(const date of ['2026-09-18','2026-09-22']) for(const route of ['home','students','families','portfolio','guide','learning']) {
    const html=render(route,date);
    assert.match(html,/href="https:\/\/ca\.spacesedu\.com\//,date+': '+route);
    assert.match(html,/SpacesEDU/);
    if(route==='portfolio') assert.match(html,/Family invitations have been sent/);
  }
});

test('the first-week recap remains current through the weekend without replacing the next phase',()=>{
  assert.equal(selection.selectPublicWindow(manifest.windows,'2026-09-20').id,'first-formed-class-week');
  assert.equal(selection.selectPublicWindow(manifest.windows,'2026-09-21').id,'surrey-place-and-election');
  const firstWeek=selection.selectPublicWindow(manifest.windows,'2026-09-18');
  assert.match(firstWeek.student.spacesNote,/No SpacesEDU upload is due/);
  assert.match(firstWeek.family.product,/no required Friday Learning Story/);
});

test('confirmed school dates render on home and families, preserve times, and expire with the confirmed food-drive date',()=>{
  for(const route of ['home','families']) {
    const html=render(route);
    for(const text of ['Tue, September 22','Photo Day','Fri, September 25','Mon, September 28','Grade 6 Reconciliation Walk','9:30 am','Wed, September 30','Latin American Heritage Month','Women’s History Month','5:30–6:30 pm','Hot Lunch','12:35 pm','1:00 pm','Thanksgiving','By Friday, October 16','October 26–30']) assert.ok(html.includes(text),route+': '+text);
    const october=render(route,'2026-10-03');
    assert.doesNotMatch(october,/>Photo Day</);
    assert.doesNotMatch(october,/Early dismissal/);
    assert.match(october,/We Scare Hunger food drive/);
    const november=render(route,'2026-11-01');
    assert.match(november,/National Child Day/);
    assert.match(november,/Human Rights Day/);
    assert.doesNotMatch(november,/We Scare Hunger food drive/);
    assert.doesNotMatch(render(route,'2026-11-02'),/Boo Bash|food drive launches|We Scare Hunger runs/);
    assert.doesNotMatch(render(route,'2026-11-21'),/dateTime="2026-11-20"/i);
    assert.doesNotMatch(render(route,'2026-12-11'),/>School dates</);
  }
  assert.equal(manifest.schoolEvents.find(item=>item.id==='food-drive').date,'2026-10-26');
});

test('classroom logistics stay on the student page, not parent arrival pages',()=>{
  const students=render('students','2026-10-22');
  for(const text of ['Our class routines','Library book exchange','9:20–9:35 am','Core French','usual weekly routines']) assert.ok(students.includes(text),text);
  for(const route of ['home','families']) {
    const html=render(route,'2026-10-19');
    assert.doesNotMatch(html,/Our class routines|Weekly times to remember|laptops are confirmed|student devices|computers for finishing|after recess|prep blocks|Mr\. Eckert/);
    for(const text of ['mathematical explanations','Nevermoor','creative projects','Photo retakes','Non-instructional day','Optional home practice']) assert.ok(html.includes(text),route+': '+text);
  }
  assert.match(render('students','2026-09-29'),/School dates/);
  assert.match(render('families','2026-09-29'),/No purchase is needed/);
});

test('contact entry points work without an installed email handler',()=>{
  for(const route of ['home','families','students']) assert.match(render(route,'2026-10-19'),/href="\/guide#contact"/);
  const html=render('guide','2026-10-19');
  assert.match(html,/id="contact"/);
  assert.match(html,/href="mailto:wyatt_daryl@surreyschools.ca"/);
  assert.match(html,/value="wyatt_daryl@surreyschools.ca"/);
  assert.match(html,/Copy email address/);
  assert.match(html,/If nothing opens, copy the address/);
});

test('family arrival prioritizes helpful guidance and uses dedicated welcome art',()=>{
  const home=render('home','2026-10-19');
  assert.match(home,/family-welcome-learning-v1.webp/);
  const hero=home.match(/<section class="current-hero">[\s\S]*?<\/section>/)?.[0];
  assert.doesNotMatch(hero,/Whole class, pairs|CIVIX BC elementary resources/);
  const family=render('families','2026-10-19');
  assert.ok(family.indexOf('How to help')<family.indexOf('Useful family links'));
});

test('dated class copy ages honestly and civic learning keeps the two votes distinct',()=>{
  const nextDay=render('families','2026-10-10');
  const afterUpdate = new Date(manifest.classroomWelcome.updatedOn + ' 12:00:00 UTC');
  afterUpdate.setUTCDate(afterUpdate.getUTCDate() + 1);
  const aged = render('families',afterUpdate.toISOString().slice(0,10));
  assert.ok(aged.includes(`Updated ${manifest.classroomWelcome.updatedOn}`));
  assert.ok(aged.includes(`Coming up · posted ${manifest.classroomWelcome.updatedOn}`));
  assert.match(nextDay,/Dates to plan around/);
  assert.match(nextDay,/Learning milestones · no family action needed/);
  assert.match(nextDay,/October 17:.*Surrey votes for/);
  assert.match(nextDay,/October 24:.*B\.C\. votes for/);
  assert.match(nextDay,/planned provincial Student Vote is Thursday October 22, 2026/);
  assert.match(nextDay,/class voting start is confirmed for 12:50 pm and registration is not confirmed here/);
  assert.match(nextDay,/school ballot district and full candidate roster still need verification/);
  assert.match(nextDay,/No municipal Student Vote is planned/);
  assert.doesNotMatch(nextDay,/Oct. 13–15|By Oct. 16/);
  assert.match(render('home','2026-10-06'),/CURRENT SOURCE/);
  assert.match(nextDay,/Equity learning/);
  assert.match(render('families','2026-10-01'),/PAC Hot Lunch/);
  assert.match(render('families','2026-10-01'),/ordering details/);
  assert.match(render('families','2026-10-18'),/Surrey voted for/);
  assert.doesNotMatch(render('families','2026-10-25'),/Two elections, two levels of government/);
});


test('compact reminders use confirmed events and disappear after their dates', () => {
  const section = date => render('families',date).match(/<section class="week-reminders"[\s\S]*?<\/section>/)?.[0] ?? '';
  const thisWeek = section('2026-10-06');
  for (const label of ['Terry Fox Run','12:35 pm','1:00 pm']) assert.ok(thisWeek.includes(label));
  assert.doesNotMatch(section('2026-10-07'),/permission form due/);
  assert.equal(section('2026-10-10'),'');
  assert.match(section('2026-10-12'),/Thanksgiving/);
});


test('November dates and inquiry resources render without promoting unconfirmed logistics to family pages',()=>{
  for(const route of ['home','families']){
    const html=render(route,'2026-11-09');
    for(const text of ['Diwali','November 11','swimming','Friday November 13']) assert.ok(html.includes(text),route+': '+text);
    assert.match(html,/https:\/\/dlwyatt-eng.github.io\/teacher-hub\/activities\/rights-evidence-bridge.html/);
    assert.doesNotMatch(html,/class="class-schedule"|Nolan|Sarang|IEP|support room|password/);
    assert.doesNotMatch(html,/Technology bookings are not confirmed|12:45–1:45/);
  }
  const students=render('students','2026-11-09');
  assert.match(students,/class="class-schedule"/);
  assert.match(students,/November 9–13/);
  assert.equal(selection.selectPublicWindow(manifest.windows,'2026-11-09').id,'november-peace-rights-and-inquiry');
  assert.doesNotMatch(render('students','2026-11-14'),/class="week-reminders"/);
  assert.match(render('students','2026-11-14'),/Our class routines/);
});

test('November inquiry welcomes families with the visible big idea',()=>{
 const html=render('families','2026-11-09');
 const hero=html.match(/<section class="family-dashboard-hero">[\s\S]*?<\/section>/)?.[0] ?? '';
 assert.match(hero,/How can we make the world better/);
 assert.match(hero,/Students will work in groups/);
 assert.match(hero,/AI as thinking partners/);
});
