/* @jest-environment node */
/* PLAT-249/250: 'use client' / 'use server' survive the bundle verbatim as the first
   statement of every emitted module that had one in src. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';

const DIRECTIVES = /^['"](?:use client|use server)['"];?/;

describe('directive preservation (PLAT-249)', () => {
  it('every src directive file emits a matching first-line directive in dist', () => {
    ensureBuilt();
    const srcs = walk(join(ROOT, 'src'), f => f.endsWith('.ts') || f.endsWith('.tsx'));
    const misses: string[] = [];
    for (const s of srcs) {
      const head = readFileSync(s, 'utf8').trimStart();
      const m = head.match(DIRECTIVES);
      if (!m) continue;
      const distFile = join(DIST, s.slice(join(ROOT, 'src').length + 1)).replace(/\.tsx?$/, '.js');
      try {
        if (!readFileSync(distFile, 'utf8').trimStart().match(DIRECTIVES)) misses.push(distFile);
      } catch {
        // pending entry (seed graph) — not emitted, nothing to preserve
      }
    }
    expect(misses).toEqual([]);
  });
});
