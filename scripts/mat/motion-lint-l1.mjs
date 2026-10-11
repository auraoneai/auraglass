#!/usr/bin/env node
/* scripts/mat/motion-lint-l1.mjs — L1 Static cell for the MAT motion rules
 * (REQ-MAT-51, REQ-FIN-58, D.3-31).
 *
 * Runs every auraglass/motion-* rule owned by MAT (contracts/lint-rule-owners.json)
 * at 'error' over <root>/src/**, then compares the findings with the ratchet
 * baseline (lint/rules/mat/motion-baseline.json). Exit 1 when:
 *   - a finding has no baseline row (new violation),
 *   - a file/rule count is above its row,
 *   - a row's count is now lower or zero (the row must be lowered or deleted —
 *     the baseline only shrinks),
 *   - --enforce-zero is set (release scope) and the baseline has any row,
 *   - a file fails to parse.
 *
 * Usage: node scripts/mat/motion-lint-l1.mjs [--root <dir>] [--baseline <json>] [--enforce-zero]
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, relative, resolve, sep } from 'node:path';

const require = createRequire(import.meta.url);
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const root = resolve(opt('--root') ?? repo);
const baselinePath = resolve(opt('--baseline') ?? resolve(repo, 'lint/rules/mat/motion-baseline.json'));
const enforceZero = argv.includes('--enforce-zero');
const tag = '[motion-lint]';

const fail = (lines) => {
  for (const l of lines) console.error(`${tag} ${l}`);
  process.exit(1);
};

const REQUIRED = ['file', 'rule', 'count', 'owner', 'expires'];
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
if (!Array.isArray(baseline.rows)) fail([`${baselinePath}: missing "rows" array`]);
const bad = baseline.rows.flatMap((r, i) => REQUIRED.filter((k) => !(k in r)).map((k) => `baseline row ${i}: missing "${k}"`));
const nonPositive = baseline.rows.filter((r) => !Number.isInteger(r.count) || r.count < 1).map((r) => `baseline row ${r.file} ${r.rule}: count must be a positive integer`);
if (bad.length || nonPositive.length) fail([...bad, ...nonPositive]);

const plugin = (await import(pathToFileURL(resolve(repo, 'eslint-plugin-auraglass.js')).href)).default;
const owners = JSON.parse(readFileSync(resolve(repo, 'contracts/lint-rule-owners.json'), 'utf8'));
const RULES = Object.keys(plugin.rules).filter((r) => r.startsWith('motion-') && owners[r] === 'mat').sort();
if (RULES.length === 0) fail(['no MAT motion-* rules discovered in eslint-plugin-auraglass.js']);
const unknownRule = baseline.rows.filter((r) => !RULES.includes(r.rule)).map((r) => `baseline row ${r.file}: unknown rule ${r.rule}`);
if (unknownRule.length) fail(unknownRule);

const { ESLint } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: true,
  errorOnUnmatchedPattern: false,
  overrideConfig: [{
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    plugins: { auraglass: plugin },
    rules: Object.fromEntries(RULES.map((r) => [`auraglass/${r}`, 'error'])),
  }],
});

const results = await eslint.lintFiles(['src/**/*.{ts,tsx,js,jsx}']);
const rel = (f) => relative(root, f).split(sep).join('/');
const fatal = [];
const findings = new Map(); // `${file}\0${rule}` -> [{line, column, message}]
for (const r of results) {
  for (const m of r.messages) {
    if (m.fatal) {
      fatal.push(`${rel(r.filePath)}:${m.line}:${m.column} parse error: ${m.message}`);
      continue;
    }
    if (!m.ruleId?.startsWith('auraglass/motion-')) continue;
    const key = `${rel(r.filePath)}\0${m.ruleId.slice('auraglass/'.length)}`;
    if (!findings.has(key)) findings.set(key, []);
    findings.get(key).push({ line: m.line, column: m.column, message: m.message });
  }
}

const problems = [...fatal];
const rows = new Map(baseline.rows.map((r) => [`${r.file}\0${r.rule}`, r]));
for (const [key, list] of findings) {
  const [file, rule] = key.split('\0');
  const row = rows.get(key);
  const detail = list.map((m) => `${file}:${m.line}:${m.column} auraglass/${rule} ${m.message}`);
  if (!row) problems.push(...detail.map((d) => `new violation: ${d}`));
  else if (list.length > row.count) problems.push(`count ${list.length} > baseline ${row.count} for ${file} auraglass/${rule}`, ...detail.map((d) => `  ${d}`));
}
for (const [key, row] of rows) {
  const n = findings.get(key)?.length ?? 0;
  if (n === 0) problems.push(`stale baseline row: ${row.file} auraglass/${row.rule} has 0 findings — delete the row`);
  else if (n < row.count) problems.push(`ratchet down: ${row.file} auraglass/${row.rule} has ${n} < baseline ${row.count} — lower the row`);
}
if (enforceZero && baseline.rows.length > 0) {
  problems.push(`--enforce-zero: ${baseline.rows.length} baseline row(s) remain (expires ${[...new Set(baseline.rows.map((r) => r.expires))].join(', ')})`);
  for (const r of baseline.rows) problems.push(`  ${r.file} auraglass/${r.rule} x${r.count} (owner ${r.owner}${r.wp ? `, ${r.wp}` : ''})`);
}

if (problems.length) fail(problems);
const ratcheted = baseline.rows.reduce((s, r) => s + r.count, 0);
console.log(`${tag} OK — ${RULES.length} rules at error over ${results.length} files; ${ratcheted} ratcheted finding(s) in ${baseline.rows.length} baseline row(s), 0 new`);
