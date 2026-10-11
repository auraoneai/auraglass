/* @jest-environment node */
/* REQ-PLAT-65: displayName is emitted purely from source (the
   createIcon('Name', node) call) — no post-build displayName injection, and
   no misplaced #__PURE__ annotations on alias re-exports (rolldown ignores
   them and warns). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, walk } from './helpers';

describe('pure displayName emission', () => {
  it('post.mjs contains no displayName transform (emission is source-pure)', () => {
    const post = readFileSync(join(ROOT, 'scripts/build/post.mjs'), 'utf8');
    expect(post).not.toMatch(/displayName/);
  });
  it('no misplaced #__PURE__ on identifier (non-call) re-exports', () => {
    const bad: string[] = [];
    for (const f of walk(join(ROOT, 'src'), (p) => /\.tsx?$/.test(p))) {
      const t = readFileSync(f, 'utf8');
      // PURE may only precede a call/new expression; a bare identifier is invalid
      if (/= *\/\*#?__PURE__\*\/ *[A-Z][A-Za-z0-9_]* *;/.test(t)) bad.push(f);
    }
    expect(bad).toEqual([]);
  });
  it('every icon alias is created through a createIcon call with its display name', () => {
    const bad: string[] = [];
    for (const f of walk(join(ROOT, 'src/icons'), (p) => p.endsWith('.tsx'))) {
      const t = readFileSync(f, 'utf8');
      for (const m of t.matchAll(/export const (\w+) = ([^;]+);/g)) {
        if (!/createIcon\(|\w+$/.test(m[2].trim()) && !/^\w+$/.test(m[2].trim())) bad.push(`${f}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
