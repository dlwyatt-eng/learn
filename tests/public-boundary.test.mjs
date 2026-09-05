import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(path.join(root, "app/generated/public-window-v2.json"), "utf8"));
const portal = await readFile(path.join(root, "app/classroom-portal.tsx"), "utf8");
const linkAdapter = await readFile(path.join(root, "pages/next-link.tsx"), "utf8");
const router = await readFile(path.join(root, "pages/main.tsx"), "utf8");
const styles = await readFile(path.join(root, "app/classroom-portal-v2.css"), "utf8");
const workflow = await readFile(path.join(root, ".github/workflows/pages.yml"), "utf8");
const exactWindowKeys = ["id", "effectiveFrom", "effectiveTo", "state", "shared", "student", "family"];
const forbiddenPublicKeys = new Set(["teacher", "source", "deliveryRoutes", "toolActivityIds"]);

function forbiddenPaths(value, currentPath = "$") {
  if (Array.isArray(value)) return value.flatMap((item, index) => forbiddenPaths(item, `${currentPath}[${index}]`));
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => {
    const itemPath = `${currentPath}.${key}`;
    return [...(forbiddenPublicKeys.has(key) ? [itemPath] : []), ...forbiddenPaths(item, itemPath)];
  });
}

test("public windows use the exact safe schema", () => {
  assert.equal(manifest.schemaVersion, "classroom-os-public-window/v2");
  assert.equal(manifest.windows.length, 5);
  for (const window of manifest.windows) {
    assert.deepEqual(Object.keys(window), exactWindowKeys);
  }
});

test("private window fields are forbidden recursively", () => {
  assert.deepEqual(forbiddenPaths(manifest), [], "The public manifest contains private field names at the reported JSON paths.");
});

test("public checksum is current", () => {
  const body = { ...manifest };
  delete body.checksum;
  const actual = `sha256:${createHash("sha256").update(`${JSON.stringify(body, null, 2)}\n`).digest("hex")}`;
  assert.equal(manifest.checksum, actual);
});

test("Discovery is the opening window and has its complete public route", () => {
  assert.match(manifest.window.shared.title, /Discovery Rotations/);
  assert.equal(manifest.window.shared.learningArc.length, 5);
  assert.match(manifest.window.shared.primaryResource.href, /Grade_6_Discovery_Booklet\.pdf$/);
  assert.match(portal, /isDiscoveryWindow/);
  const legacyIdChecks = portal.match(/current\.id === "september-opening"/g) ?? [];
  assert.equal(legacyIdChecks.length, 1, "The reused opening ID must be gated in one narrowly named legacy-AI detector only.");
  assert.match(portal, /isLegacyAiOpeningWindow = current\.id === "september-opening" && \/technology/);
});

test("route-plus-anchor links retain both the route and destination", () => {
  assert.match(linkAdapter, /anchor=/);
  assert.match(router, /anchorFromHash/);
  assert.match(router, /scrollIntoView/);
});

test("hash routing manages skip focus, route focus, titles, and announcements", () => {
  assert.match(portal, /href="#public-main" onClick=\{skipToMain\}/);
  assert.match(portal, /event\.preventDefault\(\)/);
  assert.match(router, /const routeLabels:/);
  assert.match(router, /document\.title =/);
  assert.match(router, /target\.focus\(\{ preventScroll: true \}\)/);
  assert.match(router, /update\(\);/);
  assert.match(router, /aria-live="polite"/);
  assert.match(router, /aria-atomic="true"/);
});

test("large text persists, materially enlarges reading text, and print is supported", () => {
  assert.match(portal, /wyatt-large-text-v1/);
  assert.match(portal, /localStorage\.getItem/);
  assert.match(portal, /localStorage\.setItem/);
  assert.match(portal, /aria-pressed=\{largeText\}/);
  assert.match(portal, /large-text-mode/);
  assert.match(styles, /\.portal-v2\.large-text-mode/);
  assert.match(styles, /18px/);
  assert.match(styles, /@media print/);
});

test("the current public window renders its purpose, finish, and products", () => {
  assert.match(portal, /\{current\.student\.why\}/);
  assert.match(portal, /\{current\.student\.finish\}/);
  assert.match(portal, /\{current\.student\.product\}/);
  assert.match(portal, /\{current\.family\.product\}/);
  assert.doesNotMatch(portal, /<small>FINISH<\/small><strong>\{current\.student\.product\}/);
});

test("the learning panorama alternative describes only visible actions", () => {
  const mosaic = portal.match(/<figure className="learning-mosaic">[\s\S]*?<\/figure>/)?.[0];
  assert.ok(mosaic);
  assert.match(mosaic, /alt="Fictional classroom panorama of Grade 6 students observing an object and photograph, discussing ideas, building a model, moving, and reading together"/);
  assert.doesNotMatch(mosaic, /analyzing a map|using a shared projector|SHARED-SCREEN INQUIRY/);
});

test("the Pages workflow runs the repository quality gate", () => {
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /run: git diff --check/);
  assert.doesNotMatch(workflow, /npx vite build/);
});
