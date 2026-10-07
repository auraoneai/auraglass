#!/usr/bin/env node
/* plat:gate:change-class (§2.3, contract §14). Classifies the branch's diff:
   C-B when it touches a frozen contract surface (contract files, ENTRIES-listed
   sources, deprecations, ownership) and requires the `!` + BREAKING trailer rules;
   C-A otherwise. Fails on a C-B diff whose commit messages lack the trailer. */
import { execSync } from 'node:child_process';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const base = arg('base') ?? `origin/${process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME ?? 'next'}`;
const line = arg('line') ?? process.env.AG_LINE ?? '5x';

const files = execSync(`git diff --name-only --diff-filter=ACMRD ${base}...HEAD`, { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);
const BREAKING = [
  /^src\/contracts\//, /^contracts\//, /^build\/exports\.manifest\.json$/,
  /^deprecations\.json$/, /^src\/index\.ts$/, /^src\/root\//, /^src\/compat\//,
];
const breaking = files.filter((f) => BREAKING.some((re) => re.test(f)));
if (!breaking.length) { console.log('change-class C-A'); process.exit(0); }

const log = execSync(`git log --format=%B ${base}...HEAD`, { encoding: 'utf8' });
const hasBang = /^\w+(\([^)]*\))?!:/m.test(log);
const hasTrailer = /^BREAKING CHANGE:/m.test(log) || /!:\s/.test(log);
// On the 4.x line `!` is forbidden — a C-B diff there must be a contract exception.
if (line === '4x' && hasBang) {
  console.error('change-class FAIL: `!` is never allowed on release/4.x (§14)');
  process.exit(1);
}
if (line === '5x' && !(hasBang || hasTrailer)) {
  console.error(`change-class FAIL: C-B diff touches contract surfaces without a '!'/` +
    `'BREAKING CHANGE:' trailer:\n${breaking.join('\n')}`);
  process.exit(1);
}
console.log(`change-class C-B (${breaking.length} contract-surface files)`);
