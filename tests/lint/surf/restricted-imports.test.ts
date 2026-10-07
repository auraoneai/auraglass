/** @jest-environment node */
// tests/lint/surf/restricted-imports.test.ts — REQ-SURF-166/-170.
// Registry compositions and labs residents may import only public aura-glass
// entries. The test drives ESLint's no-restricted-imports over fixtures with
// the gate's banned list and asserts _strict.cjs scopes the rule correctly.
import { describe, expect, it } from '@jest/globals';
import { Linter } from 'eslint';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');

const BANNED_PATTERNS = [
  { group: ['aura-glass/src/**'], message: 'import from the public entry point only' },
  { group: ['aura-glass/dist', 'aura-glass/dist/**'], message: 'never import the dist tree' },
  { group: ['aura-glass/compat', 'aura-glass/compat/**'], message: 'compat adapters are not public API' },
];

describe('restricted-imports for blocks/labs', () => {
  it('flags banned specifiers and passes public ones', () => {
    const linter = new Linter();
    const config = [{
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
        ecmaVersion: 2022, sourceType: 'module',
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      rules: { 'no-restricted-imports': ['error', { patterns: BANNED_PATTERNS }] },
    }] as any;
    const bad = linter.verify(
      `import { cn } from 'aura-glass/src/internal/cn';\nexport const x = cn;`,
      config, 'registry/blocks/fixture/index.tsx');
    expect(bad.some((m) => m.ruleId === 'no-restricted-imports')).toBe(true);
    const compat = linter.verify(
      `import x from 'aura-glass/compat';\nexport const y = x;`,
      config, 'packages/labs/src/f/index.ts');
    expect(compat.some((m) => m.ruleId === 'no-restricted-imports')).toBe(true);
    const ok = linter.verify(
      `import { Surface } from 'aura-glass';\nexport const y = Surface;`,
      config, 'registry/blocks/fixture/index.tsx');
    expect(ok.filter((m) => m.ruleId === 'no-restricted-imports')).toEqual([]);
  });

  it('_strict.cjs only escalates rules whose module exists (plugin-load invariant)', () => {
    // The loader maps every strict entry to 'auraglass/<rule>': 'error'; a
    // rule name without lint/rules/<owner>/<rule>.cjs crashes ESLint for the
    // whole repo. Assert every escalated name resolves on disk and every glob
    // is a SURF-owned path.
    const strict = require(join(ROOT, 'lint/rules/surf/_strict.cjs'));
    const owners = Object.entries(strict.strict as Record<string, string[]>);
    expect(owners.length).toBeGreaterThan(0);
    for (const [rule, globs] of owners) {
      const found = ['plat', 'mat', 'cmp', 'surf', 'qual'].some((s) =>
        existsSync(join(ROOT, 'lint/rules', s, `${rule}.cjs`))
      );
      // auraglass/<rule> escalated but no rule module exists → plugin-wide eslint failure
      expect(found).toBe(true);
      for (const g of globs) {
        // glob must stay inside SURF-owned paths
        expect(/^(src\/(app-shell|data|date|ai|media|backdrops|charts|three|components)|registry\/|packages\/labs\/)/.test(g)).toBe(true);
      }
    }
  });

  it('registry + labs globs are inside the SURF-owned set W5 escalates', () => {
    // SURF-635: when the owner lanes ship prop-grammar / no-forward-ref /
    // contract-boundary, W5 adds them over SURF_OWNED — blocks, items and
    // labs/src are already members so nothing new is needed at flip time.
    const src = readFileSync(join(ROOT, 'lint/rules/surf/_strict.cjs'), 'utf8');
    for (const g of ['registry/blocks/**', 'registry/items/**', 'packages/labs/src/**']) {
      expect(src).toContain(`'${g}'`);
    }
  });
});
