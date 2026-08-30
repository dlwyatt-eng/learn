import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../pages-dist/", import.meta.url));
const base = "/learn";
const publicRoots = ["images", "downloads", "printables", "icons"];

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  }))).flat();
}

for (const file of await files(root)) {
  if (!/\.(?:html|css|js)$/.test(file)) continue;
  let content = await readFile(file, "utf8");
  for (const folder of publicRoots) {
    content = content.replaceAll(`/${folder}/`, `${base}/${folder}/`);
    content = content.replaceAll(`${base}${base}/${folder}/`, `${base}/${folder}/`);
  }
  content = content.replaceAll('href="/favicon.svg"', `href="${base}/favicon.svg"`);
  await writeFile(file, content);
}
