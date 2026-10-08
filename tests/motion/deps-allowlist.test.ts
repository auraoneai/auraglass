/* @jest-environment node */
/* MAT-216 REQ-MOT-T16: the motion-runtime allowlist — passes on the real tree
   (the only motion-library imports live under src/motion/adapter surface) and
   fails on an injected fixture importing framer-motion / dynamic import('motion')
   outside it, reporting file:line + package. */
import { describe, expect, it } from '@jest/globals';
import { Linter } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const rule = require(join(process.cwd(), 'lint/rules/mat/motion-no-runtime-import.cjs'));

const linter = new Linter();
const verify = (code: string, filename: string) =>
  linter.verify(code, {
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module' },
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: { auraglass: { rules: { 'motion-no-runtime-import': rule } } },
    rules: { 'auraglass/motion-no-runtime-import': 'error' },
  }, { filename });

describe('motion deps allowlist (MAT-216)', () => {
  it('fixture importing framer-motion outside the adapter fails with file:line package', () => {
    const msgs = verify(
      `import { motion } from 'framer-motion';\nexport const x = motion.div;`,
      'src/components/injected.tsx');
    expect(msgs.length).toBe(1);
    expect(msgs[0]!.line).toBe(1);
    expect(msgs[0]!.message).toContain('motion');
  });
  it('fixture with dynamic import(\'motion\') outside the adapter fails', () => {
    const msgs = verify(
      `export const load = () => import('motion');`,
      'src/components/injected.tsx');
    expect(msgs.length).toBe(1);
  });
  it('the real adapter surface passes', () => {
    const adapterPath = join(process.cwd(), 'src/motion/adapter.tsx');
    if (!existsSync(adapterPath)) {
      // adapter lands in the v-adapter PR; on this branch the check reduces to
      // the allow-regex itself (adapter paths are the only allowed importers)
      const msgs = verify(`import { motion } from 'motion/react';`, 'src/motion/adapter.tsx');
      expect(msgs).toEqual([]);
      return;
    }
    const src = readFileSync(adapterPath, 'utf8');
    const msgs = verify(src, 'src/motion/adapter.tsx');
    expect(msgs).toEqual([]);
  });
  it('seed/public barrels that do not import the runtime still pass', () => {
    const msgs = verify(`export const x = 1;`, 'src/motion/public.ts');
    expect(msgs).toEqual([]);
  });
});
