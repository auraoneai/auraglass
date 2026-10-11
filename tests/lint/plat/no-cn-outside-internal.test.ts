/* @jest-environment node */
// REQ-PLAT-26 / AC-FIN-33: `cn` lives only in src/internal/cn.ts.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { Linter } from 'eslint';
import { tester } from './helpers';

const rule = require('../../../lint/rules/plat/no-cn-outside-internal.cjs');
const F = 'src/material/Surface.tsx';
const CN = 'src/internal/cn.ts';
const imp = (mod: string) => [{ messageId: 'import' as const, data: { mod } }];
const def = [{ messageId: 'define' as const }];

describe('auraglass/no-cn-outside-internal (REQ-PLAT-26)', () => {
  tester.run('no-cn-outside-internal', rule, {
    valid: [
      { code: `import { cn } from '../internal';\nexport const x = cn('a', false && 'b');`, filename: F },
      { code: `import { cn } from '../internal/cn';\nexport const x = cn('a');`, filename: F },
      { code: `import clsx from 'clsx';\nexport function cn(...a: string[]) { return clsx(...a); }`, filename: CN },
      { code: `export { cn } from './cn';`, filename: 'src/internal/index.ts' },
      { code: `const cnx = 1; function cna() {}\nexport { cnx, cna };`, filename: F },
      { code: `import x from 'clsx-like';\nexport default x;`, filename: F },
    ],
    invalid: [
      { code: `import clsx from 'clsx';\nexport const x = clsx('a');`, filename: F, errors: imp('clsx') },
      { code: `import { twMerge } from 'tailwind-merge';\nexport const x = twMerge('a');`, filename: F, errors: imp('tailwind-merge') },
      { code: `import classNames from 'classnames';\nexport const x = classNames('a');`, filename: F, errors: imp('classnames') },
      { code: `export { default as cn } from 'clsx';`, filename: 'src/internal/index.ts', errors: imp('clsx') },
      { code: `export * from 'clsx';`, filename: F, errors: imp('clsx') },
      { code: `export const load = () => import('clsx');`, filename: F, errors: imp('clsx') },
      { code: `const c = require('clsx');\nexport default c;`, filename: F, errors: imp('clsx') },
      { code: `const cn = (...a: string[]) => a.join(' ');\nexport default cn;`, filename: F, errors: def },
      { code: `function cn(...a: string[]) { return a.join(' '); }\nexport default cn;`, filename: F, errors: def },
      { code: `export let cn = (a: string) => a;`, filename: 'src/internal/other.ts', errors: def },
    ],
  });

  it('the real src/ tree has zero offenders (rule run over every src/**/*.ts(x) file)', () => {
    const parser = require('@typescript-eslint/parser');
    const linter = new Linter({ configType: 'flat' });
    const files: string[] = [];
    const walk = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(n) && !/\.d\.ts$/.test(n)) files.push(p);
      }
    };
    walk('src');
    expect(files.length).toBeGreaterThan(100);
    const offenders: string[] = [];
    for (const f of files) {
      if (f === CN) continue;
      const msgs = linter.verify(readFileSync(f, 'utf8'), [{
        files: ['**/*.{ts,tsx}'],
        linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'off' },
        languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module', ecmaVersion: 2022 } },
        plugins: { auraglass: { rules: { 'no-cn-outside-internal': rule } } },
        rules: { 'auraglass/no-cn-outside-internal': 'error' },
      }], f);
      for (const m of msgs) if (m.fatal || m.ruleId === 'auraglass/no-cn-outside-internal') offenders.push(`${f}:${m.line} ${m.message}`);
    }
    expect(offenders).toEqual([]);
  });
});
