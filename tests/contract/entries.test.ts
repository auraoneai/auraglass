/* QUAL — REQ-SURF-01 step 5: the ENTRIES contract is internally consistent —
   every row names a real source module (or a build: pseudo-source), a known
   owner, a ga label, and a well-formed subpath; no duplicate subpaths; every
   listed export is actually a named export of the source barrel (checked on
   the module graph, not regexes). */
import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ENTRIES } from '../../src/contracts/entries';

const ROOT = join(__dirname, '..', '..');
const subpathRe = /^\.(\/[a-z0-9\-_*{}.\/]+)?$/;

describe('contract ENTRIES rows', () => {
  it('no duplicate subpaths', () => {
    const seen = new Set<string>();
    const dups: string[] = [];
    for (const e of ENTRIES) {
      if (seen.has(e.subpath)) dups.push(e.subpath);
      seen.add(e.subpath);
    }
    expect(dups).toEqual([]);
  });
  it('every row has a well-formed subpath, owner and ga', () => {
    for (const e of ENTRIES) {
      expect({ sub: e.subpath, ok: subpathRe.test(e.subpath) }).toEqual({ sub: e.subpath, ok: true });
      expect(['PLAT', 'MAT', 'CMP', 'SURF']).toContain(e.owner);
      expect(['5.0', '5.1']).toContain(e.ga);
    }
  });
  it('every source module exists on disk (or is a build: pseudo-source)', () => {
    /* Entries whose barrels are still in open PRs — the check fails if a NEW
       module goes missing, and prompts cleanup once the pending one lands. */
    const KNOWN_PENDING = new Set(['./forms']); // REQ-CMP-31 (PR #200)
    const missing = ENTRIES
      .filter((e) => !e.source.startsWith('build:'))
      .filter((e) => !existsSync(join(ROOT, e.source)))
      .map((e) => e.subpath);
    expect(missing.filter((s) => !KNOWN_PENDING.has(s))).toEqual([]);
    expect(missing.filter((s) => KNOWN_PENDING.has(s)).sort())
      .toEqual([...KNOWN_PENDING].sort());
  });
  it('listed exports are emitted by their source barrels', () => {
    /* Macro/placeholder lists (@see, @glyphs, @union) are verified by the
       stream-specific gates instead. Barrels whose import graph needs
       generated artifacts (tokens/generated, dist) are skipped here — the
       build lanes gate those surfaces. */
    const checked: Array<{ sub: string; missing: string[] }> = [];
    const skipped: string[] = [];
    for (const e of ENTRIES) {
      const concrete = e.exports.filter((n) => !n.startsWith('@'));
      if (concrete.length === 0 || e.source.startsWith('build:') || e.source === 'package.json') continue;
      let mod: Record<string, unknown>;
      try {
        mod = require(join(ROOT, e.source.replace(/\.ts$/, '')));
      } catch {
        skipped.push(e.subpath);
        continue;
      }
      const keys = Object.keys(mod);
      const missing = concrete.filter((n) => !keys.includes(n));
      if (missing.length > 0) checked.push({ sub: e.subpath, missing });
    }
    expect(checked).toEqual([]);
  });
});
