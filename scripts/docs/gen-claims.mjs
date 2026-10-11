#!/usr/bin/env node
// gen-claims.mjs — PLAT-389. Resolve every claim id from release artifacts
// into apps/docs/generated/claims.json:
//   { id: { value, unit, source: { artifact, sha, path } } }
// sha != the build SHA fails the whole run. Missing cross-stream artifacts
// render the claim 'pending' (fails only on the v5.x.y tag build, G-14);
// missing PLAT-owned artifacts always fail.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTIFACTS, CLAIMS_PATH } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLAT_OWNED = new Set(['packEnv', 'quickstartTiming', 'sizeMetafiles', 'registryReport']);

const read = (rel) => { const p = join(ROOT, rel); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
const json = (rel) => { const s = read(rel); return s ? JSON.parse(s) : null; };
const dig = (o, path) => path.split('.').reduce((a, k) => a?.[k], o);

/* Claim table: id → which artifact + path supplies the value. */
export const CLAIM_SOURCES = {
  'flagship-count': { artifact: 'subjects', path: 'flagships.length', unit: 'components' },
  'component-count': { artifact: 'subjects', path: 'subjects.length', unit: 'components' },
  'root-value-exports': { artifact: 'registryReport', path: 'rootExports', unit: 'exports' },
  'button-gzip-kb': { artifact: 'sizeMetafiles', path: 'button.gzipKb', unit: 'KB' },
  'styles-css-gzip-kb': { artifact: 'sizeMetafiles', path: 'stylesCss.gzipKb', unit: 'KB' },
  'tarball-mb': { artifact: 'packEnv', path: 'TARBALL_MB', unit: 'MB' },
  'contrast-min-regular': { artifact: 'perfReport', path: 'contrast.minRegular', unit: ':1' },
  'contrast-min-large': { artifact: 'perfReport', path: 'contrast.minLarge', unit: ':1' },
  'glass-recipes': { artifact: 'perfReport', path: 'glass.independentRecipes', unit: 'recipes' },
  'quickstart-seconds-next': { artifact: 'quickstartTiming', path: 'quickstart-seconds-next.value', unit: 's' },
  'quickstart-seconds-vite': { artifact: 'quickstartTiming', path: 'quickstart-seconds-vite.value', unit: 's' },
  'registry-block-count': { artifact: 'registryReport', path: 'published.blocks', unit: 'blocks' },
  'codemod-transform-count': { artifact: 'releaseVerdict', path: 'codemods.transforms', unit: 'transforms' },
  'pixel-gates-passed': { artifact: 'releaseVerdict', path: 'pixelGates.passed', unit: 'gates' },
};

export function generate({ root = ROOT, sha = process.env.GITHUB_SHA ?? 'local', isTag = /^\d+\.\d+\.\d+$/.test(process.env.REF_NAME ?? '') } = {}) {
  const claims = {}; const errors = [];
  for (const [id, src] of Object.entries(CLAIM_SOURCES)) {
    const artifact = ARTIFACTS[src.artifact];
    /* env-style artifacts are KEY=VALUE text; JSON for the rest */
    const raw = read(artifact);
    let value = null;
    if (raw != null) {
      const data = src.artifact === 'packEnv' ? Object.fromEntries(raw.split('\n').filter(Boolean).map((l) => l.split('='))) : JSON.parse(raw);
      /* sha custody: artifacts that carry a sha must match the build sha */
      if (data?.sha && sha !== 'local' && data.sha !== sha) { errors.push(`${id}: artifact sha ${data.sha} != build ${sha}`); continue; }
      value = dig(data, src.path) ?? null;
    }
    if (value == null) {
      claims[id] = { value: null, unit: src.unit, source: { artifact, sha, path: src.path }, state: 'pending' };
      if (PLAT_OWNED.has(src.artifact)) errors.push(`${id}: PLAT artifact ${artifact} missing`);
      else if (isTag) errors.push(`${id}: pending on a v-tag build (G-14)`);
    } else {
      claims[id] = { value, unit: src.unit, source: { artifact, sha, path: src.path } };
    }
  }
  const dest = join(root, CLAIMS_PATH);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify({ generated: new Date().toISOString(), sha, claims }, null, 2) + '\n');
  return { claims, errors };
}

export function main() {
  const { claims, errors } = generate();
  const pending = Object.values(claims).filter((c) => c.state === 'pending').length;
  console.log(`claims: ${Object.keys(claims).length} ids, ${pending} pending, ${errors.length} errors`);
  if (errors.length) { errors.forEach((e) => console.error(`  FAIL ${e}`)); process.exit(1); }
}
if (process.argv[1]?.endsWith('gen-claims.mjs')) main();
