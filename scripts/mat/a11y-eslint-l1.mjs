#!/usr/bin/env node
/* scripts/mat/a11y-eslint-l1.mjs — L1 Static a11y cell (MAT-370, REQ-MAT-64/-57).
 * Runs eslint scoped to auraglass/no-runtime-contrast and
 * auraglass/no-document-escape over src/**.
 *
 * eslint-plugin-auraglass.js is ESM (`export default`), so it is loaded with a
 * dynamic import of its default export. A missing rule is a failure (exit 1),
 * never a silent pass. The no-runtime-contrast exemption rows
 * (lint/rules/mat/no-runtime-contrast.exemptions.json) fail the cell once they
 * expire or once their path no longer exists (the owner moved the code, so the
 * row must be deleted).
 *
 * Usage: node scripts/mat/a11y-eslint-l1.mjs [--root <dir>] [--rules a,b]
 *   --root   tree whose src/** is linted (default: repo root)
 *   --rules  override the rule list (used by tests/lint/mat/a11y-eslint-l1.test.ts) */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const argValue = (flag) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
};
const root = resolve(argValue('--root') ?? repoRoot);
const RULES = (argValue('--rules') ?? 'no-runtime-contrast,no-document-escape')
  .split(',').map((r) => r.trim()).filter(Boolean);

const plugin = (await import(pathToFileURL(resolve(repoRoot, 'eslint-plugin-auraglass.js')).href)).default;

const missing = RULES.filter((r) => !plugin?.rules?.[r]);
if (missing.length > 0) {
  for (const r of missing) console.error(`[l1] missing rule: auraglass/${r} is not exported by eslint-plugin-auraglass.js`);
  process.exit(1);
}

const failures = [];

if (RULES.includes('no-runtime-contrast')) {
  const { loadExemptions, EXEMPTIONS_FILE } = require(resolve(repoRoot, 'lint/rules/mat/no-runtime-contrast.cjs'));
  for (const row of loadExemptions()) {
    const where = relative(repoRoot, EXEMPTIONS_FILE);
    if (row.expired) failures.push(`${where}: exemption ${row.path} expired at ${row.expires} (${row.until})`);
    if (!existsSync(resolve(root, row.path))) failures.push(`${where}: exemption ${row.path} is stale (path does not exist) — delete the row`);
  }
}

const { ESLint } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: true,
  // Only the scoped rules load here, so inline directives for other rules
  // would report as unknown/unused; directives are ignored, which also means
  // the two gated rules cannot be suppressed inline.
  allowInlineConfig: false,
  overrideConfig: [{
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { auraglass: plugin },
    rules: Object.fromEntries(RULES.map((r) => [`auraglass/${r}`, 'error'])),
  }],
});

const results = await eslint.lintFiles(['src/**/*.{ts,tsx,js,jsx,mjs,cjs}']);
for (const r of results) {
  for (const m of r.messages) {
    failures.push(`${relative(root, r.filePath)}:${m.line}:${m.column} ${m.ruleId ?? 'parse'} ${m.message}`);
  }
}

if (failures.length > 0) {
  for (const f of failures) console.error(`[l1] ${f}`);
  console.error(`[l1] ${failures.length} problem(s) across ${results.length} file(s)`);
  process.exit(1);
}
console.log(`[l1] a11y eslint rules clean (${RULES.join(', ')}; ${results.length} file(s))`);
