import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "pages-dist");
const manifest = JSON.parse(await readFile(path.join(root, "app/generated/public-window-v2.json"), "utf8"));
const html = await readFile(path.join(output, "index.html"), "utf8");

assert.match(html, /\/learn\/assets\//, "The production bundle is missing the /learn/ GitHub Pages base.");
assert.match(html, /<html lang="en">/, "The production page must declare its language.");
assert.match(html, /<div id="root"><\/div>/, "The production page is missing its application root.");

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  }))).flat();
}

const emittedFiles = await files(output);
const textFiles = emittedFiles.filter(file => /\.(?:html|css|js)$/.test(file));
const emittedReferences = new Set();
const unbasedAsset = /(^|["'`(=:\s])\/(?:images|printables|downloads|icons)\//m;
const basedAsset = /\/learn\/(?:assets|images|printables|downloads|icons)\/[A-Za-z0-9@%_+.~/-]+/g;

for (const file of textFiles) {
  const content = await readFile(file, "utf8");
  const label = path.relative(output, file);
  assert.doesNotMatch(content, unbasedAsset, `${label} contains a public asset that escaped the /learn/ base rewrite.`);
  assert.doesNotMatch(content, /\/learn\/learn\//, `${label} contains a doubled /learn/ base.`);
  for (const reference of content.match(basedAsset) ?? []) emittedReferences.add(reference.slice("/learn/".length));
}

if (/href="\.\/favicon\.svg"/.test(html)) emittedReferences.add("favicon.svg");
assert.ok([...emittedReferences].some(reference => reference.startsWith("assets/") && reference.endsWith(".js")), "The page does not reference an emitted JavaScript bundle.");
assert.ok([...emittedReferences].some(reference => reference.startsWith("assets/") && reference.endsWith(".css")), "The page does not reference an emitted stylesheet.");

const localPaths = new Set();
const collect = (value) => {
  if (Array.isArray(value)) return value.forEach(collect);
  if (!value || typeof value !== "object") return;
  for (const item of Object.values(value)) {
    if (typeof item === "string" && /^\/(?:images|printables|downloads)\//.test(item)) localPaths.add(item);
    else collect(item);
  }
};
collect(manifest);

for (const publicPath of localPaths) emittedReferences.add(publicPath.slice(1));

for (const reference of emittedReferences) {
  const decoded = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  const target = path.resolve(output, decoded);
  assert.ok(target.startsWith(`${output}${path.sep}`), `Artifact reference escapes the output directory: ${reference}`);
  const info = await stat(target);
  assert.ok(info.isFile() && info.size > 0, `Artifact reference is missing or empty: ${reference}`);

  if (target.endsWith(".pdf")) {
    const signature = (await readFile(target)).subarray(0, 5).toString("ascii");
    assert.equal(signature, "%PDF-", `PDF artifact has an invalid signature: ${reference}`);
  }
  if (target.endsWith(".webp")) {
    const signature = await readFile(target);
    assert.equal(signature.subarray(0, 4).toString("ascii"), "RIFF", `WebP artifact has an invalid RIFF signature: ${reference}`);
    assert.equal(signature.subarray(8, 12).toString("ascii"), "WEBP", `WebP artifact has an invalid WEBP signature: ${reference}`);
  }
  if (target.endsWith(".png")) {
    const signature = (await readFile(target)).subarray(0, 8).toString("hex");
    assert.equal(signature, "89504e470d0a1a0a", `PNG artifact has an invalid signature: ${reference}`);
  }
}

console.log(`Validated Learn Hub artifact, ${textFiles.length} emitted text files, and ${emittedReferences.size} referenced files.`);
