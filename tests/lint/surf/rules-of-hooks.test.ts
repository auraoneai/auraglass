/** @jest-environment node */
// tests/lint/surf/rules-of-hooks.test.ts — SURF-137: react-hooks/rules-of-hooks
// is 'error' repo-wide in PLAT's eslint.config.js (line 10, glob
// '**/*.{ts,tsx,js,jsx,mjs,cjs}' covers every SURF path). This test asserts the
// config fires the rule on the seeded conditional-hook fixture so a future
// config regression over SURF paths fails loudly.

import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
// require (not import) — matches tests/lint/surf convention and avoids ESM
// default-interop surprises under the jest transform.
const tsParser = require('@typescript-eslint/parser');
const reactHooks = require('eslint-plugin-react-hooks');
const { Linter } = require('eslint');

const FIXTURE = join(__dirname, 'fixtures', 'conditional-hook.fixture');

describe('SURF-137 rules-of-hooks over SURF paths', () => {
  it('repo config declares react-hooks/rules-of-hooks at error', () => {
    const cfg = readFileSync(join(__dirname, '../../../eslint.config.js'), 'utf8');
    expect(cfg).toContain("'react-hooks/rules-of-hooks': 'error'");
  });

  it('conditional-hook fixture fails rules-of-hooks', () => {
    const linter = new Linter();
    const code = readFileSync(FIXTURE, 'utf8');
    const messages = linter.verify(code, {
      languageOptions: {
        parser: tsParser,
        ecmaVersion: 2023,
        sourceType: 'module',
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      plugins: { 'react-hooks': reactHooks },
      rules: { 'react-hooks/rules-of-hooks': 'error' },
    });
    expect(messages.some((m: { ruleId: string | null; severity: number }) => m.ruleId === 'react-hooks/rules-of-hooks' && m.severity === 2)).toBe(true);
  });
});
