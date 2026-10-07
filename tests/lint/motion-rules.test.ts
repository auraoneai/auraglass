/* @jest-environment node */
/* MAT-234 REQ-MOT-T17/-68: RuleTester coverage — ≥1 valid + ≥1 invalid per
   rule (REQ-MOT-60, -62, -63, -64, -65, -66, -35) plus the allow-list rule.
   CSS fixtures in tests/lint/fixtures/motion run through checkCss (MAT-232). */
import { describe, expect, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkCss } from '../../scripts/ci/verify-motion-css.mjs';

const rule = (name: string) =>
  require(join(process.cwd(), 'lint/rules/mat', `${name}.cjs`)) as {
    meta: unknown; create: unknown;
  };

const tester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});
const SRC = 'src/components/x.tsx';
const ADAPTER = 'src/motion/adapter.tsx';

describe('auraglass lint rules (MAT)', () => {
    tester.run('motion-no-runtime-import', rule('motion-no-runtime-import') as never, {
      valid: [
        { code: `import { motion } from 'motion/react';`, filename: ADAPTER },
        { code: `import { foo } from './bar';`, filename: SRC },
      ],
      invalid: [
        { code: `import { motion } from 'framer-motion';`, filename: SRC, errors: 1 },
        { code: `const m = require('gsap');`, filename: 'src/components/y.cjs', errors: 1 },
        { code: `const m = await import('motion');`, filename: SRC, errors: 1 },
        { code: `export { animate } from 'react-spring';`, filename: SRC, errors: 1 },
      ],
    } as never);


    tester.run('motion-no-hover-transform', rule('motion-no-hover-transform') as never, {
      valid: [{ code: `const t = { transition: 'opacity 200ms' };`, filename: SRC }],
      invalid: [
        { code: `const el = <div whileHover={{ scale: 1.05 }} />;`, filename: SRC, errors: 1 },
        { code: `const cfg = { whileTap: { scale: 0.98 } };`, filename: SRC, errors: 1 },
      ],
    } as never);


    tester.run('motion-single-preference-source', rule('motion-single-preference-source') as never, {
      valid: [
        { code: `matchMedia('(prefers-reduced-motion: reduce)');`, filename: 'src/motion/ticker.ts' },
        { code: `import { usePreference } from '../theme';`, filename: SRC },
      ],
      invalid: [
        { code: `const mq = matchMedia('(prefers-reduced-motion: reduce)');`, filename: SRC, errors: 1 },
        { code: `import { useReducedMotion } from 'motion/react';`, filename: SRC, errors: 1 },
      ],
    } as never);


    tester.run('motion-no-empty-animate', rule('motion-no-empty-animate') as never, {
      valid: [
        { code: `const el = <div animate={{ opacity: 1 }} initial={{ opacity: 0 }} />;`, filename: SRC },
      ],
      invalid: [
        { code: `const el = <div animate={{}} />;`, filename: SRC, errors: 1 },
        { code: `const el = <div initial={{ opacity: 0 }} animate={cond && { opacity: 1 }} />;`, filename: SRC, errors: 1 },
        { code: `const el = <div initial={{ opacity: 0 }} animate={cond ? { opacity: 1 } : undefined} />;`, filename: SRC, errors: 1 },
      ],
    } as never);


    tester.run('motion-raf-via-ticker', rule('motion-raf-via-ticker') as never, {
      valid: [
        { code: `requestAnimationFrame(() => {});`, filename: 'src/motion/ticker.ts' }, // runtime module owns the loop
        { code: `requestAnimationFrame(() => {});`, filename: 'src/motion/pointerLight.ts' },
      ],
      invalid: [
        { code: `requestAnimationFrame(() => tick());`, filename: SRC, errors: 1 },
        { code: `setInterval(() => poll(), 100);`, filename: 'src/primitives/x.ts', errors: 1 },
        { code: `subscribeFrame(() => setCount(c + 1));`, filename: 'src/other/x.ts', errors: 1 },
      ],
    } as never);


    tester.run('motion-transition-allowlist', rule('motion-transition-allowlist') as never, {
      valid: [
        { code: `const s = { transition: 'opacity 200ms, transform 300ms' };`, filename: SRC },
        { code: `const s = { transitionProperty: '--ag-specular' };`, filename: SRC },
      ],
      invalid: [
        { code: `const s = { transition: 'all 200ms' };`, filename: SRC, errors: 1 },
        { code: `const s = { transition: 'width 200ms' };`, filename: SRC, errors: 1 },
        { code: `const el = <div style={{ transition: 'all 1s' }} />;`, filename: SRC, errors: 1 },
      ],
    } as never);


    tester.run('motion-no-ungated-loop', rule('motion-no-ungated-loop') as never, {
      valid: [
        { code: `const ok = usePreference('allowContinuous'); const t = { repeat: Infinity };`, filename: SRC },
        { code: `const t = { repeat: 3 };`, filename: SRC },
      ],
      invalid: [
        { code: `const t = { repeat: Infinity };`, filename: SRC, errors: 1 },
        { code: `const t = { iterations: Infinity };`, filename: SRC, errors: 1 },
      ],
    } as never);


    tester.run('motion-no-random', rule('motion-no-random') as never, {
      valid: [
        { code: `const id = 'a-' + Math.random(); render(<div id={id} />);`, filename: SRC },
        { code: `const r = Math.random(); useFoo(r);`, filename: SRC },
      ],
      invalid: [
        { code: `const el = <div animate={{ opacity: Math.random() }} />;`, filename: SRC, errors: 1 },
        { code: `const r = Math.random(); const el = <div animate={{ x: r }} />;`, filename: SRC, errors: 1 },
        { code: `const el = <div style={{ transitionDelay: Math.random() + 's' }} />;`, filename: SRC, errors: 1 },
        { code: `el.animate([{ opacity: Math.random() }]);`, filename: SRC, errors: 2 },
        { code: `const t = { duration: Math.random() };`, filename: SRC, errors: 1 },
      ],
    } as never);

});

describe('checkCss fixtures (MAT-232/-234)', () => {
  const dir = join(__dirname, 'fixtures', 'motion');
  const files = readdirSync(dir).filter((f) => f.endsWith('.css'));
  it.each(files)('%s', (f) => {
    const { issues } = checkCss(readFileSync(join(dir, f), 'utf8'), f);
    if (f.startsWith('bad-')) {
      expect(issues.length).toBeGreaterThan(0);
    } else {
      expect(issues).toEqual([]);
    }
  });
  it('fixture diagnostics carry file:line + rule id', () => {
    const { issues } = checkCss('.a{transition: all 1ms}', 'x.css');
    expect(issues[0]).toMatchObject({ file: 'x.css', rule: 'no-transition-all' });
    expect(issues[0]!.line).toBeGreaterThan(0);
  });
});
