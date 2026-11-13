import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { moduleLoader } from './helpers/load-rendered-module.mjs';

const root = path.resolve(import.meta.dirname, '..');
const Link = moduleLoader(root)('pages/next-link.tsx').default;

function browser(hash, run) {
  const priorWindow = globalThis.window;
  const priorDocument = globalThis.document;
  const frames = [];
  const observed = [];
  const attrs = new Map();
  const target = {
    hasAttribute: key => attrs.has(key),
    setAttribute: (key, value) => attrs.set(key, value),
    focus: options => observed.push(['focus', options]),
    scrollIntoView: options => observed.push(['scroll', options]),
  };
  globalThis.window = { location: { hash }, requestAnimationFrame: callback => frames.push(callback) };
  globalThis.document = { getElementById: id => { observed.push(['destination', id]); return target; } };
  try {
    run({ frames, observed, attrs });
  } finally {
    if (priorWindow === undefined) delete globalThis.window; else globalThis.window = priorWindow;
    if (priorDocument === undefined) delete globalThis.document; else globalThis.document = priorDocument;
  }
}

function click(overrides = {}) {
  return { button: 0, defaultPrevented: false, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
    preventDefault() { this.defaultPrevented = true; }, ...overrides };
}
function finishFrames(frames) { while (frames.length) frames.shift()(); }

test('repeated section activation moves keyboard focus and reading position every time', () => {
  browser('#/learning?anchor=subject-now-title', ({ frames, observed, attrs }) => {
    const link = Link({ href: '/learning#subject-now-title' });
    for (let count = 0; count < 2; count++) {
      const event = click();
      link.props.onClick(event);
      assert.equal(event.defaultPrevented, true);
      finishFrames(frames);
    }
    assert.equal(attrs.get('tabindex'), '-1');
    assert.equal(observed.filter(([action, id]) => action === 'destination' && id === 'subject-now-title').length, 2);
    assert.equal(observed.filter(([action]) => action === 'focus').length, 2);
    assert.equal(observed.filter(([action]) => action === 'scroll').length, 2);
    assert.deepEqual(observed[1], ['focus', { preventScroll: true }]);
    assert.deepEqual(observed[2], ['scroll', { block: 'start', behavior: 'auto' }]);
  });
});

test('repeating a current page link returns to main without changing browser history', () => {
  browser('#/students', ({ frames, observed }) => {
    Link({ href: '/students' }).props.onClick(click());
    finishFrames(frames);
    assert.deepEqual(observed[0], ['destination', 'public-main']);
    assert.equal(window.location.hash, '#/students');
  });
});

test('new routes and external links retain native navigation', () => {
  browser('#/students', ({ frames }) => {
    for (const href of ['/learning#subject-now-title', '/homework', 'https://ca.spacesedu.com/']) {
      const event = click();
      Link({ href }).props.onClick(event);
      assert.equal(event.defaultPrevented, false);
    }
    assert.equal(frames.length, 0);
  });
});

test('modifier clicks, downloads, new tabs and cancelled handlers are not intercepted', () => {
  browser('#/students', ({ frames }) => {
    for (const override of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
      const event = click(override);
      Link({ href: '/students' }).props.onClick(event);
      assert.equal(event.defaultPrevented, false);
    }
    for (const extra of [{ target: '_blank' }, { download: '' }]) {
      const event = click();
      Link({ href: '/students', ...extra }).props.onClick(event);
      assert.equal(event.defaultPrevented, false);
    }
    let called = false;
    Link({ href: '/students', onClick: event => { called = true; event.preventDefault(); } }).props.onClick(click());
    assert.equal(called, true);
    assert.equal(frames.length, 0);
  });
});
