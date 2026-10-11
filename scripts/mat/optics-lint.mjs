#!/usr/bin/env node
/* scripts/mat/optics-lint.mjs — REQ-MAT-39 (FIN-D D.3-03, MAT-344) optics lint ratchet.
   Runs the repo's eslint.config.js restricted to auraglass/no-optics-outside-material
   over the rule's agConfig globs (src/**, stories/**, tests/**, apps/**, minus
   tests/lint/mat/**) and compares the findings with lint/rules/mat/optics-baseline.json:
     - total findings > baseline.maxWarnings          -> exit 1 (the --max-warnings tie)
     - any file with more findings than its baseline -> exit 1 (a new file counts as 0)
   Files that drop below their baseline count are reported so the next --update lowers it.

   Usage:
     node scripts/mat/optics-lint.mjs [--root <dir>] [--baseline <json>] [--update] [--out <json>]
   --update re-records the baseline from this measurement (never hand-edit it).
   --out writes the per-file findings (CI: .artifacts/mat/$CI_JOB_NAME_SLUG/optics-lint.json). */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isMain as isMainModule } from './_is-main.mjs';

const require = createRequire(import.meta.url);
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const RULE_ID = 'auraglass/no-optics-outside-material';

const posix = (p) => p.replace(/\\/g, '/');

/** Lint `root` with the repo config, keeping only the optics rule. Returns { file: count }. */
export async function measure(root) {
  const { ESLint } = require('eslint');
  const { default: config } = await import(pathToFileURL(join(REPO, 'eslint.config.js')).href);
  const { agConfig } = require(join(REPO, 'lint/rules/mat/no-optics-outside-material.cjs'));
  // Keep the repo config verbatim (parser, global ignores, the rule's agConfig and _strict
  // escalations) but drop every other auraglass/* rule entry, so an unrelated rule's
  // config cannot change or break this measurement.
  const scoped = config.map((c) => (c.rules
    ? { ...c, rules: Object.fromEntries(Object.entries(c.rules).filter(([id]) => id === RULE_ID || !id.startsWith('auraglass/'))) }
    : c));
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    baseConfig: scoped,
    ruleFilter: ({ ruleId }) => ruleId === RULE_ID,
    errorOnUnmatchedPattern: false,
  });
  const patterns = agConfig.flatMap((c) => c.files);
  const results = await eslint.lintFiles(patterns);
  const files = {};
  for (const r of results) {
    const hits = r.messages.filter((m) => m.ruleId === RULE_ID).length;
    const fatal = r.messages.filter((m) => m.fatal);
    if (fatal.length) {
      throw new Error(`[optics-lint] parse error in ${r.filePath}: ${fatal[0].message}`);
    }
    if (hits) files[posix(relative(root, r.filePath))] = hits;
  }
  return Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)));
}

/** Compare a measurement with a baseline. Returns { total, failures[], improved[] }. */
export function compare(files, baseline) {
  const total = Object.values(files).reduce((a, b) => a + b, 0);
  const failures = [];
  const improved = [];
  const base = baseline.files ?? {};
  if (total > baseline.maxWarnings) {
    failures.push(`total ${total} > maxWarnings ${baseline.maxWarnings}`);
  }
  for (const [f, n] of Object.entries(files)) {
    const allowed = base[f] ?? 0;
    if (n > allowed) failures.push(`${f}: ${n} > baseline ${allowed}`);
  }
  for (const [f, allowed] of Object.entries(base)) {
    if ((files[f] ?? 0) < allowed) improved.push(`${f}: ${files[f] ?? 0} < baseline ${allowed}`);
  }
  return { total, failures, improved };
}

if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : fallback;
  };
  const ROOT = resolve(opt('--root', '.'));
  const BASELINE = resolve(opt('--baseline', join(ROOT, 'lint/rules/mat/optics-baseline.json')));
  const OUT = opt('--out', null);
  const UPDATE = args.includes('--update');

  const files = await measure(ROOT);
  const total = Object.values(files).reduce((a, b) => a + b, 0);
  console.log(`optics-lint-findings: ${total} in ${Object.keys(files).length} files`);
  for (const [f, n] of Object.entries(files)) console.log(`  ${String(n).padStart(4)}  ${f}`);
  if (OUT) {
    mkdirSync(dirname(resolve(OUT)), { recursive: true });
    writeFileSync(resolve(OUT), `${JSON.stringify({ rule: RULE_ID, total, files }, null, 2)}\n`);
  }

  if (UPDATE) {
    let recordedAt = null;
    try {
      recordedAt = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
      recordedAt = null; // not a git checkout (fixture roots)
    }
    writeFileSync(BASELINE, `${JSON.stringify({
      rule: RULE_ID,
      mode: 'ratchet',
      maxWarnings: total,
      recordedAt,
      recordedBy: 'node scripts/mat/optics-lint.mjs --update',
      files,
    }, null, 2)}\n`);
    console.log(`[optics-lint] baseline recorded: maxWarnings=${total}`);
    process.exit(0);
  }

  if (!existsSync(BASELINE)) {
    console.error(`[optics-lint] missing baseline ${BASELINE}`);
    process.exit(1);
  }
  const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const { failures, improved } = compare(files, baseline);
  for (const i of improved) console.log(`[optics-lint] improved (run --update to lower the baseline): ${i}`);
  if (failures.length) {
    for (const f of failures) console.error(`[optics-lint] ratchet regression: ${f}`);
    process.exit(1);
  }
  console.log(`[optics-lint] ratchet OK (${total} <= ${baseline.maxWarnings})`);
}
