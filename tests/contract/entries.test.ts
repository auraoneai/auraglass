/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): entries.test.ts — seam S-35 (G-03 rows,
   `pending` mode before GA). Re-lands the REQ-SURF-01 step-5 checks from #338 without a literal
   pending set and without silent skips: every gap is a Violation naming the entry's owner, and
   before GA (prerelease version) gaps in paths this branch does not touch are recorded pending
   for the lane runner; at GA (or AG_SCOPE=release) every gap in a GA-due entry fails.
   - every row names a real source module (or a build: pseudo-source), a known owner, a ga
     label and a well-formed subpath; no duplicate subpaths;
   - build/exports.manifest.json (generated from ENTRIES) lists exactly the ENTRIES subpaths;
   - every listed export is a named export of the source barrel (checked on the loaded module,
     not with regexes). */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ENTRIES, ROOT_EXPORTS } from '../../src/contracts/entries';
import { ROOT, conform, type Violation } from './_conformance';

const SUITE = 'entries';
const subpathRe = /^\.(\/[a-z0-9\-_*{}./]+)?$/;
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string };
const [major, minor] = PKG.version.split(/[.-]/).map(Number) as [number, number];
/** An entry is due at GA of its `ga` line (5.1 entries are not due at 5.0). */
const due = (ga: string) => { const [a, b] = ga.split('.').map(Number) as [number, number]; return major > a || (major === a && minor >= b); };
const entryViolation = (e: (typeof ENTRIES)[number], detail: string, file = e.source): Violation =>
  ({ seam: 'S-35', file: file.startsWith('build:') ? 'build/exports.manifest.json' : file, owner: e.owner, detail: `${e.subpath} (ga ${e.ga}${due(e.ga) ? '' : ', not yet due'}): ${detail}` });

/** Not-yet-due entries never fail, even in strict mode: they are reported pending. */
function conformByDue(check: string, violations: Array<{ v: Violation; ga: string }>) {
  conform(SUITE, check, violations.filter((x) => due(x.ga)).map((x) => x.v));
  conform(SUITE, `${check} (not yet due)`, violations.filter((x) => !due(x.ga)).map((x) => x.v), { notYetDue: true });
}

describe('S-35 ENTRIES rows', () => {
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

  it('build/exports.manifest.json lists exactly the ENTRIES subpaths', () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'build', 'exports.manifest.json'), 'utf8')) as { entries: Array<{ subpath: string; source: string }> };
    const fromManifest = manifest.entries.map((m) => m.subpath).sort();
    const fromEntries = ENTRIES.filter((e) => !['./package.json'].includes(e.subpath)).map((e) => e.subpath).sort();
    const missing = fromEntries.filter((s) => !fromManifest.includes(s));
    const extra = fromManifest.filter((s) => !ENTRIES.some((e) => e.subpath === s));
    const v: Violation[] = [
      ...missing.map((s) => ({ seam: 'S-35', file: 'build/exports.manifest.json', detail: `ENTRIES subpath ${s} missing from the generated manifest` })),
      ...extra.map((s) => ({ seam: 'S-35', file: 'build/exports.manifest.json', detail: `manifest subpath ${s} is not in ENTRIES` })),
    ];
    for (const m of manifest.entries) {
      const e = ENTRIES.find((x) => x.subpath === m.subpath);
      if (e && !e.source.startsWith('build:') && m.source !== e.source) v.push({ seam: 'S-35', file: 'build/exports.manifest.json', detail: `${m.subpath} source ${m.source} != ENTRIES source ${e.source}` });
    }
    conform(SUITE, 'manifest', v);
  });

  it('every source module exists on disk (or is a build: pseudo-source)', () => {
    const v = ENTRIES
      .filter((e) => !e.source.startsWith('build:'))
      .filter((e) => !existsSync(join(ROOT, e.source)))
      .map((e) => ({ v: entryViolation(e, `source module ${e.source} does not exist`), ga: e.ga }));
    conformByDue('source-exists', v);
  });

  it('listed exports are emitted by their source barrels', () => {
    const v: Array<{ v: Violation; ga: string }> = [];
    let loaded = 0;
    for (const e of ENTRIES) {
      if (e.source.startsWith('build:') || e.source === 'package.json' || !existsSync(join(ROOT, e.source))) continue;
      /* Macro lists name a derived set: @see ROOT_EXPORTS is checked here; @glyphs (icon names) and
         @union (compat union) are generated sets checked against the barrel's own export count. */
      const names = e.exports.flatMap((n) => (n === '@see ROOT_EXPORTS' ? [...ROOT_EXPORTS.cmp, ...ROOT_EXPORTS.surf, ...ROOT_EXPORTS.mat] : [n]));
      let mod: Record<string, unknown>;
      try {
        mod = require(join(ROOT, e.source)) as Record<string, unknown>;
      } catch (err) {
        v.push({ v: entryViolation(e, `barrel fails to load: ${(err as Error).message.split('\n')[0]}`), ga: e.ga });
        continue;
      }
      loaded += 1;
      const keys = new Set(Object.keys(mod));
      for (const n of names.filter((x) => x.startsWith('@'))) {
        if (keys.size === 0) v.push({ v: entryViolation(e, `${n}: barrel exports nothing`), ga: e.ga });
      }
      const missing = names.filter((n) => !n.startsWith('@') && !keys.has(n));
      if (missing.length) v.push({ v: entryViolation(e, `missing named exports: ${missing.join(', ')}`), ga: e.ga });
    }
    expect(loaded).toBeGreaterThan(5);
    conformByDue('exports', v);
  });
});
