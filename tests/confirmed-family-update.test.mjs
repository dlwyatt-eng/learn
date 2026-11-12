import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('app/generated/public-window-v2.json','utf8'));
test('confirmed invitation and Friday priorities preserve optional home practice', () => {
  assert.equal(manifest.classroomWelcome.spaces.status,'invited');
  assert.match(manifest.classroomWelcome.spaces.message,/invitations have been sent/);
  assert.match(manifest.classroomWelcome.spaces.message,/junk or spam/);
  assert.match(manifest.classroomWelcome.later,/finishing first-term work/);
  assert.doesNotMatch(manifest.classroomWelcome.later,/Friday’s art/);
  assert.match(JSON.stringify(manifest.homePractice),/not new assignments/);
});
test('family access notice remains visible after invitations are sent', () => {
  const source=readFileSync('app/classroom-portal.tsx','utf8');
  const component=source.split('function SpacesStatus(')[1].split('function HomePage')[0];
  assert.doesNotMatch(component,/if \(!spacesPending\) return null/);
  assert.match(component,/welcome.spaces.message/);
});
