import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { moduleLoader } from "./helpers/load-rendered-module.mjs";

const root = path.resolve(import.meta.dirname, "..");
const loadData = moduleLoader(root);
const manifest = loadData("app/generated/public-window-v2.json");
const selection = loadData("app/public-window-selection.mjs");
const escape = text => renderToStaticMarkup(React.createElement("span", null, text)).slice(6, -7);
const image = ({ priority, fill, unoptimized, ...props }) => React.createElement("img", props);
const link = ({ children, ...props }) => React.createElement("a", props, children);

for (const [label, date] of [["Discovery", "2026-09-09"], ["first class week", "2026-09-16"]]) {
  test(label + " actually renders plain student and family copy from the current projection", () => {
    const load = moduleLoader(root, {
      "next/image": image, "next/link": link,
      "./public-window-selection.mjs": { ...selection, vancouverDateKey: () => date },
    });
    const Portal = load("app/classroom-portal.tsx").default;
    const current = selection.selectPublicWindow(manifest.windows, date);
    assert.ok(current);
    for (const route of ["home", "students", "families"]) {
      const html = renderToStaticMarkup(React.createElement(Portal, { route }));
      assert.doesNotMatch(html, /substantive output|meaning-making|private handoff|private transfer|formed-class|formative evidence|labelled region|first-pass/i);
      if (route === "students") {
        for (const text of [current.student.why, current.student.finish, current.student.product, current.student.quickReference.firstMove]) assert.ok(html.includes(escape(text)), route + ": " + text);
        assert.match(html, /without.*reason|without explaining why/);
        assert.match(html, /catch-up/);
        assert.match(html, /not.*uploaded|Do not upload/);
      }
      if (route === "families") {
        assert.ok(html.includes(escape(current.family.product)));
        assert.match(html, /How I Learn Best page is never copied for display/);
      }
    }
  });
}

test("opening sharing never permits originals or the learning-support page to be displayed", () => {
  const discovery = selection.selectPublicWindow(manifest.windows, "2026-09-09");
  const studentCopy = JSON.stringify(discovery.student);
  const familyCopy = JSON.stringify(discovery.family);
  for (const copy of [studentCopy, familyCopy]) {
    assert.match(copy, /original.*private/i);
    assert.match(copy, /safe part.*separate|separate.*safe part/);
    assert.match(copy, /permission again|ask.*again/);
    assert.match(copy, /How I Learn Best page is never copied for display/);
  }
  assert.equal(discovery.shared.learningArc.length, 5);
  assert.match(discovery.student.duration, /45.*60.*75/);
});
