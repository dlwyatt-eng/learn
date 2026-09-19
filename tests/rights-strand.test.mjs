import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { moduleLoader } from './helpers/load-rendered-module.mjs';

const load=moduleLoader(path.resolve(import.meta.dirname,'..'));
const RightsStrand=load('app/rights-strand.tsx').default;
test('student rights entry contains the inquiry and milestones without adult legal case guidance',()=>{
  const html=renderToStaticMarkup(React.createElement(RightsStrand));
  assert.match(html,/Open four teaching screens/);
  assert.match(html,/Friday, November 20, 2026/);
  assert.match(html,/Thursday, December 10, 2026/);
  assert.doesNotMatch(html,/Criminal law:|Respond without putting children on trial/);
});
test('adult background renders separately while the printable includes only the case and response prompts',()=>{
  const html=renderToStaticMarkup(React.createElement(RightsStrand,{adult:true}));
  assert.match(html,/Section 319/);
  const printable=html.split('<section class="rights-print">')[1].split('</section>')[0];
  assert.match(printable,/A petition about recess/);
  assert.match(printable,/What else would you need to know/);
  assert.doesNotMatch(printable,/One supported reading|Section 319|Teacher guide/);
});
