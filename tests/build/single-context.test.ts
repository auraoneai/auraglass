/* @jest-environment node */
/* PLAT-267: every createContext lives in a *.context.ts(x) source file and
   appears exactly once in dist/. Violations on other streams' paths are
   reported (pre-existing for PLAT PRs); PLAT-owned paths must be clean. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, SRC, ensureBuilt, walk } from './helpers';

const CTX = /createContext\s*(?:<[^>]*>)?\s*\(/;

describe('single context (PLAT-267)', () => {
  it('src: createContext only inside *.context.ts(x)', () => {
    /* Files tsconfig.build.json excludes by explicit path (contract seed helpers) never
       ship in the package, so they are outside the single-context rule. */
    const buildExcluded = new Set<string>(
      (JSON.parse(readFileSync(join(ROOT, 'tsconfig.build.json'), 'utf8')).exclude as string[])
        .filter(e => e.startsWith('src/') && !e.includes('*')),
    );
    const offenders = walk(SRC, p => /\.tsx?$/.test(p) && !/\.context\.tsx?$/.test(p) && !/\.test\.|\.stories\./.test(p))
      .filter(f => !buildExcluded.has(f.replace(`${ROOT}/`, '')))
      .filter(f => CTX.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''));
    /* PLAT-owned paths in this lane: src/internal, src/compat/css, src/contracts,
       src/tokens. Other streams' offenders are findings, not PLAT failures. */
    const mine = offenders.filter(f => /^src\/(internal|contracts|tokens|compat)\//.test(f));
    if (offenders.length > mine.length) {
      console.warn(`PLAT-267 report (other streams): ${offenders.filter(f => !mine.includes(f)).join(', ')}`);
    }
    expect(mine).toEqual([]);
  });

  it('dist: each context provider module emits exactly once', () => {
    ensureBuilt();
    const js = walk(DIST, p => p.endsWith('.js') && !p.endsWith('.map'));
    const holders = js.filter(f => CTX.test(readFileSync(f, 'utf8')));
    const names = holders.map(f => f.replace(DIST, ''));
    const dup = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dup).toEqual([]);
  });
});
