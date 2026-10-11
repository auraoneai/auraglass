/* @jest-environment node */
/* REQ-CMP-12: auraglass/no-overlay-global-listeners — global keydown/pointer/
   scroll/resize listeners and document.body.style writes are banned in
   src/components/** and src/primitives/**; LayerStack is the only dispatcher. */
import { describe, expect, it } from '@jest/globals';
import { RuleTester, type Rule } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';

const REPO = path.resolve(__dirname, '../../..');
// CJS rule module (no .d.ts): loaded through require, typed as an ESLint rule.
const rule = createRequire(path.join(REPO, 'package.json'))(
  './lint/rules/cmp/no-overlay-global-listeners.cjs',
) as Rule.RuleModule;
const BAN = new RegExp(
  '(document|window)\\.(addEventListener|removeEventListener)\\(\\s*[\\x27\\x22](keydown|mousedown|pointerdown|scroll|resize)|document\\.body\\.style\\.',
);

function* walk(dir: string): Generator<string> {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (name.includes('__fixtures__')) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(name)) yield p;
  }
}

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('auraglass/no-overlay-global-listeners', () => {
  tester.run('no-overlay-global-listeners', rule, {
    valid: [
      // element-level handler on the layer's own node
      `el.addEventListener('pointerdown', h, true);`,
      // non-banned global events
      `window.addEventListener('mousemove', h);`,
      `document.addEventListener('selectionchange', h);`,
      // non-window/document receiver
      `root.addEventListener('keydown', h);`,
      // non-style body write
      `document.body.setAttribute('data-x', '1');`,
    ],
    invalid: [
      {
        code: `document.addEventListener('keydown', h);`,
        errors: [{ messageId: 'listener' }],
      },
      {
        code: `document.addEventListener('pointerdown', h, true);`,
        errors: [{ messageId: 'listener' }],
      },
      {
        code: `window.addEventListener('resize', h);`,
        errors: [{ messageId: 'listener' }],
      },
      {
        code: `window.removeEventListener('scroll', h);`,
        errors: [{ messageId: 'listener' }],
      },
      {
        code: `document.body.style.pointerEvents = 'none';`,
        errors: [{ messageId: 'bodyStyle' }],
      },
      {
        code: `document.body.style.overflow = 'hidden';`,
        errors: [{ messageId: 'bodyStyle' }],
      },
    ],
  });

  /* Offenders owned by other WPs sit in REQ-FIN-07's shrink-only baseline
     (e.g. CommandPalette.tsx, REQ-FIN-82 / FIN-F); every other file in scope
     must be clean. tests/integration/no-overlay-global-listeners.test.ts keeps
     the baseline exact (no stale row, no new offender). */
  it('zero violations across src/components + src/primitives + src/foundation outside the baseline', () => {
    const baselined = new Set(
      (JSON.parse(
        fs.readFileSync(path.join(REPO, 'scripts/integration/baselines/no-overlay-global-listeners.json'), 'utf8'),
      ) as Array<{ file: string }>).map((row) => row.file),
    );
    const hits: string[] = [];
    for (const dir of ['src/components', 'src/primitives', 'src/foundation']) {
      for (const file of walk(path.join(REPO, dir))) {
        if (baselined.has(path.relative(REPO, file).split(path.sep).join('/'))) continue;
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        lines.forEach((line, i) => {
          if (BAN.test(line)) hits.push(`${path.relative(REPO, file)}:${i + 1}`);
        });
      }
    }
    expect(hits).toEqual([]);
  });
});
