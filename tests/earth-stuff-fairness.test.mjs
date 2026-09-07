import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Earth companion publishes no teacher data or extra homework',()=>{
  const html=readFileSync('pages-dist/earth-stuff-fairness/index.html','utf8');
  assert.match(html,/Earth, Stuff & Fairness/);
  assert.match(html,/not extra homework/);
  assert.match(html,/Every family has different circumstances/);
  assert.doesNotMatch(html,/pack-data|Suggested placements|3 \+ 6 \+ 1/);
  assert.doesNotMatch(html,/<script[^>]+src=|<iframe|localStorage|fetch\(/);
  const release=JSON.parse(readFileSync('pages-dist/earth-stuff-fairness/release.json','utf8'));
  assert.equal(release.audience,'family');
  assert.equal(release.sourceCommit,'d7bd8c264a417820c3c1a417e1070e885853bd33');
});
test('Opening Now route remains unchanged by the optional entry',()=>{
  const source=readFileSync('pages/main.tsx','utf8');
  assert.match(source,/route === "students" \|\| route === "families" \|\| route === "learning"/);
  assert.doesNotMatch(source,/route === "home".*EarthFamilyEntry/);
});
