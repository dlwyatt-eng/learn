/** Build-time copy only. Published pages have no dependency on another hub. */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const audience=process.argv[2];
if (!['equity','family'].includes(audience)) throw new Error('Use equity or family');
const pin='d7bd8c264a417820c3c1a417e1070e885853bd33';
const files={
  'content/earth-stuff-fairness.mjs':'3162adb27999d7e02c34ac503e0c12676e498085',
  'scripts/build-earth-stuff-pack.mjs':'78d717f2a767d7563587d692bb83b7bd01a77aa9',
  'scripts/review-earth-browser.py':'8749499c437ff25610fb356ef98e07e5ca7ed874'
};
const cache=resolve('tmp/earth-source');
function blobHash(bytes){return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');}
for (const [path,expected] of Object.entries(files)) {
  const dest=resolve(cache,path);
  if (existsSync(dest) && blobHash(readFileSync(dest))===expected) continue;
  const response=await fetch(`https://raw.githubusercontent.com/dlwyatt-eng/teacher-hub/${pin}/${path}`,{signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`Cannot retrieve pinned Earth source: ${path} (${response.status})`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if (blobHash(bytes)!==expected) throw new Error(`Earth source checksum mismatch: ${path}`);
  mkdirSync(dirname(dest),{recursive:true});
  writeFileSync(dest,bytes);
}
execFileSync(process.execPath,[resolve(cache,'scripts/build-earth-stuff-pack.mjs'),audience],{stdio:'inherit'});
const releasePath=resolve('public/earth-stuff-fairness/release.json');
const release=JSON.parse(readFileSync(releasePath,'utf8'));
writeFileSync(releasePath,JSON.stringify({...release,sourceCommit:pin,sourceBlobs:files},null,2)+'\n');
