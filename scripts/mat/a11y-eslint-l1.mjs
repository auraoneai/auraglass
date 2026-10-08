#!/usr/bin/env node
/* scripts/mat/a11y-eslint-l1.mjs — L1 Static a11y cell (MAT-370).
 * Runs eslint scoped to auraglass/no-runtime-contrast and
 * auraglass/no-document-escape over src/**. Rule modules not yet merged by
 * lane 2d-P report `pending`, never PASS. */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const plugin = require(resolve(root, 'eslint-plugin-auraglass.js'));
const RULES = ['no-runtime-contrast', 'no-document-escape'];

const missing = RULES.filter((r) => !plugin.rules?.[r]);
if (missing.length > 0) {
  for (const r of missing) console.log(`[l1] pending: auraglass/${r} (lane 2d-P lint rule not yet merged)`);
  process.exit(0);
}

const { ESLint } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: true,
  overrideConfig: [{
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { auraglass: plugin },
    rules: Object.fromEntries(RULES.map((r) => [`auraglass/${r}`, 'error'])),
  }],
});

const results = await eslint.lintFiles(['src/**/*.{ts,tsx,js,jsx,mjs,cjs}']);
const problems = results.flatMap((r) => r.messages.map((m) => `${r.filePath}:${m.line}:${m.column} ${m.ruleId} ${m.message}`));
if (problems.length > 0) {
  for (const p of problems) console.error(`[l1] ${p}`);
  process.exit(1);
}
console.log(`[l1] a11y eslint rules clean (${RULES.join(', ')})`);
