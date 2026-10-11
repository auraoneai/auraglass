// REQ-SURF-193 (REQ-FIN-90): static half of the SURF focus gate. The browser
// half is tests/e2e/surf/focus.spec.ts (L5, remote).
//  1. `outline: none|0` in SURF CSS only survives on a selector that also has
//     a `:focus-visible` replacement painting an outline from the MAT focus
//     tokens (acceptance: `rg -n 'outline:\s*none' src/{date,charts,data,
//     media,ai,app-shell}` hits only rules with a :focus-visible replacement).
//  2. Every keyboard-focusable date and chart part carries the MAT ring
//     (src/a11y/css/focus.css values: outline from --_ag-focus-width +
//     --_ag-focus-outer, inner box-shadow from --_ag-focus-inner).
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss, { type Rule } from 'postcss';

const ROOT = process.cwd();
const SURF_DIRS = ['src/date', 'src/charts', 'src/data', 'src/media', 'src/ai', 'src/app-shell'];

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}

interface Decls { outline?: string; boxShadow?: string; outlineNone: boolean }

/** selector -> merged declarations, across every rule in the file set. */
function collect(files: string[]): Map<string, Decls> {
  const out = new Map<string, Decls>();
  for (const file of files) {
    const root = postcss.parse(readFileSync(file, 'utf8'), { from: file });
    root.walkRules((rule: Rule) => {
      for (const raw of rule.selectors) {
        const sel = raw.replace(/\s+/g, ' ').trim();
        const d = out.get(sel) ?? { outlineNone: false };
        rule.walkDecls((decl) => {
          if (decl.parent !== rule) return;
          const prop = decl.prop.toLowerCase();
          const value = decl.value.trim();
          if (prop === 'outline' || prop === 'outline-style') {
            if (/^(none|0)$/i.test(value)) d.outlineNone = true;
            else if (prop === 'outline') d.outline = value;
          }
          if (prop === 'box-shadow') d.boxShadow = value;
        });
        out.set(sel, d);
      }
    });
  }
  return out;
}

const isMatOutline = (v: string | undefined) =>
  !!v && /var\(--_ag-focus-width\b/.test(v) && /\bsolid\b/.test(v) && /var\(--_ag-focus-outer\b/.test(v);
const isMatInner = (v: string | undefined) =>
  !!v && /var\(--_ag-focus-width\b/.test(v) && /var\(--_ag-focus-inner\b/.test(v);

const files = SURF_DIRS.flatMap((d) => [...walk(join(ROOT, d))]);
const rules = collect(files);

describe('SURF focus ring CSS (REQ-SURF-193)', () => {
  it('scans the SURF CSS set', () => {
    expect(files.map((f) => relative(ROOT, f)).sort()).toEqual(
      expect.arrayContaining(['src/charts/charts.css', 'src/date/date.css']),
    );
  });

  it('every outline:none rule has a :focus-visible replacement painting the focus tokens', () => {
    const offenders: string[] = [];
    for (const [sel, d] of rules) {
      if (!d.outlineNone || /:focus-visible/.test(sel)) continue;
      const replacement = rules.get(`${sel}:focus-visible`);
      if (!replacement || !isMatOutline(replacement.outline)) offenders.push(sel);
    }
    expect(offenders).toEqual([]);
  });

  it('no :focus-visible or focus-attribute rule removes the outline', () => {
    const offenders = [...rules]
      .filter(([sel, d]) => d.outlineNone && /:focus-visible|\[data-focus(ed|-visible)\]/.test(sel))
      .map(([sel]) => sel);
    expect(offenders).toEqual([]);
  });

  const MAT_RING_SELECTORS = [
    '.ag-date-field__segment:focus-visible',
    '.ag-date-field__segment[data-focused]',
    '.ag-date-picker__trigger:focus-visible',
    '.ag-date-picker__trigger[data-focus-visible]',
    '.ag-calendar__nav:focus-visible',
    '.ag-calendar__nav[data-focus-visible]',
    '.ag-calendar__cell:focus-visible',
    '.ag-calendar__cell[data-focus-visible]',
    '.ag-date-range-picker__preset:focus-visible',
    '.ag-date-range-picker__preset[data-focus-visible]',
    '.ag-time-picker__option:focus-visible',
    '.ag-time-picker__option[data-focus-visible]',
    '.ag-chart__svg:focus-visible',
    '.ag-tree__item:focus-visible',
    '.ag-tree__item[data-focused]',
    '.ag-image-viewer:focus-visible',
  ];
  it.each(MAT_RING_SELECTORS)('%s paints the MAT ring (outer outline + inner shadow)', (sel) => {
    const d = rules.get(sel);
    expect(d).toBeDefined();
    expect(d!.outlineNone).toBe(false);
    expect(isMatOutline(d!.outline)).toBe(true);
    expect(isMatInner(d!.boxShadow)).toBe(true);
  });

  it('the app-shell scroll region pads both block edges from the sticky-chrome vars', () => {
    const css = readFileSync(join(ROOT, 'src/app-shell/app-shell.css'), 'utf8');
    const root = postcss.parse(css);
    const props = new Map<string, string>();
    root.walkRules((rule) => {
      if (rule.selectors.some((s) => s.replace(/\s+/g, ' ').trim() === ".ag-app-shell [data-ag-slot='main']")) {
        rule.walkDecls((decl) => { props.set(decl.prop, decl.value); });
      }
    });
    expect(props.get('scroll-padding-block-start')).toBe('var(--ag-scroll-padding-top, 0px)');
    expect(props.get('scroll-padding-block-end')).toBe('var(--ag-scroll-padding-bottom, 0px)');
  });
});
