/* @jest-environment node */
/* REQ-FIN-37 / REQ-PLAT-72 (PLAT-271): no forwardRef anywhere in src/ or in
   the emitted dist (js + d.ts). No stream path filter: every file of src/ is
   scanned. Files other WPs still have to convert (CMP-03 under REQ-FIN-70,
   SURF-10 under REQ-FIN-80, AuraGlassProvider under REQ-FIN-04) are rows of
   the expiring baseline scripts/integration/baselines/react19.json (rule
   "forwardRef"); a new offender, a stale row or a malformed row fails. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import {
  BASELINE_REL, countForwardRefIdentifiers, diffBaseline, forwardRefOffenders,
  loadBaseline, rowsFor, srcCounterpart,
} from '../../scripts/ci/lib/react19-gate.mjs';

const rel = (f: string) => f.replace(`${ROOT}/`, '');

describe('react 19: no forwardRef (REQ-PLAT-72)', () => {
  it('counts forwardRef identifiers in code, not in comments or strings', () => {
    expect(countForwardRefIdentifiers('a.tsx', "/* no forwardRef here */ const s = 'forwardRef';")).toBe(0);
    expect(countForwardRefIdentifiers('a.tsx',
      "import * as React from 'react'; export const A = React.forwardRef<HTMLDivElement, {}>((p, ref) => <div ref={ref} />);"))
      .toBe(1);
    expect(countForwardRefIdentifiers('a.ts', "import { forwardRef } from 'react'; export const B = forwardRef(() => null);")).toBe(2);
  });

  it('baseline diff flags new offenders, raised counts, stale rows and malformed rows', () => {
    const row = { rule: 'forwardRef', file: 'src/a.tsx', count: 2, owner: 'FIN-E', reqFin: 'REQ-FIN-70', expires: 'RC-1' };
    expect(diffBaseline('forwardRef', new Map([['src/a.tsx', 2]]), [row]))
      .toEqual({ fresh: [], stale: [], malformed: [] });
    expect(diffBaseline('forwardRef', new Map([['src/a.tsx', 3], ['src/b.tsx', 1]]), [row]).fresh)
      .toEqual(['src/a.tsx (3 > baseline 2)', 'src/b.tsx (1, no baseline row)']);
    expect(diffBaseline('forwardRef', new Map([['src/a.tsx', 1]]), [row]).stale).toEqual(['src/a.tsx (baseline 2, now 1)']);
    expect(diffBaseline('forwardRef', new Map(), [row]).stale).toEqual(['src/a.tsx (baseline 2, now 0)']);
    expect(diffBaseline('forwardRef', new Map(), [{ ...row, expires: '5.1.0' }]).malformed).toHaveLength(1);
    expect(diffBaseline('forwardRef', new Map(), [{ ...row, owner: 'CMP' }]).malformed).toHaveLength(1);
  });

  it('0 forwardRef in src/ beyond the expiring baseline', () => {
    const offenders = forwardRefOffenders(ROOT);
    const { fresh, stale, malformed } = diffBaseline('forwardRef', offenders, loadBaseline(ROOT));
    if (fresh.length || stale.length || malformed.length) {
      console.error(`current forwardRef rows for ${BASELINE_REL}:\n${JSON.stringify(rowsFor('forwardRef', offenders), null, 2)}`);
    }
    expect(malformed).toEqual([]);
    expect(fresh).toEqual([]); // new forwardRef use(s): convert to the React 19 ref-as-prop form
    expect(stale).toEqual([]); // converted files: lower or remove their baseline rows
  });

  it('0 forwardRef identifiers in dist js + d.ts outside baselined src files', () => {
    ensureBuilt();
    const covered = new Set(loadBaseline(ROOT).filter(r => r.rule === 'forwardRef').map(r => r.file));
    const hits = walk(DIST, p => /\.(js|d\.ts)$/.test(p))
      .filter(f => /\bforwardRef\b/.test(readFileSync(f, 'utf8')))
      .filter(f => {
        const src = srcCounterpart(ROOT, f);
        return !(src && covered.has(rel(src)));
      })
      .map(rel);
    expect(hits).toEqual([]);
  }, 300_000);
});
