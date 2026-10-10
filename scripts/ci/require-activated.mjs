#!/usr/bin/env node
/* REQ-FIN-22 (REQ-PLAT-05/39/51): fail-closed release gates. Runs as the first
   script line of plat:package:pack on release scope:
     node scripts/ci/require-activated.mjs --line $AG_LINE
   On any tag pipeline (release scope / CI_COMMIT_TAG set) every release gate —
   plat:gate:glass-quality, plat:integration:{next,vite}, plat:gate:change-class —
   must have effective allow_failure !== true; a bypass exits 1. Non-tag
   pipelines pass (allow_failure is still being lifted by activation.json). */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const root = arg('root') ?? '.';
const line = arg('line');
if (!line) {
  console.error('usage: require-activated.mjs --line <4x|5x> [--root <dir>]');
  process.exit(2);
}

const isTag = Boolean(process.env.CI_COMMIT_TAG) || process.env.AG_SCOPE === 'release';
if (!isTag) {
  console.log('require-activated: non-tag pipeline — nothing to enforce');
  process.exit(0);
}

const GATES = [
  'plat:gate:glass-quality',
  'plat:integration:next',
  'plat:integration:vite',
  'plat:gate:change-class',
];

const ciPath = join(root, 'ci/plat.gitlab-ci.yml');
if (!existsSync(ciPath)) {
  console.error('require-activated: ci/plat.gitlab-ci.yml not found');
  process.exit(1);
}
const doc = yaml.parse(readFileSync(ciPath, 'utf8')) ?? {};

const bad = [];
for (const job of GATES) {
  const def = doc[job];
  if (!def) {
    bad.push(`${job}: job not defined`);
    continue;
  }
  // Effective allow_failure on a tag pipeline: job-level allow_failure unless a
  // matching rule overrides it. Rules evaluate top-down; a $CI_COMMIT_TAG rule
  // with allow_failure:false satisfies the contract even when the job default
  // is true on other scopes.
  let effective = def.allow_failure === true;
  for (const r of Array.isArray(def.rules) ? def.rules : []) {
    const cond = String(r?.if ?? '');
    if (/\$CI_COMMIT_TAG/.test(cond) && r.allow_failure === false) {
      effective = false;
      break;
    }
  }
  if (effective !== false) bad.push(`${job}: effective allow_failure ≠ false on tag pipelines`);
}

if (bad.length) {
  console.error(
    `require-activated: FAIL on tag pipeline — gates must not be bypassable:\n  ${bad.join('\n  ')}`,
  );
  process.exit(1);
}
console.log(`require-activated: ${GATES.length} gates enforced on line ${line}`);
