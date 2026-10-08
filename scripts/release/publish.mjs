#!/usr/bin/env node
/* plat:publish:npm step 2 (§4.13.7, REQ-PLAT-11/14/15). Publishes the verified
   tarballs from .artifacts/pack/ with `npm publish <tgz> --provenance --access
   public --tag <dist-tag>`:
   - dist-tag from scripts/release/dist-tag.mjs (v5.* -> next for prerelease,
     latest for stable; v4.* -> AG_V4_DIST_TAG policy).
   - skips name@version already on the registry (idempotent re-runs);
   - verifies each tarball's sha512 against the pack record (.artifacts/plat/pack-record.json)
     when present;
   - after publishing, asserts the registry dist-tag equals the computed tag.
   - refuses a non-monotonic 'latest' move unless AG_ROLLBACK_LATEST_TO_4X=true
     (protected variable, operator-set). */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { distTagFor } from './dist-tag.mjs';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
const line = arg('line') ?? process.env.AG_LINE ?? '5x';
const v4Tag = arg('v4-dist-tag') ?? process.env.AG_V4_DIST_TAG ?? 'latest';
const dir = '.artifacts/pack';

const npm = (a) => execFileSync('npm', a, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
const npmMayFail = (a) => {
  try {
    return npm(a).trim();
  } catch {
    return null;
  }
};

const sha512 = (f) => 'sha512-' + createHash('sha512').update(readFileSync(f)).digest('base64');
const packRecord = existsSync('.artifacts/plat/pack-record.json')
  ? JSON.parse(readFileSync('.artifacts/plat/pack-record.json', 'utf8'))
  : null;

// Determine GA state once for dist-tag policy.
const latestOnRegistry = npmMayFail(['view', 'aura-glass', 'dist-tags.latest']);
const ga5 = /^5\.\d+\.\d+$/.test(latestOnRegistry ?? '');

const tarballs = readdirSync(dir).filter((f) => f.endsWith('.tgz'));
if (!tarballs.length) {
  console.error(`publish: no tarballs under ${dir}/`);
  process.exit(1);
}

for (const tgz of tarballs) {
  const file = join(dir, tgz);
  let name = tgz.replace(/\.tgz$/, '');
  let version = tag.replace(/^v/, '');
  try {
    const pkg = JSON.parse(
      execFileSync('tar', ['-xzOf', file, 'package/package.json'], { encoding: 'utf8' }),
    );
    name = pkg.name;
    version = pkg.version;
  } catch {
    /* fall back to filename/tag */
  }

  // sha512 vs pack record
  const rec = packRecord?.[name] ?? packRecord?.[tgz] ?? null;
  if (rec?.integrity || rec?.sha512) {
    const want = rec.integrity ?? rec.sha512;
    const got = sha512(file);
    if (got !== want) {
      console.error(`publish: sha512 mismatch for ${tgz}: pack-record ${want} != actual ${got}`);
      process.exit(1);
    }
  }

  const distTag = distTagFor(version, { v4DistTag: v4Tag, ga5 });

  // non-monotonic 'latest' guard
  if (distTag === 'latest' && latestOnRegistry) {
    const cur = latestOnRegistry.replace(/^v/, '');
    const [cM] = cur.split('.').map(Number);
    const [nM] = version.split('.').map(Number);
    if (nM < cM && process.env.AG_ROLLBACK_LATEST_TO_4X !== 'true') {
      console.error(
        `publish: refusing to move 'latest' from ${cur} back to ${version} ` +
          `(set AG_ROLLBACK_LATEST_TO_4X=true as a protected variable to force)`,
      );
      process.exit(1);
    }
  }

  const onReg = npmMayFail(['view', `${name}@${version}`, 'version']);
  if (onReg === version) {
    console.log(`publish: ${name}@${version} already on registry — skipping`);
  } else {
    execFileSync('npm', ['publish', file, '--provenance', '--access', 'public', '--tag', distTag], {
      stdio: 'inherit',
    });
    console.log(`publish: ${name}@${version} -> ${distTag}`);
  }
}

// post-publish assertion: dist-tags match policy for every tarball's version
for (const tgz of tarballs) {
  let name = tgz.replace(/\.tgz$/, '');
  let version = tag.replace(/^v/, '');
  try {
    const pkg = JSON.parse(
      execFileSync('tar', ['-xzOf', join(dir, tgz), 'package/package.json'], { encoding: 'utf8' }),
    );
    name = pkg.name;
    version = pkg.version;
  } catch {}
  const want = distTagFor(version, { v4DistTag: v4Tag, ga5 });
  const tags = npmMayFail(['dist-tag', 'list', name, '--json']);
  const map = tags ? JSON.parse(tags) : {};
  const holding = Object.entries(map).find(([, v]) => v === version)?.[0];
  if (holding !== want) {
    console.error(`publish: post-publish check FAIL ${name}@${version}: tag '${holding}', want '${want}'`);
    process.exit(1);
  }
}
console.log('publish: dist-tags verified');
