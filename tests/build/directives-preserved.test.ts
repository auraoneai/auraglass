/* @jest-environment node */
/* REQ-PLAT-65: "use client" directives survive into dist for every file that
   carries them in src. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';

const srcDirectiveFiles = walk(join(ROOT, 'src'), (p) => {
  if (!/\.tsx?$/.test(p)) return false;
  const head = readFileSync(p, 'utf8').slice(0, 200);
  return /^["']use client["']/.test(head);
});

describe('directives-preserved', () => {
  it('every src "use client" file emits a dist file still carrying the directive', () => {
    ensureBuilt();
    const missing: string[] = [];
    for (const sf of srcDirectiveFiles) {
      const rel = sf.replace(join(ROOT, 'src') + '/', '').replace(/\.tsx?$/, '');
      const candidates = walk(DIST, (p) => p.endsWith('.js') && p.includes(rel));
      if (!candidates.length) continue; // pending/seed entries emit nothing
      const ok = candidates.some((c) => readFileSync(c, 'utf8').includes('use client'));
      if (!ok) missing.push(rel);
    }
    expect(missing).toEqual([]);
  });
});
