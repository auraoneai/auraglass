#!/usr/bin/env node
/* plat:publish:npm step 2 (§4.13.7, REQ-PLAT-11/14). Publishes the verified
   tarballs from .artifacts/pack/ with
     npm publish <tgz> --provenance --access public --tag <derived>

   Every check runs before the first publish, so a failure never leaves a
   half-published release:
   - the package set comes from contracts/packages.json (published: true; the
     scoped name or its recorded unscoped fallback, OD-2); a tarball for any other
     package fails;
   - .artifacts/plat/pack-record.json (written by scripts/release/pack.mjs in
     plat:package:pack) is required, every tarball needs an entry, and the entry's
     file name and sha512 must equal the tarball on disk;
   - aura-glass's tarball version must equal the tag;
   - the dist-tag comes from dist-tag.mjs distTagFor (GA = a stable 5.x holds
     aura-glass 'latest'); the move must be semver-forward for that package's
     current holder of the tag unless AG_ROLLBACK_LATEST_TO_4X=true (protected,
     release-owner-set) and the publish is 4.x onto 'latest';
   - a name@version already on the registry is skipped (idempotent re-runs).
   After publishing, `npm view <pkg> dist-tags --json` must show the derived tag
   on the version, for skipped packages too.

     node scripts/release/publish.mjs --tag vX.Y.Z --line 4x|5x [--v4-dist-tag v4-lts]
          [--dir .artifacts/pack] [--record .artifacts/plat/pack-record.json] */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { distTagFor, isGaFromDistTags, monotonicViolation, parseSemver } from './dist-tag.mjs';

const argv = process.argv.slice(2);
const arg = (n) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : null;
};
const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
const line = arg('line') ?? process.env.AG_LINE ?? '5x';
const v4DistTag = arg('v4-dist-tag') ?? process.env.AG_V4_DIST_TAG ?? 'latest';
const dir = arg('dir') ?? '.artifacts/pack';
const recordPath = arg('record') ?? '.artifacts/plat/pack-record.json';
const contractPath = 'contracts/packages.json';
const rollbackOk = process.env.AG_ROLLBACK_LATEST_TO_4X === 'true';

const fail = (msg) => {
  console.error(`publish FAIL: ${msg}`);
  process.exit(1);
};

// npm read that distinguishes "not on the registry" (E404 -> null) from any other
// failure (network, auth), which must fail closed.
function npmRead(args) {
  const r = spawnSync('npm', args, { encoding: 'utf8' });
  if (r.status === 0) return r.stdout.trim();
  const err = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  if (/E404|404 Not Found|is not in this registry/i.test(err)) return null;
  fail(`npm ${args.join(' ')} failed: ${err.trim().split('\n').pop() || `exit ${r.status}`}`);
  return null;
}
const distTagsOf = (name) => {
  const out = npmRead(['view', name, 'dist-tags', '--json']);
  return out ? JSON.parse(out) : {};
};

const sha512 = (f) => 'sha512-' + createHash('sha512').update(readFileSync(f)).digest('base64');
const manifestOf = (file) => {
  try {
    return JSON.parse(execFileSync('tar', ['-xzOf', file, 'package/package.json'], { encoding: 'utf8' }));
  } catch (e) {
    fail(`cannot read package/package.json from ${file}: ${e.message}`);
    return null;
  }
};

if (!/^v\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/.test(tag)) fail(`'${tag}' is not a release tag`);
const tagVersion = tag.replace(/^v/, '');

// 1. package set (contracts/packages.json)
if (!existsSync(contractPath)) fail(`${contractPath} missing — the package set is defined there`);
const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
const allowed = new Map();
for (const [name, p] of Object.entries(contract.packages ?? {})) {
  if (p?.published !== true) continue;
  allowed.set(name, name);
  if (p.fallback) allowed.set(p.fallback, name);
}
if (!allowed.size) fail(`${contractPath} lists no published package`);

// 2. pack record
if (!existsSync(recordPath)) fail(`${recordPath} missing — run plat:package:pack (scripts/release/pack.mjs) first`);
const record = JSON.parse(readFileSync(recordPath, 'utf8'));
const recPkgs = record?.packages;
if (!recPkgs || typeof recPkgs !== 'object' || !Object.keys(recPkgs).length) {
  fail(`${recordPath} has no packages`);
}

// 3. tarballs
if (!existsSync(dir)) fail(`${dir}/ missing`);
const tarballs = readdirSync(dir).filter((f) => f.endsWith('.tgz')).sort();
if (!tarballs.length) fail(`no tarballs under ${dir}/`);

const plan = [];
for (const tgz of tarballs) {
  const file = join(dir, tgz);
  const { name, version } = manifestOf(file);
  if (!allowed.has(name)) fail(`${name} (${tgz}) is not a published package in ${contractPath}`);
  const rec = recPkgs[name];
  if (!rec) fail(`${name} (${tgz}) has no entry in ${recordPath}`);
  if (rec.file !== tgz) fail(`${name}: pack-record file ${rec.file} != ${tgz}`);
  if (rec.version !== version) fail(`${name}: pack-record version ${rec.version} != tarball ${version}`);
  const got = sha512(file);
  if (rec.integrity !== got) fail(`${name}: sha512 mismatch — pack-record ${rec.integrity} != tarball ${got}`);
  if (allowed.get(name) === 'aura-glass' && version !== tagVersion) {
    fail(`aura-glass tarball version ${version} != tag ${tagVersion}`);
  }
  plan.push({ tgz, file, name, version });
}
for (const name of Object.keys(recPkgs)) {
  if (!plan.some((p) => p.name === name)) fail(`pack-record lists ${name} but ${dir}/ has no tarball for it`);
}

// 4. dist-tags + monotonic guard (all before publishing anything)
const rootName = plan.find((p) => allowed.get(p.name) === 'aura-glass')?.name ?? 'aura-glass';
const ga = isGaFromDistTags(distTagsOf(rootName));
for (const p of plan) {
  // The 4.x/5.x policy is aura-glass's; the satellite packages (0.x or 5.x
  // pre-releases) publish pre-releases on 'next' and stables on 'latest'.
  p.distTag =
    allowed.get(p.name) === 'aura-glass'
      ? distTagFor(p.version, { v4DistTag, ga, rollback: rollbackOk })
      : parseSemver(p.version)?.pre.length
        ? 'next'
        : 'latest';
  p.before = distTagsOf(p.name);
  const v = monotonicViolation(p.distTag, p.version, p.before[p.distTag], { rollbackOk });
  if (v && p.before[p.distTag] !== p.version) fail(`${p.name}: ${v}`);
  p.exists = npmRead(['view', `${p.name}@${p.version}`, 'version']) === p.version;
}
console.log(`publish: ${tag} line ${line}, GA=${ga}, ${plan.length} tarball(s) verified against ${recordPath}`);

// 5. publish
for (const p of plan) {
  if (p.exists) {
    console.log(`publish: ${p.name}@${p.version} already on the registry — skipping`);
    continue;
  }
  execFileSync('npm', ['publish', p.file, '--provenance', '--access', 'public', '--tag', p.distTag], {
    stdio: 'inherit',
  });
  console.log(`publish: ${p.name}@${p.version} -> ${p.distTag}`);
}

// 6. post-publish dist-tag assertion
for (const p of plan) {
  const after = distTagsOf(p.name);
  if (after[p.distTag] !== p.version) {
    fail(`post-publish ${p.name}: dist-tag '${p.distTag}' is ${after[p.distTag] ?? 'unset'}, want ${p.version}`);
  }
}
console.log('publish: dist-tags verified');
