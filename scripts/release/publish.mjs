#!/usr/bin/env node
/* plat:publish:npm step 2 (§4.13.7). Publishes the verified tarballs from
   .artifacts/pack/ with `npm publish <tgz> --provenance --access public --tag <dist-tag>`,
   skipping any package version already on the registry.
   Dist-tags: v4.* -> $AG_V4_DIST_TAG; v5.*-alpha|beta|rc.* -> next; v5.x.y -> latest. */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
const line = arg('line') ?? process.env.AG_LINE ?? '5x';
const v4Tag = arg('v4-dist-tag') ?? process.env.AG_V4_DIST_TAG ?? 'latest';
const dir = '.artifacts/pack';

const distTag = line === '4x' ? v4Tag
  : /^v5\.\d+\.\d+-(alpha|beta|rc)\.\d+/.test(tag) ? 'next' : 'latest';

const tarballs = readdirSync(dir).filter((f) => f.endsWith('.tgz'));
if (!tarballs.length) { console.error(`publish: no tarballs under ${dir}/`); process.exit(1); }

for (const tgz of tarballs) {
  const file = join(dir, tgz);
  let name = tgz.replace(/\.tgz$/, ''), version = tag.replace(/^v/, '');
  try {
    const pkg = JSON.parse(execSync(`tar -xzOf ${file} package/package.json`, { encoding: 'utf8' }));
    name = pkg.name; version = pkg.version;
  } catch { /* fall back to filename/tag */ }
  let already = false;
  try {
    const v = execSync(`npm view ${name}@${version} version`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    already = v === version;
  } catch { already = false; }
  if (already) { console.log(`publish: ${name}@${version} already on registry — skipping`); continue; }
  execSync(`npm publish ${file} --provenance --access public --tag ${distTag}`, { stdio: 'inherit' });
  console.log(`publish: ${name}@${version} -> ${distTag}`);
}
