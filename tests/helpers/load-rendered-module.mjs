import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";

// Render production TSX in Node; only explicitly listed non-content adapters are mocked.
export function moduleLoader(root, mocks = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(root, file);
    const resolved = [absolute, ...[".ts", ".tsx", ".mjs", ".js", ".json"].map(ext => absolute + ext)].find(existsSync);
    if (!resolved) throw new Error("Missing test dependency " + absolute);
    if (cache.has(resolved)) return cache.get(resolved).exports;
    if (resolved.endsWith(".json")) return JSON.parse(readFileSync(resolved, "utf8"));
    const module = { exports: {} };
    cache.set(resolved, module);
    const compiled = ts.transpileModule(readFileSync(resolved, "utf8"), {
      fileName: resolved.replace(/\.mjs$/, ".ts"),
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, allowJs: true },
    }).outputText;
    const localRequire = createRequire(resolved);
    const require = specifier => Object.hasOwn(mocks, specifier) ? mocks[specifier]
      : specifier.endsWith(".css") ? {}
      : specifier.startsWith(".") ? load(path.resolve(path.dirname(resolved), specifier))
      : localRequire(specifier);
    new Function("require", "module", "exports", compiled)(require, module, module.exports);
    return module.exports;
  }
  return load;
}
