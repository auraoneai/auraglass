/* @jest-environment node */
/* REQ-MAT-18 (D.2-04, MAT-056/058/089): auraglass/no-raw-design-values.
   RuleTester: >= 1 invalid case per SC-17 category (color incl. oklch(,
   blur, radius, shadow, duration incl. motion numeric keys outside
   src/motion/**, easing, spring incl. linear()), the color.ts allowance
   comment, the named-reason marker scopes (FIN-E #308 clause request), and the
   exempt generated paths. The resolved ESLint severity (error on MAT globs,
   warn elsewhere) and the stylelint mirror run through the real configs in a
   child node process (both are ESM; no jest module mocking). */
import { describe, expect, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..', '..');
const rule = require(join(ROOT, 'lint/rules/mat/no-raw-design-values.cjs')) as {
  meta: unknown; create: unknown; agConfig: { files: string[]; severity: string }[];
};

const tester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});
const CMP = 'src/components/card/Card.tsx';
const MAT = 'src/material/x.ts';
const err = (n = 1) => Array.from({ length: n }, () => ({ messageId: 'raw' }));

describe('auraglass/no-raw-design-values (RuleTester)', () => {
  tester.run('no-raw-design-values', rule as never, {
    valid: [
      { code: `const s = { color: 'var(--ag-color-text)' };`, filename: CMP },
      { code: `const s = { color: 'oklch(from var(--ag-accent) l c h / 0.5)' };`, filename: CMP },
      { code: `// #fff in a comment is not code\nconst s = 1;`, filename: CMP },
      // motion numeric keys are allowed inside src/motion/** (the motion adapter)
      { code: `const t = { type: 'spring', stiffness: 300, damping: 30, mass: 1 };`, filename: 'src/motion/adapter/x.ts' },
      // exempt generated output
      { code: `export const c = '#ffffff';`, filename: 'src/tokens/generated/tokens.ts' },
      { code: `export const e = 'cubic-bezier(0.2, 0, 0, 1)';`, filename: 'src/motion/tokens.generated.ts' },
      // src/theme/color.ts colour-math allowance
      { code: `const D65 = '#ffffff'; // @ag-literal-allowed: color-math`, filename: 'src/theme/color.ts' },
      // named-reason marker: test-vector inside test files only
      { code: `expect(parse('#ff0000')).toEqual([255, 0, 0]); // @ag-literal-allowed: test-vector`, filename: 'src/components/color-picker/ColorPicker.test.tsx' },
      { code: `const v = 'rgb(1 2 3)'; // @ag-literal-allowed: test-vector`, filename: 'tests/material/fixture.ts' },
    ],
    invalid: [
      // color
      { code: `const s = { color: '#fff' };`, filename: CMP, errors: err() },
      { code: `const s = { background: 'rgba(0, 0, 0, 0.5)' };`, filename: CMP, errors: err() },
      { code: `const s = { color: 'oklch(70% 0.1 250)' };`, filename: CMP, errors: err() },
      // blur (blur(<n>px) inside a backdropFilter key counts once per matcher)
      { code: `const s = { filter: 'blur(12px)' };`, filename: CMP, errors: err() },
      { code: `const s = { backdropFilter: 'var(--ag-blur)' };`, filename: CMP, errors: err() },
      // radius
      { code: `const s = { borderRadius: '12px' };`, filename: CMP, errors: err() },
      // shadow
      { code: `const s = { boxShadow: '0 4px 12px black' };`, filename: CMP, errors: err() },
      // duration: ms in a transition string, Tailwind class, numeric motion key outside src/motion/**
      { code: `const css = 'transition: opacity 200ms';`, filename: CMP, errors: err() },
      { code: `const cls = 'duration-300';`, filename: CMP, errors: err() },
      { code: `const t = { stiffness: 300 };`, filename: CMP, errors: err() },
      { code: `const t = { duration: 0.2 };`, filename: 'src/theme/x.ts', errors: err() },
      // easing
      { code: `const e = 'cubic-bezier(0.2, 0, 0, 1)';`, filename: CMP, errors: err() },
      { code: `const cls = 'ease-in-out';`, filename: CMP, errors: err() },
      // spring: literal linear() curve, flagged inside src/motion/** too
      { code: `const e = 'linear(0, 0.5 30%, 1)';`, filename: 'src/motion/curves.ts', errors: err() },
      // the color-math allowance exists only in src/theme/color.ts
      { code: `const D65 = '#ffffff'; // @ag-literal-allowed: color-math`, filename: MAT, errors: err() },
      // test-vector is not valid in production source, and unknown reasons allow nothing
      { code: `const c = '#ff0000'; // @ag-literal-allowed: test-vector`, filename: CMP, errors: err() },
      { code: `const c = '#ff0000'; // @ag-literal-allowed: because`, filename: 'src/components/x.test.tsx', errors: err() },
    ],
  } as never);
});

/** Run an ESM snippet with the repo as cwd and parse its JSON stdout. */
const esm = (code: string): unknown =>
  JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, encoding: 'utf8' }));

describe('resolved severity (real eslint.config.js)', () => {
  it('error on MAT globs, warn on other streams, off on generated files', async () => {
    const files = [
      'src/material/Surface.tsx', 'src/motion/index.ts', 'src/theme/color.ts', 'src/a11y/index.ts',
      'src/tokens/index.ts', 'src/compat/mat/theme.ts',
      'src/components/button/Button.tsx', 'src/app-shell/AppShell.tsx', 'src/internal/cn.ts',
      'src/tokens/generated/tokens.ts',
    ];
    const got = esm(`
      import { ESLint } from 'eslint';
      const eslint = new ESLint({ cwd: process.cwd() });
      const out = {};
      for (const f of ${JSON.stringify(files)}) {
        const c = await eslint.calculateConfigForFile(f);
        const r = c?.rules?.['auraglass/no-raw-design-values'];
        out[f] = r === undefined ? 'unset' : (Array.isArray(r) ? r[0] : r);
      }
      console.log(JSON.stringify(out));
    `) as Record<string, number | string>;
    expect(got).toEqual({
      'src/material/Surface.tsx': 2, 'src/motion/index.ts': 2, 'src/theme/color.ts': 2, 'src/a11y/index.ts': 2,
      'src/tokens/index.ts': 2, 'src/compat/mat/theme.ts': 2,
      'src/components/button/Button.tsx': 1, 'src/app-shell/AppShell.tsx': 1, 'src/internal/cn.ts': 1,
      'src/tokens/generated/tokens.ts': 'unset',
    });
  });
});

describe('stylelint mirror (stylelint.config.mjs)', () => {
  it('flags raw CSS values: error on MAT CSS, warning elsewhere, nothing on token reads', () => {
    const cases = {
      mat: ['src/material/css/x.css', '.a { box-shadow: 0 4px 12px black; color: #fff; }'],
      cmp: ['src/components/card/Card.css', '.a { transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1); }'],
      clean: ['src/components/card/Clean.css', '.a { color: var(--ag-color-text); border-radius: var(--ag-radius-md); }'],
    };
    const got = esm(`
      import stylelint from 'stylelint';
      const cases = ${JSON.stringify(cases)};
      const out = {};
      for (const [k, [file, code]] of Object.entries(cases)) {
        const r = await stylelint.lint({ code, codeFilename: file, configFile: 'stylelint.config.mjs' });
        out[k] = r.results[0].warnings
          .filter((w) => w.rule === 'auraglass/no-raw-design-values')
          .map((w) => w.severity);
      }
      console.log(JSON.stringify(out));
    `) as { mat: string[]; cmp: string[]; clean: string[] };
    expect(got.mat.length).toBeGreaterThanOrEqual(2);
    expect(new Set(got.mat)).toEqual(new Set(['error']));
    expect(got.cmp.length).toBeGreaterThanOrEqual(2);
    expect(new Set(got.cmp)).toEqual(new Set(['warning']));
    expect(got.clean).toEqual([]);
  });
});
