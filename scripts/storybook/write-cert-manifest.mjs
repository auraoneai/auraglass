#!/usr/bin/env node
/* REQ-QUAL-01 (QUAL). Writes storybook-static/cert-manifest.json (REPORTS.subjects, the S-55
   SubjectIndex) from storybook-static/index.json and each story's parameters.ag, then re-reads the
   written file and cross-checks it against index.json for kinds lab/scene/showcase/matrix.
   Exit 1 on any unresolved/ambiguous subject, malformed parameters.ag, index/manifest mismatch,
   new offender, stale or expired baseline row.

   Runs in qual:build:storybook right after `storybook build` (ci/qual.gitlab-ci.yml).
   Needs Node type stripping (Node >= 22.18, or --experimental-strip-types on 22.6+).

   Usage: node --experimental-strip-types scripts/storybook/write-cert-manifest.mjs
            [--dir storybook-static] [--root .] [--baseline packages/qa/baselines/cert-manifest.json]
            [--print-baseline]   print the baseline rows the current problems need (owner from
                                 contracts/ownership.json) and exit without writing */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildCertManifest, CERT_MANIFEST_BASELINE, repoSourceReader } from '../../packages/qa/src/resolve/certManifest.ts';
import { loadSubjectUniverse, parseSubjectIndex, verifyManifestAgainstIndex } from '../../packages/qa/src/resolve/resolveSubject.ts';
import { readBaseline } from '../../packages/qa/src/evidence/expiringBaseline.ts';
import { loadOwnerOf } from '../../packages/qa/src/evidence/ownership.ts';
import { reqFinFor } from '../../packages/qa/src/evidence/attribution.ts';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const root = resolve(opt('root', '.'));
const dir = resolve(root, opt('dir', 'storybook-static'));
const baselinePath = resolve(root, opt('baseline', CERT_MANIFEST_BASELINE));

const sbIndex = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'));
const universe = loadSubjectUniverse(root);

if (args.includes('--print-baseline')) {
  const ownerOf = loadOwnerOf(root);
  const { problems } = buildCertManifest(sbIndex, universe, repoSourceReader(root), { collectOnly: true });
  const rows = new Map();
  for (const p of problems) {
    const owner = ownerOf(p.file);
    rows.set(`${p.file}|${p.code}|${p.subject}`, { file: p.file, owner, reqFin: reqFinFor(owner, p.file), expires: 'RC-1', code: p.code, subject: p.subject });
  }
  process.stdout.write(`${JSON.stringify([...rows.values()].sort((a, b) => a.file.localeCompare(b.file) || a.code.localeCompare(b.code)), null, 2)}\n`);
  process.exit(0);
}

let result;
try {
  result = buildCertManifest(sbIndex, universe, repoSourceReader(root), { baseline: readBaseline(baselinePath), scope: process.env.AG_SCOPE });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
const out = join(dir, 'cert-manifest.json');
writeFileSync(out, `${JSON.stringify(result.index, null, 2)}\n`);
// Re-read what was written: the artifact itself must match index.json.
try {
  verifyManifestAgainstIndex(parseSubjectIndex(JSON.parse(readFileSync(out, 'utf8')), out), {
    ...sbIndex,
    entries: Object.fromEntries(Object.entries(sbIndex.entries).filter(([, e]) => !result.baselined.some((p) => p.storyId === e.id))),
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
console.log(`cert-manifest: ${result.index.stories.length} stories written to ${out}; `
  + `${result.unannotated.length} without parameters.ag; ${result.baselined.length} baselined (${baselinePath.replace(`${root}/`, '')})`);
