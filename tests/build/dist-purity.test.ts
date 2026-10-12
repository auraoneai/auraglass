/* @jest-environment node */
/* REQ-PLAT-65: dist contains only build outputs — no src seeds, fixtures,
   test files, or scratch artifacts — and every emitted module's top level is
   tree-shakeable: only import/export and declarations whose initialiser is a
   literal, a function, an alias or a /*#__PURE__*\/ call (incl. a pure-annotated
   Object.assign(C, { displayName })); every top-level memo(/createContext( and
   new X( is pure-annotated; 0 `X.displayName =` assignments. Statements are read
   with the TypeScript compiler API (tests/build/ts-graph.ts). The remaining
   offenders are the shrink-only list in tests/build/dist-purity-debt.json. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';
import { impureTopLevel, unannotatedTopLevelCalls } from './ts-graph';

const DEBT = (JSON.parse(readFileSync(join(ROOT, 'tests/build/dist-purity-debt.json'), 'utf8')) as {
  entries: Record<string, string[]>;
}).entries;
const debtKeys = new Set(Object.entries(DEBT).flatMap(([f, ks]) => ks.map((k) => `${f}: ${k}`)));

describe('dist top-level purity (REQ-PLAT-65)', () => {
  const scan = () => {
    ensureBuilt();
    return walk(DIST, (p) => p.endsWith('.js')).flatMap((f) => impureTopLevel(f).map((k) => `${relative(ROOT, f)}: ${k}`));
  };

  it('no emitted module has an impure top-level statement outside the recorded debt', () => {
    expect(scan().filter((k) => !debtKeys.has(k))).toEqual([]);
  });

  it('the debt list is shrink-only: every recorded entry still occurs (delete fixed entries)', () => {
    const now = new Set(scan());
    expect([...debtKeys].filter((k) => !now.has(k))).toEqual([]);
  });

  it('the debt holds only expando assignments and the REQ-MAT-50 peer start, never a new kind', () => {
    const kinds = [...debtKeys].filter((k) => !/: [A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]* =$/.test(k) && !/^dist\/motion\/adapter\/entry\.js: startMotionPeer\($/.test(k));
    expect(kinds).toEqual([]);
  });

  it('every top-level memo(, createContext( and new X( is pure-annotated', () => {
    ensureBuilt();
    const bad = walk(DIST, (p) => p.endsWith('.js')).flatMap((f) =>
      unannotatedTopLevelCalls(f, /^(?:(?:React\.)?(?:memo|createContext|forwardRef|lazy)|new [A-Z]\w*)$/).map((s) => `${relative(ROOT, f)}: ${s}`));
    expect(bad).toEqual([]);
  });
});

describe('dist-purity', () => {
  it('no test/fixture/seed artifacts under dist', () => {
    ensureBuilt();
    const bad = walk(DIST, (p) =>
      /\.(test|spec)\.(js|ts)|__tests__|fixtures|\.seed\.|\.bak$|\.tmp$/.test(p));
    expect(bad).toEqual([]);
  });
  it('no emitted file references the seed contract module', () => {
    ensureBuilt();
    const seeded = walk(DIST, (p) => p.endsWith('.js')).filter((p) =>
      readFileSync(p, 'utf8').includes('@ag-contract-seed'));
    expect(seeded).toEqual([]);
  });
});

describe('seed-skipped entries are reported (REQ-PLAT-65)', () => {
  it('generate-exports --list-entries prints every pending entry with a reason', () => {
    const out = execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries'], {
      cwd: ROOT, encoding: 'utf8',
    });
    /* REQ-FIN-06 (cc300eb93/7d133756e): the report is the "excluded entries:" section
       (seed closure, missing source or ga gate); one "<subpath>  <reason>" row per entry. */
    const section = out.split('excluded entries:')[1] ?? '';
    expect(section).not.toBe('');
    const lines = section.split('\n').filter((l) => /^ {2}\.(\/|\s|$)/.test(l));
    const json = JSON.parse(execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries', '--json'], {
      cwd: ROOT, encoding: 'utf8',
    })) as { excluded: { subpath: string }[] };
    // every excluded entry is printed — never a silent drop
    expect(lines.map((l) => l.trim().split(/\s+/)[0])).toEqual(json.excluded.map((x) => x.subpath));
    const noReason = lines.filter((l) => !/import graph contains|missing source|ga:'[^']+' > /.test(l));
    expect(noReason).toEqual([]);
    expect(lines.filter((l) => l.includes('[STALE'))).toEqual([]);
  });
});
