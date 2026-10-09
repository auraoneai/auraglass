/* @jest-environment node */
/* PLAT-271: zero forwardRef identifiers in dist js + d.ts; zero LegacyRef /
   MutableRefObject in public ref types; zero argument-less useRef<T>();
   zero `.ref` reads on ReactElement in src; floor imports clean. Violations
   outside PLAT-owned paths are reported only. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, SRC, ensureBuilt, walk } from '../build/helpers';

const PLAT_OWNED = /^(src\/(internal|contracts|tokens|compat)|scripts\/(build|ci)|build\/|dist\/)/;

describe('react 19 rules (PLAT-271)', () => {
  it('0 forwardRef identifiers in dist', () => {
    ensureBuilt();
    const hits = walk(DIST, p => /\.(js|d\.ts)$/.test(p))
      .filter(f => /\bforwardRef\b/.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  }, 120_000);

  it('0 LegacyRef/MutableRefObject in dist d.ts', () => {
    const hits = walk(DIST, p => p.endsWith('.d.ts'))
      .filter(f => /\b(LegacyRef|MutableRefObject)\b/.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });

  it('0 argument-less useRef<T>() in all of src', () => {
    const hits = walk(SRC, p => /\.tsx?$/.test(p))
      .filter(f => /useRef\s*(?:<[^>]+>)?\s*\(\s*\)/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''));
    expect(hits).toEqual([]);
  });

  it('0 .ref reads on ReactElement in all of src', () => {
    /* element.ref is the React ≤18 API (a getter on the element instance).
       React 19 moves ref onto props: `x.props.ref` / `props.ref` /
       `merged.ref` (plain-object writes) are the sanctioned reads. Data
       fields coincidentally named ref (e.g. chunk.ref) are not element
       reads either. */
    const LEGAL = /\b\w*(props|Props|merged|chunk)\b\.ref\b/;
    const hits: string[] = [];
    for (const f of walk(SRC, p => /\.tsx?$/.test(p))) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(/\b\w+\.ref\b(?!\s*=)/g)) {
        if (LEGAL.test(m[0])) continue;
        const rel = f.replace(`${ROOT}/`, '');
        hits.push(`${rel}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('no feature-detected react imports (unstable_ViewTransition & co.) in src or dist', () => {
    const scan = (dir: string) => walk(dir, p => /\.(js|ts|tsx|d\.ts)$/.test(p))
      .filter(f => /unstable_ViewTransition|experimental_useEffectEvent|unstable_getCacheForType/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''));
    expect([...scan(SRC), ...scan(DIST)]).toEqual([]);
  });
});
