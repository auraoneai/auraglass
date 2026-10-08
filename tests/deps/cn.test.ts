/* @jest-environment node */
/* PLAT-270: cn composes clsx semantics only; tailwind-merge absent. cn is a
   final PLAT-owned one-line delegation to clsx — asserted both on its source
   and on clsx's own behaviour (jsdom-resolution of the ESM dist is a bundler
   concern, not cn's). */
import { describe, expect, it } from '@jest/globals';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../build/helpers';

const require2 = createRequire(join(ROOT, 'package.json'));
const clsx = require2('clsx');

describe('cn (PLAT-270)', () => {
  it('src/internal/index.ts delegates to clsx (not tailwind-merge)', () => {
    const src = readFileSync(join(ROOT, 'src', 'internal', 'index.ts'), 'utf8');
    expect(src).toContain("from 'clsx'");
    expect(src).not.toMatch(/tailwind-merge|twMerge/);
  });

  it('clsx composition joins truthy class strings (cn = clsx(...))', () => {
    expect(clsx('a', false, 'b')).toBe('a b');
    expect(clsx('a', undefined, null, 'c')).toBe('a c');
    expect(clsx()).toBe('');
    expect(clsx('p-2', 'p-4')).toBe('p-2 p-4'); /* no utility merging */
  });

  it('tailwind-merge is not a dependency anywhere', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies })).not.toContain('tailwind-merge');
  });
});
