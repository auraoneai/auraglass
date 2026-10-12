/* @jest-environment node */
/* Structural cascade checks for the floor- and state-bearing rules of the
   material engine (source CSS, no build):
   - REQ-MAT-09: hover/press floor lifts reach rendering — every generated floor
     row and every rung that writes --_ag-tint-floor carries the
     var(--_ag-floor-lift, 0) term; every state has a contrast=more and a
     forced-colours row.
   - REQ-MAT-10: material.css hand-writes no floor: no numeric --_ag-tint-floor,
     no numeric fallback on a floor var, and every floor var it reads is emitted
     by generated/floors.css.
   - REQ-MAT-31: overlay-open, expanded and full-height read the solved
     companion rows and out-specify every generated floor row; the expanded row
     is one thickness row up; the modal scrim reads the scrim.modal token.
   - REQ-MAT-29: glyphs follow the fill — under every declared backdrop
     --_ag-on-surface is the scheme ink, and the floors are solved per declared
     backdrop so that ink passes over each one.
   - REQ-MAT-32: contrast=more forces saturation 1 (material.css + both rungs).
   Rendering is the remote L5 lane's job (tests/e2e/mat/material/**). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss, { type AtRule, type Declaration, type Rule } from 'postcss';

const ROOT = join(__dirname, '..', '..');
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const MATERIAL = read('src/material/css/material.css');
const FLOORS = read('src/material/css/generated/floors.css');
const RUNGS = read('src/a11y/css/rungs.css');
const ENV = JSON.parse(read('tokens/sys/environment.tokens.json'));
const MAT_TOKENS = JSON.parse(read('tokens/material/material.tokens.json'));

const flat = (s: string) => s.replace(/\s+/g, ' ').trim();
const LIFT_RE = /^calc\((?:\d+(?:\.\d+)?|var\(--_ag-tint-floor-[a-z-]+\)) \+ var\(--_ag-floor-lift, 0\)\)$/;
const BOOST = ':is([data-ag-variant][data-ag-thickness][data-ag-tier][data-disabled], *)';

type Found = { selector: string; value: string; media: string[] };
const declsIn = (css: string, prop: string | RegExp): Found[] => {
  const out: Found[] = [];
  postcss.parse(css).walkDecls(prop, (d: Declaration) => {
    const media: string[] = [];
    for (let p = d.parent?.parent; p && p.type !== 'root'; p = p.parent as typeof p) {
      if (p.type === 'atrule' && (p as AtRule).name === 'media') media.push(flat((p as AtRule).params));
    }
    out.push({ selector: flat((d.parent as Rule).selector ?? ''), value: flat(d.value), media });
  });
  return out;
};
const rulesIn = (css: string): Array<{ selector: string; decls: Record<string, string>; media: string[] }> => {
  const out: Array<{ selector: string; decls: Record<string, string>; media: string[] }> = [];
  postcss.parse(css).walkRules((r: Rule) => {
    const media: string[] = [];
    for (let p = r.parent; p && p.type !== 'root'; p = p.parent as typeof p) {
      if (p.type === 'atrule' && (p as AtRule).name === 'media') media.push(flat((p as AtRule).params));
    }
    const decls: Record<string, string> = {};
    r.each((n) => { if (n.type === 'decl') decls[n.prop] = flat(n.value); });
    out.push({ selector: flat(r.selector), decls, media });
  });
  return out;
};

/** floors.css base row value for a thickness with no condition, no backdrop. */
const baseRow = (th: string) => {
  const r = rulesIn(FLOORS).find((x) => x.media.length === 0 && x.selector === `[data-ag-surface][data-ag-thickness="${th}"]`);
  expect(r).toBeDefined();
  return r!.decls;
};
const num = (v: string) => Number(/^calc\((\d+(?:\.\d+)?) \+/.exec(v)?.[1] ?? v);

describe('REQ-MAT-09 floor lift reaches rendering', () => {
  it('every generated --_ag-tint-floor row is the solved value plus the state lift', () => {
    const rows = declsIn(FLOORS, '--_ag-tint-floor');
    expect(rows.length).toBeGreaterThanOrEqual(80);
    expect(rows.filter((r) => !LIFT_RE.test(r.value)).map((r) => `${r.selector}: ${r.value}`)).toEqual([]);
  });

  it('every rung that writes --_ag-tint-floor keeps the lift term', () => {
    const rows = declsIn(RUNGS, '--_ag-tint-floor');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.filter((r) => !LIFT_RE.test(r.value)).map((r) => `${r.selector}: ${r.value}`)).toEqual([]);
  });

  it('hover and press set the lift from the interaction tokens; the host resets it', () => {
    const lifts = declsIn(MATERIAL, '--_ag-floor-lift');
    expect(lifts.find((l) => l.selector === ':where([data-ag-surface])')?.value).toBe('0');
    expect(lifts.some((l) => l.selector.includes(':hover') && l.value === 'var(--_ag-state-hover-floor)')).toBe(true);
    expect(lifts.some((l) => l.selector.includes('[data-pressed]') && l.value === 'var(--_ag-state-press-floor)')).toBe(true);
  });

  it('fails when a generated row drops the lift (failing fixture)', () => {
    const broken = FLOORS.replace('calc(0.88 + var(--_ag-floor-lift, 0))', '0.88');
    expect(declsIn(broken, '--_ag-tint-floor').filter((r) => !LIFT_RE.test(r.value)).length).toBeGreaterThan(0);
  });
});

describe('REQ-MAT-09 every state has a contrast=more and a forced-colours row', () => {
  const rules = rulesIn(MATERIAL);
  const STATES: Record<string, RegExp> = {
    hover: /:hover/,
    press: /\[data-pressed\]|:active/,
    selected: /\[data-selected\]|\[aria-selected="true"\]/,
    disabled: /\[data-disabled\]|\[aria-disabled="true"\]|:disabled/,
    loading: /\[data-loading\]|\[aria-busy="true"\]/,
    dragging: /\[data-dragging\]/,
    'drop-target': /\[data-drop-target\]/,
  };
  const SYSTEM = /\b(Highlight|HighlightText|GrayText)\b/;
  for (const [state, re] of Object.entries(STATES)) {
    it(`${state}: forced-colours row uses Highlight/HighlightText/GrayText`, () => {
      const fc = rules.filter((r) => r.media.includes('(forced-colors: active)') && re.test(r.selector));
      expect(fc.some((r) => Object.values(r.decls).some((v) => SYSTEM.test(v)))).toBe(true);
    });
    if (state === 'disabled') continue; // disabled under contrast=more keeps the 3:1 ink row (rungs.css disabled row)
    it(`${state}: contrast=more row is an outline/rim form`, () => {
      const more = rules.filter((r) => r.selector.includes('data-ag-contrast="more"') && re.test(r.selector));
      expect(more.some((r) => 'outline' in r.decls || '--_ag-rim-width' in r.decls)).toBe(true);
    });
  }
});

describe('REQ-MAT-10 no hand-written floor in material.css', () => {
  const floorVarsEmitted = new Set([...FLOORS.matchAll(/(--_ag-(?:tint-floor[a-z-]*|floor-alpha))\s*:/g)].map((m) => m[1]));

  it('no numeric --_ag-tint-floor and no numeric fallback on a floor var', () => {
    const writes = declsIn(MATERIAL, '--_ag-tint-floor');
    expect(writes.filter((w) => /^\d/.test(w.value))).toEqual([]);
    expect(MATERIAL.match(/var\(\s*--_ag-(?:tint-floor|tinted-floor|floor-alpha)[a-z-]*\s*,\s*\d/g) ?? []).toEqual([]);
  });

  it('every floor var material.css reads is emitted by generated/floors.css', () => {
    const read = new Set([...MATERIAL.matchAll(/var\(\s*(--_ag-(?:tint-floor[a-z-]*|floor-alpha[a-z-]*))\s*[,)]/g)].map((m) => m[1]));
    expect(read.size).toBeGreaterThan(0);
    expect([...read].filter((v) => !floorVarsEmitted.has(v))).toEqual([]);
  });

  it('the check fails on the old literal fallback (failing fixture)', () => {
    const broken = `${MATERIAL}\n[data-ag-surface][data-x] { --_ag-tint-floor: var(--_ag-tinted-floor, 0.85); }`;
    expect(broken.match(/var\(\s*--_ag-(?:tint-floor|tinted-floor|floor-alpha)[a-z-]*\s*,\s*\d/g)?.length).toBe(1);
  });
});

describe('REQ-MAT-31 overlay / expanded / full-height / scrim', () => {
  const writes = declsIn(MATERIAL, '--_ag-tint-floor');
  const row = (attr: RegExp) => writes.filter((w) => attr.test(w.selector));

  it.each([
    ['overlay open', /\[data-ag-layer="overlay"\]\[data-open\]/, '--_ag-tint-floor-overlay'],
    ['expanded', /\[data-expanded\]/, '--_ag-tint-floor-expanded'],
    ['full-height', /\[data-ag-full-height\]|\[data-ag-appearance="full-height"\]/, '--_ag-tint-floor-full-height'],
  ])('%s reads the solved companion row with the lift and out-specifies every floor row', (_n, attr, companion) => {
    const rows = row(attr);
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(r.value).toBe(`calc(var(${companion}) + var(--_ag-floor-lift, 0))`);
      for (const sel of r.selector.split(/,(?![^(]*\))/)) expect(sel).toContain(BOOST);
    }
  });

  it('the expanded companion is one thickness row up and never below the row', () => {
    const thin = baseRow('thin'); const regular = baseRow('regular'); const thick = baseRow('thick');
    const v = (d: Record<string, string>, k: string) => num(d[k]!);
    expect(v(thick, '--_ag-tint-floor-expanded')).toBe(v(regular, '--_ag-tint-floor'));
    expect(v(regular, '--_ag-tint-floor-expanded')).toBe(v(thin, '--_ag-tint-floor'));
    expect(v(thick, '--_ag-tint-floor-expanded')).toBeGreaterThan(v(thick, '--_ag-tint-floor'));
    expect(v(thin, '--_ag-tint-floor-expanded')).toBeGreaterThanOrEqual(v(thin, '--_ag-tint-floor'));
    for (const r of rulesIn(FLOORS).filter((x) => '--_ag-tint-floor-expanded' in x.decls)) {
      expect(num(r.decls['--_ag-tint-floor-expanded']!)).toBeGreaterThanOrEqual(num(r.decls['--_ag-tint-floor']!));
      expect(num(r.decls['--_ag-tint-floor-full-height']!)).toBeGreaterThanOrEqual(num(r.decls['--_ag-tint-floor']!));
      expect(num(r.decls['--_ag-tint-floor-overlay']!)).toBeGreaterThanOrEqual(num(r.decls['--_ag-tint-floor']!));
    }
  });

  it('the modal scrim paints the scrim ink at the scrim.modal token alpha', () => {
    const [scrim] = declsIn(MATERIAL, 'background').filter((d) => d.selector === '[data-ag-layer="scrim"]');
    expect(scrim?.value).toBe('oklch(from var(--ag-scrim-media) l c h / var(--_ag-scrim-modal))');
    const modal = ENV.sys.environment.scrim.modal;
    expect(modal.$extensions['ag.cssVar']).toBe('--_ag-scrim-modal');
    expect(modal.$value).toBe(MAT_TOKENS.material.material.$value.scrim.modal);
  });
});

describe('REQ-MAT-29 glyphs follow the fill under every declared backdrop', () => {
  it('[data-ag-backdrop] resolves --_ag-on-surface to the scheme ink, never a fixed light/dark glyph', () => {
    const inks = declsIn(MATERIAL, /^--_ag-on-surface(-muted)?$/).filter((d) => d.selector.includes('data-ag-backdrop'));
    expect(inks.map((d) => d.value).sort()).toEqual(['var(--ag-color-on-surface)', 'var(--ag-color-on-surface-muted)']);
    // no backdrop-specific rule overrides the ink
    for (const bd of ['light', 'dark', 'media'])
      expect(inks.filter((d) => d.selector.includes(`[data-ag-backdrop="${bd}"]`))).toEqual([]);
  });

  it('the floors are solved per declared backdrop, so the scheme ink passes over each', () => {
    for (const bd of ['light', 'dark', 'media'])
      expect(FLOORS).toContain(`[data-ag-backdrop="${bd}"]`);
  });
});

describe('REQ-MAT-32 contrast=more forces saturation 1', () => {
  it('material.css and both rungs.css contrast=more blocks set --_ag-saturation: 1', () => {
    const mat = declsIn(MATERIAL, '--_ag-saturation').filter((d) => d.selector.includes('data-ag-contrast="more"'));
    expect(mat.map((d) => d.value)).toEqual(['1']);
    const rung = declsIn(RUNGS, '--_ag-saturation');
    expect(rung.filter((d) => d.selector.includes('data-ag-contrast="more"') && d.value === '1')).toHaveLength(1);
    expect(rung.filter((d) => d.media.includes('(prefers-contrast: more)') && d.value === '1')).toHaveLength(1);
  });
});
