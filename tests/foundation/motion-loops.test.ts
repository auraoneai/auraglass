/* @jest-environment node */
/* REQ-CMP-18 (REQ-FIN-70): static half of the CMP motion contract, parsed
   with postcss over every CMP-owned component stylesheet.
   - "No CMP component has a loop": `infinite` appears only on Skeleton's
     shimmer, and only under [data-ag-continuous="on"].
   - "none reads allowContinuous except Skeleton shimmer": no other CMP
     selector mentions data-ag-continuous.
   - Spinners (any animation whose @keyframes rotates) are static by default
     and under calm/none: they run only under [data-ag-motion='full'], with a
     finite iteration count and a MOTION_CSS_VARS duration other than
     --ag-duration-ambient (ambient is the continuous-effects token).
   - --ag-ease-spring (not in MOTION_CSS_VARS) is never referenced.
   The computed-style half (transitionProperty ⊆ ANIMATABLE, transform
   identity at hover/press, no running animation at rest, across
   full/calm/none) is tests/e2e/cmp/motion.spec.ts, remote lane only. */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import postcss, { type Declaration, type Node, type Rule } from 'postcss';
import { MOTION_CSS_VARS } from '../../src/contracts/motion';

function* walk(dir: string): Generator<string> {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p.replace(/\\/g, '/');
  }
}

/* CMP-owned files by contracts/ownership.json (first matching glob wins),
   resolved the same way as tests/foundation/css-contract.test.ts. */
type OwnershipRow = { glob: string; owner: string };
const OWNERSHIP: OwnershipRow[] = JSON.parse(readFileSync('contracts/ownership.json', 'utf8')).rows;
const globRe = (g: string) =>
  new RegExp(
    '^' +
      g
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '\u0000')
        .replace(/\*/g, '[^/]*')
        .replace(/\u0000/g, '.*') +
      '$',
  );
const OWNER_RES = OWNERSHIP.map((r) => ({ re: globRe(r.glob), owner: r.owner }));
const ownerOf = (f: string) => OWNER_RES.find((r) => r.re.test(f))?.owner ?? 'NONE';
const FILES = [...walk('src/components'), ...walk('src/icons'), ...walk('src/primitives')].filter(
  (f) => ownerOf(f) === 'CMP',
);
const SKELETON = 'src/components/skeleton/Skeleton.css';

const CONTINUOUS = /\[\s*data-ag-continuous\s*=\s*(?:"on"|'on'|on)\s*\]/;
const MOTION_FULL = /^\s*\[\s*data-ag-motion\s*=\s*(?:"full"|'full'|full)\s*\]/;

const parse = (f: string) => postcss.parse(readFileSync(f, 'utf8'), { from: f });
const enclosingRule = (n: Node): Rule | null => {
  for (let p = n.parent as Node | undefined; p; p = p.parent as Node | undefined) {
    if (p.type === 'rule') return p as Rule;
  }
  return null;
};
const where = (f: string, d: Declaration) => `${f}:${d.source?.start?.line ?? 0}`;

/** Names of @keyframes in this file whose frames rotate (spinners). */
const rotatingKeyframes = (root: postcss.Root): Set<string> => {
  const names = new Set<string>();
  root.walkAtRules(/keyframes$/i, (at) => {
    let rotates = false;
    at.walkDecls((d) => {
      if ((d.prop === 'transform' && /rotate/.test(d.value)) || d.prop === 'rotate') rotates = true;
    });
    if (rotates) names.add(at.params.trim());
  });
  return names;
};
/* keyframes are global: a spinner may use keyframes declared in another CMP file */
const SPIN_KEYFRAMES = new Set(FILES.flatMap((f) => [...rotatingKeyframes(parse(f))]));

describe('CMP motion loops (REQ-CMP-18)', () => {
  it('walks the CMP stylesheets, including every spinner owner', () => {
    expect(FILES).toEqual(
      expect.arrayContaining([
        'src/components/button/Button.css',
        'src/components/combobox/Combobox.css',
        'src/components/progress/Progress.css',
        'src/components/search-field/SearchField.css',
        'src/components/state-view/StateView.css',
        SKELETON,
      ]),
    );
    expect(SPIN_KEYFRAMES.size).toBeGreaterThanOrEqual(4);
  });

  it('`infinite` appears only on the Skeleton shimmer, gated on [data-ag-continuous="on"]', () => {
    const bad: string[] = [];
    let skeletonLoops = 0;
    for (const f of FILES) {
      parse(f).walkDecls(/^animation(-iteration-count)?$/, (d) => {
        if (!/\binfinite\b/.test(d.value)) return;
        const rule = enclosingRule(d);
        const gated = !!rule && rule.selectors.every((s) => CONTINUOUS.test(s));
        if (f === SKELETON && gated) skeletonLoops += 1;
        else bad.push(where(f, d));
      });
    }
    expect(bad).toEqual([]);
    expect(skeletonLoops).toBeGreaterThan(0);
  });

  it('only Skeleton reads allowContinuous ([data-ag-continuous])', () => {
    const bad: string[] = [];
    for (const f of FILES) {
      if (f === SKELETON) continue;
      parse(f).walkRules((r) => {
        if (/data-ag-continuous/.test(r.selector)) bad.push(`${f}:${r.source?.start?.line ?? 0}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('spinners are static by default and spin finitely only under [data-ag-motion=full]', () => {
    const bad: string[] = [];
    let gatedSpins = 0;
    for (const f of FILES) {
      parse(f).walkDecls(/^animation(-name)?$/, (d) => {
        const names = d.value.split(',').map((leg) => leg.trim().split(/\s+/));
        const spin = names.find((tokens) => tokens.some((t) => SPIN_KEYFRAMES.has(t)));
        if (!spin) return;
        const rule = enclosingRule(d);
        if (!rule || !rule.selectors.every((s) => MOTION_FULL.test(s))) {
          bad.push(`${where(f, d)} spinner animates outside [data-ag-motion='full']`);
          return;
        }
        if (d.prop === 'animation') {
          const count = spin.find((t) => /^\d+(\.\d+)?$/.test(t));
          if (!count || !(Number(count) > 0)) bad.push(`${where(f, d)} spinner needs a finite iteration count`);
          const duration = spin.find((t) => /^var\(--ag-duration-/.test(t));
          const dvar = duration?.replace(/^var\((--[\w-]+)\)$/, '$1');
          if (!dvar || !(MOTION_CSS_VARS as readonly string[]).includes(dvar) || dvar === '--ag-duration-ambient') {
            bad.push(`${where(f, d)} spinner duration must be a MOTION_CSS_VARS duration other than ambient`);
          }
        }
        gatedSpins += 1;
      });
    }
    expect(bad).toEqual([]);
    // Button, Combobox, Progress ring, SearchField, StateView
    expect(gatedSpins).toBeGreaterThanOrEqual(5);
  });

  it('never references --ag-ease-spring (not in MOTION_CSS_VARS)', () => {
    expect(MOTION_CSS_VARS as readonly string[]).not.toContain('--ag-ease-spring');
    const bad: string[] = [];
    for (const f of FILES) {
      parse(f).walkDecls((d) => {
        if (/--ag-ease-spring\b/.test(d.value)) bad.push(where(f, d));
      });
    }
    expect(bad).toEqual([]);
  });
});
