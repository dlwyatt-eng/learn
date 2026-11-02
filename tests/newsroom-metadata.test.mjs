import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {moduleLoader} from './helpers/load-rendered-module.mjs';
const load=moduleLoader(path.resolve(import.meta.dirname,'..'),{'next/link':({children,...props})=>React.createElement('a',props,children)});
const manifest=load('app/generated/public-window-v2.json');
const Newsroom=load('app/newsroom-public.tsx').default;
const render=newsroom=>renderToStaticMarkup(React.createElement(Newsroom,{newsroom}));

test('all Newsroom cards hide editorial check dates without changing source records',()=>{
 const original=JSON.stringify(manifest.newsroom);
 const html=render(manifest.newsroom);
 assert.doesNotMatch(html,/>Checked<|CHECKED AUG|Checked Aug\.|recheck after Sept|BEFORE OCT\. 17|Class vote/);
 assert.match(html,/SOURCE ARCHIVE/);
 assert.match(html,/Election reference/);
 assert.match(html,/October 17, 2026/);
 for(const source of manifest.newsroom.election.sources)assert.ok(html.includes(source.url));
 assert.equal(JSON.stringify(manifest.newsroom),original);
});

test('feature and infographic dates come from publication, never from review dates',()=>{
 const newsroom=structuredClone(manifest.newsroom);
 newsroom.features=[structuredClone(newsroom.featured)];
 let html=render(newsroom);
 assert.match(html,/PUBLISHED MAY 8, 2026/);
 assert.match(html,/REPORTED MAY 8, 2026/);
 assert.doesNotMatch(html,/CHECKED AUG|REPORTED AUG/);
 delete newsroom.features[0].sources[0].publishedOn;
 newsroom.features[0].sources[0].checkedOn='2026-08-20';
 html=render(newsroom);
 assert.doesNotMatch(html,/REPORTED AUG|PUBLISHED AUG|CHECKED AUG/);
 newsroom.features[0].sources[0].publishedOn='2026-08-20';
 assert.match(render(newsroom),/PUBLISHED AUG 20, 2026/);
 newsroom.features[0].sources[0].updatedOn='2026-09-01';
 assert.match(render(newsroom),/UPDATED SEP(?:T)?\.? 1, 2026/);
});

test('empty and missing Newsroom fallback does not claim a review is underway',()=>{
 for(const data of [undefined,{...manifest.newsroom,featured:null,features:[]}]){
  const html=render(data);assert.doesNotMatch(html,/being checked|dates have been checked|being prepared/);assert.match(html,/teacher/);
 }
});
